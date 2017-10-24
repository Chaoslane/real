// ------ TCP client ------
const net = require('net');
const socket = new net.Socket();
const Log = require('log');
const log = new Log('info');
const querystring = require('querystring');

const rhconf = require('../conf/realhook.json');
const tcpOpt = rhconf.tcpserver;

socket.connect(tcpOpt, () => {
    log.info(`Connect TCP server succeed: ${tcpOpt.host}`)
});

socket.on('data', () => {});

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
        // console.log(JSON.stringify(ctx.request.body));
        ctx.request.body.forEach((hit) => {
            const time = addHours(hit.time);
            socket.write(
                JSON.stringify({
                    timestamp: time,
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

const addHours = function (timeStr) {
    let timestamp = new Date(timeStr).getTime() + 8 * 3600 * 1000;
    let newDate = new Date(new Date(timestamp).toLocaleString());
    let yyyy = newDate.getFullYear();
    let MM = newDate.getMonth() < 9 ? '0' + (newDate.getMonth() + 1) : (newDate.getMonth() + 1);
    let dd = newDate.getDate() < 10 ? ('0' + newDate.getDate()) : (newDate.getDate());
    let HH = newDate.getHours() < 10 ? ('0' + newDate.getHours()) : (newDate.getHours());
    let mm = newDate.getMinutes() < 10 ? ('0' + newDate.getMinutes()) : (newDate.getMinutes());
    let ss = newDate.getSeconds() < 10 ? ('0' + newDate.getSeconds()) : (newDate.getSeconds());
    return yyyy + '-' + MM + '-' + dd + ' ' + HH + ':' + mm + ':' + ss;
};

