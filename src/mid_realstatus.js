const hll = require('hll');
const rhconf = require('../conf/realhook.json');
const querystring = require('querystring');
const iputil = require('./iputil');

let em_status;

initRealObj(rhconf);

function initRealObj(rhconf) {
    em_status = {
        summary: {
            campaign: 0,
            uv: 0,
            iuv: 0,
            history_uv: [],
            history_iuv: [],
            uv_set: hll(),
            iuv_set: hll()
        },
        areas:[],
        campaigns: []
    };
    iputil.citys.forEach((city) => {
        em_status.areas.push({name: city, uv: 0});
    });
    rhconf.cprules.forEach((cprule) => {
        em_status.summary.campaign += 1;
        em_status.campaigns.push({
            name: cprule.name,
            uv: 0,
            iuv: 0,
            history_uv: [],
            history_iuv: [],
            suc_time: 0,
            suc_rate: 0,
            uv_set: hll(),
            iuv_set: hll()
        });
    });
}

setInterval(() => {
    em_status.summary.uv = em_status.summary.uv_set.estimate();
    em_status.summary.iuv = em_status.summary.uv_set.estimate();

    em_status.campaigns.forEach((campaign) => {
        campaign.uv = campaign.uv_set.estimate();
        campaign.iuv = campaign.iuv_set.estimate();
        campaign.suc_rate = campaign.suc_time / campaign.iuv;
    });
}, 1000);

setInterval(() => {
    if (em_status.summary.history_uv.length === 10) {
        em_status.summary.history_uv.shift();
    }
    em_status.summary.history_uv.push(em_status.summary.uv);

    if (em_status.summary.history_iuv.length === 10) {
        em_status.summary.history_iuv.shift();
    }
    em_status.summary.history_iuv.push(em_status.summary.iuv);


    em_status.campaigns.forEach((campaign) => {
        if (campaign.history_uv.length === 10) {
            campaign.history_uv.shift();
        }
        campaign.history_uv.push(campaign.uv);

        if (campaign.history_iuv.length === 10) {
            campaign.history_iuv.shift();
        }
        campaign.history_iuv.push(campaign.iuv);
    });

}, 1000 * 10);


function keepReal(ctx) {
    ctx.request.body.forEach((hit) => {
        let query = querystring.parse(hit.qury);
        let mobile = query['WT.mobile'];
        let status = query['WT.si_x'];

        em_status.summary.uv_set.insert(mobile);
        em_status.summary.iuv_set.insert(mobile);

        em_status.campaigns.forEach((campaign) => {
            if (campaign.name === hit.name) {
                campaign.uv_set.insert(mobile);
                campaign.iuv_set.insert(mobile);
                if ('99' === status) {
                    campaign.suc_time += 1;
                }
            }
        });
    });
}

module.exports.keepReal = function () {
    return async function (ctx, next) {
        keepReal(ctx);
        await next();
    }
};

module.exports.status = em_status;