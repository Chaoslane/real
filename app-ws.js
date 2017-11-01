#!/usr/bin/env node

const server = require('http').Server();
const io = require('socket.io')(server);
const realhook = io.of('/realhook');

const Log = require('log');
const log = new Log('info');

const rhconf = require('./conf/realhook.json');
const status = require('./lib/mid_realstatus').status;

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
 * 定时从redis取数，生成实时json数据
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

    status.campaigns.forEach((campaign) => {
        redisClient.pfcount(`${campaign.name}_uv`, (err, result) => {
            if (result > 0) campaign.uv = result;
        });
        redisClient.pfcount(`${campaign.name}_iuv`, (err, result) => {
            if (result > 0) campaign.iuv = result;
        })
        redisClient.get(`${campaign.name}_suc`, (err, result) => {
            if (result > 0) campaign.suc_time = result;
        });
        if (campaign.uv !== 0) {
            campaign.suc_rate = campaign.suc_time / campaign.uv;
        }
    });

    let tick = new Date();
    if (tick.getSeconds() === 0) {
        // 0点归零所有计数
        if (tick.getHours() === 0 && tick.getMinutes() === 0) {
            log.info('Re initial status every midnight');
            redisClient.del('summary_pv');
            redisClient.del('summary_uv');
            status.summary.pv = 0;
            status.summary.uv = 0;

            status.campaigns.forEach((campaign) => {
                redisClient.del(`${campaign.name}_uv`);
                redisClient.del(`${campaign.name}_suc`);
                campaign.uv = 0;
                campaign.suc_time = 0;
                campaign.suc_rate = 0;
            });
        }

        // 每5分钟更新一次数组，shift+push
        // 每个数组保存288个元素 用于计算日环比
        if (tick.getMinutes() % 5 === 0) {
            log.info('Flush status every 5 minutes');
            // UV
            status.summary.chain_uv = operChain("summary_h_uv", status.summary.uv);
            status.summary.speed_uv = operSpeed(status.summary.history_uv, status.summary.uv);

            // IUV
            status.summary.chain_iuv = operChain("summary_h_iuv", status.summary.iuv);
            status.summary.speed_iuv = operSpeed(status.summary.history_iuv, status.summary.iuv);
            status.summary.iuv = 0;
            redisClient.del(`summary_iuv`);

            // 遍历campaigns
            status.campaigns.forEach((campaign) => {
                // 累计UV
                campaign.chain_iuv = operChain(`${campaign.name}_h_uv`, campaign.uv);
                campaign.speed_uv = operSpeed(campaign.history_uv, campaign.uv);

                // IUV
                campaign.chain_iuv = operChain(`${campaign.name}_h_iuv`, campaign.iuv);
                campaign.speed_iuv = operSpeed(campaign.history_iuv, campaign.iuv);
                campaign.iuv = 0;
                redisClient.del(`${campaign.name}_iuv`);

                // 累计成功量
                campaign.chain_suc = operChain(`${campaign.name}_h_suc;`, campaign.suc_time);
                campaign.speed_suc = operSpeed(campaign.history_suc, campaign.suc_time)

                // 当前成功量
                operSpeed(campaign.history_isuc, campaign.isuc_time);
            });
        }
    }
};

setInterval(flushStatus, 1000);


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
    log.info(`Start real analysis module, WebSocket is listen on ${port}.`)
});


module.exports = server;