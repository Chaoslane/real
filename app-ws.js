#!/usr/bin/env node

const server = require('http').Server();
const io = require('socket.io')(server);
const realhook = io.of('/realhook');

const Log = require('log');
const log = new Log('info');

const rhconf = require('./conf/realhook.json');
const sync_config = require('./lib/sync_config');
const status = require('./lib/mid_realstatus').status;

const Redis = require('ioredis');
const redis = new Redis(rhconf.redis);

// 同步配置文件到shotpot
sync_config(rhconf);

/**
 * 定时从redis取数，生成实时json数据
 */
const flushStatus = function () {
    redis.pipeline().get('summary_pv', (err, result) => {
        status.summary.pv = result;
    }).pfcount('summary_uv', (err, result) => {
        status.summary.uv = result;
    }).pfcount('summary_iuv', (err, result) => {
        status.summary.iuv = result;
    }).exec();

    status.campaigns.forEach((campaign) => {
        redis.pipeline().pfcount(`${campaign.name}_uv`, (err, result) => {
            if (result > 0) campaign.uv = result;
        }).pfcount(`${campaign.name}_iuv`, (err, result) => {
            if (result > 0) campaign.iuv = result;
        }).get(`${campaign.name}_suc`, (err, result) => {
            if (result > 0) campaign.suc_time = result;
        }).exec();

        if (campaign.iuv !== 0) {
            campaign.suc_rate = (campaign.suc_time / campaign.iuv).toFixed(2);
        }
    });

    let tick = new Date();
    if (tick.getSeconds() === 0) {
        if (tick.getHours() === 0 && tick.getMinutes() === 0) {
            log.info('Re initial status every midnight');
            redis.flushall();
            status.summary.pv = 0;
            status.summary.uv = 0;
            status.summary.iuv = 0;

            status.campaigns.forEach((campaign) => {
                campaign.uv = 0;
                campaign.iuv = 0;
                campaign.suc_time = 0;
                campaign.suc_rate = 0;
            });
        }

        // 每5分钟更新一次数组，shift+push
        // 每个数组保存288个元素 用于计算日环比
        if (tick.getMinutes() % 5 === 0) {
            log.info('Flush status every 5 minutes');
            // UV
            let h_uv = status.summary.history_uv;
            if (h_uv.length > 288) {
                h_uv.shift();
                if (h_uv[0] !== 0) {
                    // 当前计数除以数组索引为0的计数 即为日环比
                    status.summary.chain_uv = (status.summary.uv / h_uv[0] - 1).toFixed(2);
                }
            }
            if (h_uv.length > 1) {
                status.summary.speed_uv = status.summary.uv - h_uv[h_uv.length - 1];
            }
            h_uv.push(status.summary.uv);

            // IUV
            let h_iuv = status.summary.history_iuv;
            if (h_iuv.length > 288) {
                h_iuv.shift();
                if (h_iuv[0] !== 0) {
                    status.summary.chain_iuv = (status.summary.iuv / h_iuv[0] - 1).toFixed(2);
                }
            }
            if (h_iuv.length > 1) {
                status.summary.speed_iuv = status.summary.iuv - h_iuv[h_iuv.length - 1];
            }
            h_iuv.push(status.summary.iuv);
            status.summary.iuv = 0;
            redis.del(`summary_iuv`);

            // 遍历 campaigns 并计算
            status.campaigns.forEach((campaign) => {
                // UV
                let historyUv = campaign.history_uv;
                if (historyUv.length > 288) {
                    historyUv.shift();
                    if (historyUv[0] !== 0) {
                        campaign.chain_uv = (campaign.uv / historyUv[0] - 1).toFixed(2);
                    }
                }
                if (historyUv.length > 1) {
                    campaign.speed_uv = campaign.uv - historyUv[historyUv.length - 1];
                }
                historyUv.push(campaign.uv);

                // IUV
                let historyIuv = campaign.history_iuv;
                if (historyIuv.length > 288) {
                    historyIuv.shift();
                    if (historyIuv[0] !== 0) {
                        campaign.chain_iuv = (campaign.iuv / historyIuv[0] - 1).toFixed(2);
                    }
                }
                if (historyIuv.length > 1) {
                    campaign.speed_iuv = campaign.iuv - historyIuv[historyIuv.length - 1];
                }
                historyIuv.push(campaign.iuv);
                campaign.iuv = 0;
                redis.del(`${campaign.name}_iuv`);

                // 成功率
                let historySuc = campaign.history_suc;
                if (historySuc.length > 288) {
                    historySuc.shift();
                    if (historySuc[0] !== 0) {
                        campaign.chain_suc = (campaign.suc_rate / historySuc[0] - 1).toFixed(2);
                    }
                }
                if (historySuc.length > 1) {
                    campaign.speed_suc = campaign.speed_suc - historySuc[historySuc.length - 1];
                }
                historySuc.push(campaign.suc_rate);
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

server.on('error', onError);
server.on('listening', onListening);

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            log.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            log.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    log.info('Realhook web socket service listening on ' + bind);
}

module.exports = server;
