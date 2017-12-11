const Redis = require('ioredis');
const redisCli = new Redis(rhConf.redis);
const schedule = require('node-schedule');


// 设置定时刷新时间
setInterval(flushStatus, 1000);
schedule.scheduleJob('*/5 * * * *', () => {
    flush5Minutes();
});


// statement emitStat
const emitStat = {};
(() => {
    emitStat.summary = {
        pv: 0,
        uv: 0,
        chain_uv: 0,
        speed_uv: 0,
        iuv: 0,
        chain_iuv: 0,
        speed_iuv: 0,
        history_uv: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        history_iuv: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    };

    emitStat.campaigns = [];
    rhConf.cprules.forEach((cprule) => {
        emitStat.campaigns.push({
            name: cprule.name,
            // UV 环比、速率
            uv: 0,
            chain_uv: 0,
            speed_uv: 0,
            history_uv: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            // 当前UV、环比、速率
            iuv: 0,
            chain_iuv: 0,
            speed_iuv: 0,
            history_iuv: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            // 累计成功次数 环比、速率
            suc_time: 0,
            chain_suc: 0,
            speed_suc: 0,
            history_suc: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            // 成功率 只统计当前的
            isuc_rate: 0,
            history_isuc: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        });
    });

    emitStat.areas = rhConf.areas;
    // console.log(JSON.stringify(emitStat));
})();


function flushStatus() {
    redisCli.get('summary_pv', (err, result) => {
        // if (result > 0) emitStat.summary.pv = result;
    });
    redisCli.pfcount('summary_uv', (err, result) => {
        if (result > 0) emitStat.summary.uv = result;
    });
    redisCli.pfcount('summary_iuv', (err, result) => {
        if (result > 0) emitStat.summary.iuv = result;
    });

    emitStat.areas.forEach((area) => {
        redisCli.pfcount(`${area.alias}_uv`, (err, result) => {
            if (result > 0) area.uv = result;
        });
        redisCli.pfcount(`${area.alias}_iuv`, (err, result) => {
            if (result > 0) area.iuv = result;
        });
    });

    emitStat.campaigns.forEach((campaign) => {
        redisCli.pfcount(`${campaign.name}_uv`, (err, result) => {
            if (result > 0) campaign.uv = result;
        });

        redisCli.pfcount(`${campaign.name}_iuv`, (err, result) => {
            if (result > 0) campaign.iuv = result;
        })

        redisCli.get(`${campaign.name}_suc`, (err, result) => {
            if (result > 0) {
                campaign.suc_time = parseInt(result);
            }
        });
        redisCli.get(`${campaign.name}_isuc`, (err, result) => {
            if (result > 0) {
                const isuc_time = parseInt(result);
                redisCli.get(`${campaign.name}_ifail`, (err, result) => {
                    if (result > 0) {
                        const all = isuc_time + parseInt(result);
                        campaign.isuc_rate = parseFloat((isuc_time / all * 100).toFixed(2));
                    }
                });
            }
        });
    });

    console.log(JSON.stringify(emitStat));
}


function flush5Minutes() {
    // 每5分钟更新一次数组，shift+push
    // 每个数组保存288个元素 用于计算日环比
    // UV
    emitStat.summary.chain_uv = operChain(emitStat.summary.history_uv, emitStat.summary.uv);
    emitStat.summary.speed_uv = operSpeed(emitStat.summary.history_uv, emitStat.summary.uv);

    // IUV
    emitStat.summary.chain_iuv = operChain(emitStat.summary.history_iuv, emitStat.summary.iuv);
    emitStat.summary.speed_iuv = operSpeed(emitStat.summary.history_iuv, emitStat.summary.iuv);
    emitStat.summary.iuv = 0;
    redisCli.del(`summary_iuv`);

    // 遍历areas
    emitStat.areas.forEach((area) => {
        redisCli.del(`${area.alias}_iuv`);
        area.iuv = 0;
    });

    // 遍历campaigns
    emitStat.campaigns.forEach((campaign) => {
        // 累计UV
        campaign.chain_uv = operChain(campaign.history_uv, campaign.uv);
        campaign.speed_uv = operSpeed(campaign.history_uv, campaign.uv);

        // IUV
        campaign.chain_iuv = operChain(campaign.history_iuv, campaign.iuv);
        campaign.speed_iuv = operSpeed(campaign.history_iuv, campaign.iuv);
        redisCli.del(`${campaign.name}_iuv`);
        campaign.iuv = 0;

        // 累计成功量
        campaign.chain_suc = operChain(campaign.history_suc, campaign.suc_time);
        campaign.speed_suc = operSpeed(campaign.history_suc, campaign.suc_time);

        // 当前成功量
        campaign.history_isuc.push(campaign.isuc_rate);
        if(campaign.history_isuc.length > 21) {
            campaign.history_isuc.shift();
        }
        redisCli.del(`${campaign.name}_isuc`);
        redisCli.del(`${campaign.name}_ifail`);
    });
}


/**
 * 计算日环比，需要保留每个时间刻度的值，两天相同时刻的值做除法
 * 数组较长，288个
 * @param array 数组
 * @param value 当前时间刻度的值
 * @returns {number}
 */
function operChain(array, value){
    array.push(value);
    if (array.length > 288)
        array.shift();

    // 日环比=（今日此刻-昨日此刻）/昨日此刻值
    const last = array[array.length - 1];
    const first = array[0];

    let chain = 0;
    if (last !== 0 && first !== 0){
        chain = (last - first) / first;
    }
    return parseFloat((chain*100).toFixed(2));
};


/**
 * 求速率，当前时间刻度减去上个时间刻度的值
 * @param array 数组
 * @param value 当前时间刻度的值
 * @returns {number}
 */
function operSpeed(array, value){
    const last = array[array.length - 1];
    const last1 = array[array.length - 2];
    // 当前计数减去上一个计数 即为速率
    let speed = 0;
    if (last !==0 && last1 !== 0){
        speed =  last - last1;
    }
    return parseInt(speed);
};

module.exports = emitStat;