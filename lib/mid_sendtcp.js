// ------ TCP client ------
const net = require('net');
const socket = new net.Socket();
const Log = require('log');
const log = new Log('info');
const querystring = require('querystring');

const config = require('../conf/tcpserver');
const tcpOpt = config.tcpserver;

socket.connect(tcpOpt, () => {
    log.info(`Connect TCP server succeed: ${tcpOpt.host}`)
});

socket.on('error', () => {
    log.error(`Connection error, please check TCP Server: ${tcpOpt.host}`);
    socket.destroy();
});

socket.on('close', () => {
    log.error(`Connection closed`);
    setTimeout(() => {
        socket.connect(tcpOpt);
    }, 1000);
});


/**
 * 解析post请求中的json为对象
 * @param ctx
 */
module.exports = function () {
    return async function (ctx, next) {
        console.log(JSON.stringify(ctx.request.body));
        ctx.request.body.forEach((hit) => {
            socket.write(
                JSON.stringify({
                    timestamp: hit.time,
                    request: {
                        host: hit.host,
                        path: hit.stem,
                        // query转为js对象，取消 url decode
                        qury: querystring.parse(hit.qury, '&', '=', {decodeURIComponent: s => s}),
                        ckie: hit.ckid
                    }
                }) + '\n');
        });
        await next();
    }
};

