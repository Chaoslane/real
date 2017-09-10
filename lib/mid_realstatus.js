const cluster = require('cluster');
const Log = require('log');
const log = new Log('info');
const Redis = require('ioredis');
const redis = new Redis(6379, '192.168.4.2');
const iputil = require('./iputil');
const querystring = require('querystring');
const rhconf = require('../conf/realhook.json');

/**
 * 初始化json对象保存所有计数
 * @returns {{summary: {campaign: number, pv: number, uv: number, iuv: number, history_uv: Array, history_iuv: Array, uv_set: *, iuv_set: *}, areas: Array, campaigns: Array}}
 */
const initRealObj = function () {
    let status = {
        summary: {
            campaign_size: 0,
            pv: 0,
            uv: 0,
            iuv: 0,
            chain_uv: 0,
            speed_uv: 0,
            chain_iuv: 0,
            speed_iuv: 0,
            history_uv: [],
            history_iuv: []
        },
        areas:[],
        campaigns: []
    };

    iputil.citys.forEach((city) => {
        status.areas.push({
            alias: city.alias,
            name : city.name,
            uv   : 0,
            iuv  : 0
        });
    });

    rhconf.cprules.forEach((cprule) => {
        status.summary.campaign_size += 1;
        status.campaigns.push({
            name: cprule.name,
            uv: 0,
            iuv: 0,
            chain_uv: 0,
            speed_uv: 0,
            chain_iuv: 0,
            speed_iuv: 0,
            chain_suc: 0,
            speed_suc: 0,
            suc_time: 0,
            suc_rate: 0,
            history_uv: [],
            history_iuv: [],
            history_suc: []
        });
    });
    return status;
};

let status = initRealObj();


/**
 * 中间件async函数，处理request请求
 * @returns {Function}
 */
const keepReal = function (ctx) {
    redis.incr('summary_pv');
    let hit = ctx.request.body;
    // console.log(JSON.stringify(hit));
    let qury = querystring.parse(hit.qury);
    let mobi = qury['WT.mobile'];
    let code = qury['WT.si_x'];

    if (mobi && mobi.length === 11) {
        redis.pfadd('summary_uv', mobi);
        redis.pfadd('summary_iuv', mobi);
    }

    status.campaigns.forEach((campaign) => {
        hit.name.forEach((hitname) => {
            if (campaign.name === hitname) {
                if (mobi && mobi.length === 11) {
                    redis.pfadd(`${campaign.name}_uv`, mobi);
                    redis.pfadd(`${campaign.name}_iuv`, mobi);
                }else if ('rwk' === hitname || 'llzk' === hitname) {
                    redis.pfadd(`${campaign.name}_uv`, qury['WT.co_f']);
                    redis.pfadd(`${campaign.name}_iuv`, qury['WT.co_f']);
                }
                if ('99' === code) redis.incr(`${campaign.name}_suc`);
            }
        });
    });
};

module.exports.keepReal = function () {
    return async function (ctx, next) {
        try {
            keepReal(ctx);
            await next();
        } catch (err) {
            ctx.status = err.status || 500;
            ctx.body = err.message;
            ctx.app.emit('error', err, ctx);
        }
    }
};

module.exports.status = status;