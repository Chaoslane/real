const Log = require('log');
const log = new Log('info');
const hll = require('hll');
const querystring = require('querystring');

const rhconf = require('../conf/realhook.json');
const iputil = require('./iputil');


/**
 * 初始化json对象保存所有计数
 * @returns {{summary: {campaign: number, pv: number, uv: number, iuv: number, history_uv: Array, history_iuv: Array, uv_set: *, iuv_set: *}, areas: Array, campaigns: Array}}
 */
const initRealObj = function () {
    let status = {
        summary: {
            campaign: 0,
            pv: 0,
            uv: 0,
            iuv: 0,
            chain_uv: 0,
            chain_iuv: 0,
            speed_uv: 0,
            speed_iuv: 0,
            history_uv: [],
            history_iuv: [],
            uv_set: hll(),
            iuv_set: hll()
        },
        areas: [],
        campaigns: []
    };

    iputil.citys.forEach((city) => {
        city.uv = 0;
        status.areas.push(city);
    });
    rhconf.cprules.forEach((cprule) => {
        status.summary.campaign += 1;
        status.campaigns.push({
            name: cprule.name,
            uv: 0,
            iuv: 0,
            time: [],
            chain_uv: 0,
            chain_iuv: 0,
            speed_uv: 0,
            speed_iuv: 0,
            suc_time: 0,
            suc_rate: 0,
            history_uv: [],
            history_iuv: [],
            history_suc: [],
            uv_set: hll(),
            iuv_set: hll()
        });
    });
    return status;
};

let status = initRealObj();

/**
 * 定时更新计数
 */
const updateStatus = function () {
    status.summary.uv = status.summary.uv_set.estimate();
    status.summary.iuv = status.summary.iuv_set.estimate();

    status.campaigns.forEach((campaign) => {
        campaign.uv = campaign.uv_set.estimate();
        campaign.iuv = campaign.iuv_set.estimate();
        if (campaign.iuv !== 0) {
            campaign.suc_rate = campaign.suc_time / campaign.iuv;
        }
    });

    let tick = new Date();
    if (tick.getSeconds() === 0) {
        if (tick.getHours() === 0 && tick.getMinutes() === 0) {
            status.summary.pv = 0;
            status.summary.uv = 0;
            status.summary.iuv = 0;
            status.summary.uv_set = hll();
            status.summary.iuv_set = hll();

            status.campaigns.forEach((campaign) => {
                campaign.uv = 0;
                campaign.iuv = 0;
                campaign.suc_time = 0;
                campaign.suc_rate = 0;
                campaign.uv_set = hll();
                campaign.iuv_set = hll();
            });
        }

        // 每5分钟更新一次数组，shift+push
        // 每个数组保存288个元素 用于计算日环比

        if (tick.getMinutes() % 1 === 0) {
            let h_uv = status.summary.history_uv;
            if (h_uv.length > 288) {
                h_uv.shift();
                if (h_uv[0] !== 0) {
                    // 当前计数除以数组索引为0的计数 即为日环比
                    status.summary.chain_uv = status.summary.uv / h_uv[0];
                }
            }
            if (h_uv.length > 1) {
                status.summary.speed_uv = status.summary.uv - h_uv[h_uv.length - 1];
            }
            h_uv.push(status.summary.uv);


            let h_iuv = status.summary.history_iuv;
            if (h_iuv.length > 288) {
                h_iuv.shift();
                if (h_iuv[0] !== 0) {
                    status.summary.chain_iuv = status.summary.iuv / h_iuv[0];
                }
            }
            if (h_iuv.length > 1) {
                status.summary.speed_iuv = status.summary.iuv - h_iuv[h_iuv.length - 1];
            }
            h_iuv.push(status.summary.iuv);
            status.summary.iuv = 0;
            status.summary.iuv_set = hll();

            status.campaigns.forEach((campaign) => {
                if (campaign.history_uv.length > 288) {
                    campaign.history_uv.shift();
                    if (campaign.history_uv[0] !== 0) {
                        campaign.chain_uv = campaign.uv / campaign.history_uv[0];
                    }
                }
                if (campaign.history_uv.length > 1) {
                    campaign.speed_uv = campaign.uv - campaign.history_uv[campaign.history_uv.length - 1];
                }
                campaign.history_uv.push(campaign.uv);


                if (campaign.history_iuv.length > 288) {
                    campaign.history_iuv.shift();
                    if (campaign.history_iuv[0] !== 0) {
                        campaign.chain_iuv = campaign.iuv / campaign.history_iuv[0];
                    }
                }
                if (campaign.history_iuv.length > 1) {
                    campaign.speed_iuv = campaign.iuv - campaign.history_iuv[campaign.history_iuv.length - 1];
                }
                campaign.history_iuv.push(campaign.iuv);

                campaign.iuv = 0;
                campaign.iuv_set = hll();

                if (campaign.history_suc.length > 10) {
                    campaign.history_suc.shift();
                }
                campaign.history_suc.push(campaign.suc_rate);
            });
        }
    }
};

setInterval(updateStatus, 500);

/**
 * 中间件async函数，处理request请求
 * @returns {Function}
 */
const keepReal = function () {
    return async function (ctx, next) {
        console.log(JSON.stringify(ctx.request.body));
        // if (status.summary.pv % 10000 === 0) {
        //     log.info(`Accept ${status.summary.pv} hits`)
        // }
        status.summary.pv += 1;
        let hit     = ctx.request.body;
        let query   = querystring.parse(hit.qury);
        let mobile  = query['WT.mobile'];
        let code    = query['WT.si_x'];

        if (mobile && mobile.length === 11) {
            status.summary.uv_set.insert(mobile);
            status.summary.iuv_set.insert(mobile);
        }

        let city = iputil.ip2City(hit.c_ip);
        status.areas.forEach((area) => {
            if (area.name === city) {
                area.uv += 1;
            }
        });

        status.campaigns.forEach((campaign) => {
            hit.name.forEach((hitname) => {
                if (campaign.name === hitname) {
                    if (mobile && mobile.length === 11) {
                        campaign.uv_set.insert(mobile);
                        campaign.iuv_set.insert(mobile);
                    }
                    if ('99' === code) {
                        campaign.suc_time += 1;
                    }
                }
            });
        });
        await next();
    }
};


module.exports.keepReal = keepReal;
module.exports.status = status;