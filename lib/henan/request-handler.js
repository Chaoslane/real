const utils = require('../utils');
const queryString = require('querystring');
const Redis = require('ioredis');
const redisCli = new Redis(rhConf.redis);


module.exports = function (ctx) {
    let hit = ctx.request.body;
    //console.log(hit);
    if (utils.isJson(hit)) {
        redisCli.incr('summary_pv');
        let qury = queryString.parse(hit.qury);
        let mobi = qury['WT.mobile'];
        let ckid = qury['WT.co_f'];
        let code = qury['WT.si_x'];
        let city = qury['WT.city'];

        if (mobi && mobi.length === 11) {
            redisCli.pfadd('summary_uv', mobi);
            redisCli.pfadd('summary_iuv', mobi);
        }

        rhConf.areas.forEach((area) => {
            if (area.name.indexOf(city) > -1) {
                redisCli.pfadd(`${area.alias}_uv`, mobi);
                redisCli.pfadd(`${area.alias}_iuv`, mobi);
            }
        });

        rhConf.cprules.forEach((campaign) => {
            hit.name.forEach((hitname) => {
                if (campaign.name === hitname) {
                    if (mobi && mobi.length === 11) {
                        redisCli.pfadd(`${campaign.name}_uv`, mobi);
                        redisCli.pfadd(`${campaign.name}_iuv`, mobi);
                        if ('99' === code) {
                            redisCli.incr(`${campaign.name}_suc`);
                            redisCli.incr(`${campaign.name}_isuc`);
                        } else if ('-99' === code) {
                            redisCli.incr(`${campaign.name}_ifail`);
                        }
                    } else if ('rwk' === hitname || 'llzk' === hitname) {
                        redisCli.pfadd(`${campaign.name}_uv`, ckid);
                        redisCli.pfadd(`${campaign.name}_iuv`, ckid);
                        if ('99' === code) {
                            redisCli.incr(`${campaign.name}_suc`);
                            redisCli.incr(`${campaign.name}_isuc`);
                        } else if ('-99' === code) {
                            redisCli.incr(`${campaign.name}_ifail`);
                        }
                    }
                }
            });
        });
    }
};



