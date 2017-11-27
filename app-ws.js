#!/usr/bin/env node

const server = require('http').Server();
const io = require('socket.io')(server);
const realhook = io.of('/realhook');

const Log = require('log');
const log = new Log('info');
const fs = require('fs');

const schedule = require('node-schedule');
const status = require('./lib/mid_realstatus').status;
const utils = require('./lib/utils');

const redis = require('redis');
const redisClient = redis.createClient(rhconf.redis);
const port = rhconf.realhook.websocket_port;

// 初始化redis
redisClient.flushdb();

/**
 * 计算日环比，需要保留每个时间刻度的值，两天相同时刻的值做除法
 * 数组较长，需要从redis中存取
 * @param key redis key
 * @param value 当前时间刻度的值
 * @returns {number}
 */
const operChain = (key, value) => {
    redisClient.rpush(key, value);
    redisClient.llen(key, (err, result) => {
        if (result > 288)
            redisClient.lpop(key);
    });
    redisClient.lindex(key, 0, (err, first) => {
        if (first!=0){
            redisClient.lindex(key, -1, (err, last) => {
                return (last/first).toFixed(2);
            });
        }
    });
    return 0;
};


/**
 * 求速率，当前时间刻度减去上个时间刻度的值
 * @param array json串中的数组
 * @param value 当前时间刻度的值
 * @returns {number}
 */
const operSpeed = (array, value) => {
    array.push(value);
    if (array.length > 20) array.shift();
    // 当前计数减去上一个计数 即为速率
    const last = array[array.length - 1];
    const last1 = array[array.length - 2];
    if (last && last != 0) {
        return last - last1;
    }
    return 0;
};


/**
 * 每秒从redis中读取UV值
 */
const flushStatus = function () {
    redisClient.get('summary_pv', (err, result) => {
        if (result > 0) status.summary.pv = result;
    });
    redisClient.pfcount('summary_uv', (err, result) => {
        if (result > 0) status.summary.uv = result;
    });
    redisClient.pfcount('summary_iuv', (err, result) => {
        if (result > 0) status.summary.iuv = result;
    });

    status.areas.forEach((area) => {
        redisClient.pfcount(`${area.alias}_uv`, (err, result) => {
            if (result > 0) area.uv = result;
        });
        redisClient.pfcount(`${area.alias}_iuv`, (err, result) => {
            if (result > 0) area.iuv = result;
        });
    });

    status.campaigns.forEach((campaign) => {
        redisClient.pfcount(`${campaign.name}_uv`, (err, result) => {
            if (result > 0) campaign.uv = result;
        });
        redisClient.pfcount(`${campaign.name}_iuv`, (err, result) => {
            if (result > 0) campaign.iuv = result;
        })
        redisClient.get(`${campaign.name}_suc`, (err, result) => {
            if (result > 0) campaign.suc_time = parseInt(result);
        });
        redisClient.get(`${campaign.name}_isuc`, (err, result) => {
            if (result > 0) campaign.isuc_time = parseInt(result);
        });
        redisClient.get(`${campaign.name}_fail`, (err, result) => {
            const all = campaign.suc_time + parseInt(result);
            campaign.suc_rate = campaign.suc_time / all * 100;
        });
    });
};


/*
 * 每五分钟从把当前UV值等，推入数组，更新数组，计算值。
 */
const flush5Minutes = function () {
    // 每5分钟更新一次数组，shift+push
    // 每个数组保存288个元素 用于计算日环比
    // UV
    status.summary.chain_uv = operChain("summary_h_uv", status.summary.uv);
    status.summary.speed_uv = operSpeed(status.summary.history_uv, status.summary.uv);

    // IUV
    status.summary.chain_iuv = operChain("summary_h_iuv", status.summary.iuv);
    status.summary.speed_iuv = operSpeed(status.summary.history_iuv, status.summary.iuv);
    status.summary.iuv = 0;
    redisClient.del(`summary_iuv`);

    // 遍历areas
    status.areas.forEach((area) => {
        redisClient.del(`${area.alias}_iuv`);
        area.iuv = 0;
    });

    // 遍历campaigns
    status.campaigns.forEach((campaign) => {
        // 累计UV
        campaign.chain_iuv = operChain(`${campaign.name}_h_uv`, campaign.uv);
        campaign.speed_uv = operSpeed(campaign.history_uv, campaign.uv);

        // IUV
        campaign.chain_iuv = operChain(`${campaign.name}_h_iuv`, campaign.iuv);
        campaign.speed_iuv = operSpeed(campaign.history_iuv, campaign.iuv);
        redisClient.del(`${campaign.name}_iuv`);
        campaign.iuv = 0;

        // 累计成功量
        campaign.chain_suc = operChain(`${campaign.name}_h_suc;`, campaign.suc_time);
        campaign.speed_suc = operSpeed(campaign.history_suc, campaign.suc_time)

        // 当前成功量
        operSpeed(campaign.history_isuc, campaign.isuc_time);
        redisClient.del(`${campaign.name}_isuc`);
        campaign.isuc_time = 0;
    });
};

/*
 * 每天凌晨刷新所有数据，但不包括history相关数组
 */
const flushMidNight = function () {
    log.info("Reinitial status every midnight");
    redisClient.del('summary_pv');
    redisClient.del('summary_uv');
    status.summary.pv = 0;
    status.summary.uv = 0;

    status.areas.forEach((area) => {
        redisClient.del(`${area.alias}_uv`);
        redisClient.del(`${area.alias}_iuv`);
        area.uv = 0;
    });

    status.campaigns.forEach((campaign) => {
        redisClient.del(`${campaign.name}_uv`);
        redisClient.del(`${campaign.name}_suc`);
        campaign.uv = 0;
        campaign.suc_time = 0;
        campaign.suc_rate = 0;
    });
}

/*
 * 检查uv数是否增长，不增长则重新发送request到sp
 */
const checkHealth = function () {
    if (status.summary.uv ===
        status.summary.history_uv[status.summary.history_uv.length-1]){
        log.warning("Checked shotpot connection unhealthy, request shotpot again.")
        utils.sync2shotpot(rhconf);
    }
}


// 定时任务
setInterval(flushStatus, 1000);
schedule.scheduleJob('*/5 * * * *', function () {
    flush5Minutes();
});
schedule.scheduleJob('*/1 * * * *', function () {
    setTimeout(checkHealth,5000);
});
schedule.scheduleJob('0 0 * * *', function () {
    flushMidNight();
});


/**
 *  socket.io 实时同步数据到 client
 */
realhook.on('connection', (socket) => {
    log.info(`New connection from: ${socket.handshake.address}`);
    socket.on('getstatus', () => {
        socket.emit('status', status);
    });
    socket.on('disconnect', (reason) => {
        log.info(`Client exit: ${reason}`);
    });
    socket.on('error', (error) => {
        log.error(error);
    });
});


server.listen(port);
server.on('error', (err)=> {
    log.error(`Start webSocket service failed`);
    throw err;
});
server.on('listening', ()=>{
    log.info(`WebSocket is listen on ${port}.`)
});


module.exports = server;