const Log = require('log');
const log = new Log('info');
const querystring = require('querystring');

const redis = require('redis');
const redisClient = redis.createClient(rhconf.redis);


/**
 * 初始化json对象保存所有计数
 * summary 汇总
 * campaigns[] 单一业务/活动
 * pv  日志条数统计
 * uv  一天内根据手机号或者cookieid去重统计
 * iuv 五分钟内根据手机号或者cookieid去重统计
 * chain* 环比
 * speed* 速率
 * suc_time 成功次数
 * suc_rate 成功率
 */
const initArray = (name) => {
    let array = [];
    for (let i = 0; i < 20; i++) {
        array.push(0);
        redisClient.rpush(name, 0);
    }
    return array;
};

let status = {
    summary: {
        pv: 0,
        uv: 0,
        chain_uv: 0,
        speed_uv: 0,
        iuv: 0,
        chain_iuv: 0,
        speed_iuv: 0,
        history_uv: initArray("summary_h_uv"),
        history_iuv: initArray("summary_h_iuv")
    },
    areas: [],
    campaigns: []
};

rhconf.cprules.forEach((cprule) => {
    status.campaigns.push({
        name: cprule.name,
        uv: 0,
        chain_uv: 0,
        speed_uv: 0,
        iuv: 0,
        chain_iuv: 0,
        speed_iuv: 0,
        suc_time: 0,
        suc_rate: 0,
        chain_suc: 0,
        speed_suc: 0,
        isuc_time: 0,
        isuc_rate: 0,
        history_uv: initArray(`${cprule.name}_h_uv`),
        history_iuv: initArray(`${cprule.name}_h_iuv`),
        history_suc: initArray(`${cprule.name}_h_suc`),
        history_isuc: initArray(`${cprule.name}_h_isuc`)
    });
});

status.areas = [
    {
        "alias": "A",
        "name": "郑州市"
    },
    {
        "alias": "B",
        "name": "开封市"
    },
    {
        "alias": "C",
        "name": "洛阳市"
    },
    {
        "alias": "D",
        "name": "平顶山市"
    },
    {
        "alias": "E",
        "name": "安阳市"
    },
    {
        "alias": "F",
        "name": "鹤壁市"
    },
    {
        "alias": "G",
        "name": "新乡市"
    },
    {
        "alias": "H",
        "name": "焦作市"
    },
    {
        "alias": "J",
        "name": "濮阳市"
    },
    {
        "alias": "K",
        "name": "许昌市"
    },
    {
        "alias": "L",
        "name": "漯河市"
    },
    {
        "alias": "M",
        "name": "三门峡市"
    },
    {
        "alias": "R",
        "name": "南阳市"
    },
    {
        "alias": "N",
        "name": "商丘市"
    },
    {
        "alias": "S",
        "name": "信阳市"
    },
    {
        "alias": "P",
        "name": "周口市"
    },
    {
        "alias": "Q",
        "name": "驻马店市"
    },
    {
        "alias": "U",
        "name": "济源市"
    }
];


/**
 * 导出status
 */
exports.status = status;
/**
 * 中间件async函数，处理request请求
 * @returns {Function}
 */
exports.keepReal = function () {
    return async function (ctx, next) {
        try {
            let hit = ctx.request.body;
            // console.log(JSON.stringify(hit));
            if ('qury' in hit) {
                redisClient.incr('summary_pv');
                let qury = querystring.parse(hit.qury);
                let mobi = qury['WT.mobile'];
                let ckid = qury['WT.co_f'];
                let code = qury['WT.si_x'];
                let city = qury['WT.city'];

                if (mobi && mobi.length === 11) {
                    redisClient.pfadd('summary_uv', mobi);
                    redisClient.pfadd('summary_iuv', mobi);
                }

                status.areas.forEach((area) => {
                    if (area.name.indexOf(city) > -1) {
                        redisClient.pfadd(`${area.alias}_uv`, mobi);
                        redisClient.pfadd(`${area.alias}_iuv`, mobi);
                    }
                });

                status.campaigns.forEach((campaign) => {
                    hit.name.forEach((hitname) => {
                        if (campaign.name === hitname) {
                            if (mobi && mobi.length === 11) {
                                redisClient.pfadd(`${campaign.name}_uv`, mobi);
                                redisClient.pfadd(`${campaign.name}_iuv`, mobi);
                                if ('99' === code) {
                                    redisClient.pfadd(`${campaign.name}_suc`, mobi);
                                    redisClient.pfadd(`${campaign.name}_isuc`, mobi);
                                }
                            } else if ('rwk' === hitname || 'llzk' === hitname) {
                                redisClient.pfadd(`${campaign.name}_uv`, ckid);
                                redisClient.pfadd(`${campaign.name}_iuv`, ckid);
                                if ('99' === code) {
                                    redisClient.pfadd(`${campaign.name}_suc`, ckid);
                                    redisClient.pfadd(`${campaign.name}_isuc`, ckid);
                                }
                            }
                        }
                    });
                });
            } else {
                log.error("Wrong json format:" + String(hit));
            }
            await next();
        } catch (err) {
            ctx.status = err.status || 500;
            ctx.body = err.message;
            ctx.app.emit('error', err, ctx);
        }
    }
};

// module.exports.keepReal = function () {
//     return async function (ctx, next) {
//         try {
//             keepReal(ctx);
//             await next();
//         } catch (err) {
//             ctx.status = err.status || 500;
//             ctx.body = err.message;
//             ctx.app.emit('error', err, ctx);
//         }
//     }
// };