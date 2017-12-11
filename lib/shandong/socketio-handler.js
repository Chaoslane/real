const Redis = require('ioredis');
const redisCli = new Redis(rhConf.redis);
const schedule = require('node-schedule');


// 设置定时刷新时间
setInterval(flushStatus, 10000);
schedule.scheduleJob('*/1 * * * *', () => {
    flush5Minutes();
});


// statement emitStat
const emitStat = {};
(() => {
    emitStat.summary = {
        pv: 0,
        uv: 0,
        suc_rate: 0
    };

    emitStat.campaigns = [];
    rhConf.cprules.forEach((obj) => {
        let campaign = {
            name: obj.name,
            alias: obj.alias,
            step: []
        };

        obj.step.forEach(step => {
            campaign.step.push({
                alias_uv: step.alias_uv,
                alias_con: step.alias_con,
                code: step.code,
                uv: 0,
                con_rate: 0,
                history_con_rate: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
            })
        });
        emitStat.campaigns.push(campaign);
    });
    // console.log(JSON.stringify(emitStat));
})();


function flushStatus() {
    redisCli.get('summary_pv', (err, result) => {
        if (result > 0) emitStat.summary.pv = result;
    });
    redisCli.pfcount('summary_uv', (err, result) => {
        if (result > 0) emitStat.summary.uv = result;
    });
    redisCli.pfcount('summary_suc', (err, result) => {
        if (result > 0) emitStat.summary.suc_rate
            = parseFloat((result / emitStat.summary.uv * 100).toFixed(2));
    });

    emitStat.campaigns.forEach(camp => {
        let step = camp.step;
        for (let i = 0; i < step.length; i++) {
            redisCli.pfcount(`${camp.name}_${step[i].code}_uv`).then(res => {
                step[i].uv = res;
            }).then(function () {
                // 计算转化率 step[i]/step[i-1]
                if (i > 0 && step[i - 1].uv > 0)
                    step[i].con_rate = parseFloat((step[i].uv / step[i - 1].uv * 100).toFixed(2));
                // 最后step计算step[0]的转化率
                if (i === step.length - 1)
                    step[0].con_rate = parseFloat((step[i].uv / step[0].uv * 100).toFixed(2));
            }).catch(err => {
                console.log(err);
            });
        }
    });

    console.log(JSON.stringify(emitStat));
}


function flush5Minutes() {
    emitStat.campaigns.forEach(camp => {
        camp.step.forEach(s => {
            if (s.history_con_rate.length > 20) {
                s.history_con_rate.shift();
            }
            s.history_con_rate.push(s.con_rate);
        });
    })
}


module.exports = emitStat;