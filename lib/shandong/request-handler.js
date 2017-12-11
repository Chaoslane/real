const utils = require('../utils');
const queryString = require('querystring');
const Redis = require('ioredis');
const redisCli = new Redis(rhConf.redis);


module.exports = function (ctx) {
    let hit = ctx.request.body;
    //console.log(hit);
    if (utils.isJson(hit)) {
        let qury = queryString.parse(hit.qury);
        let co_f = qury['WT.co_f'];
        let si_x = qury['WT.si_x'];

        redisCli.incr('summary_pv');
        redisCli.pfadd('summary_uv', co_f);

        if ('99' === si_x) {
            redisCli.pfadd('summary_suc', co_f);
        }

        rhConf.cprules.forEach(cprule => {
            if (hit.name.indexOf(cprule.name) > -1) {
                // console.log(hit);
                cprule.step.forEach(s => {
                    if (s.code === "url" || s.code === si_x) {
                        redisCli.pfadd(`${cprule.name}_${s.code}_uv`, co_f);
                    }
                });
            }
        });
    }
};



