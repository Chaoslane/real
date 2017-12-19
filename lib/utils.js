const Log = require('log');
const log = new Log('info');
const http = require('http');
const moment = require('moment');


// 发送http request 同步配置文件到shotpot
exports.sync2shotpot = function sync2shotpot(rhconf) {
    let postData = JSON.stringify(rhconf);
    rhconf.servers.forEach((server) => {
        log.info(`Sync conf to shotpot: ${server.host}:${server.port}`);
        let options = {
            host: server.host,
            port: server.port,
            path: server.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        let req = http.request(options, (res) => {
            res.setEncoding('utf8');
            log.info(`Shotpot: ${server.host}:${server.port} STATUS: ${res.statusCode}`);
            res.on('data', (chunk) => {
                log.info(`Shotpot: ${server.host}:${server.port} BODY Length: ${chunk}`);
            });
            res.on('end', () => {
                log.info(`Shotpot: ${server.host}:${server.port} Finished.`)
            });
        });

        req.on('error', (e) => {
            log.error(`Shotpot: ${server.host}:${server.port} ${e.message}, connect failed`);
            log.error("Please check shotpot is online and restart Realhook.")
            process.exit(1);
        });
        req.write(postData);
        req.end();
    });
};


// 时区问题加8小时
exports.add8Hours = function (timeStr) {
    let newTime = moment('2017-01-01 00:00:00').add(8, 'hours').toISOString();
    return newTime.substr(0, 19).replace("T", " ");
};


// 判断是否是json对象
exports.isJson = function (obj) {
    return typeof(obj) === "object"
        && Object.prototype.toString.call(obj).toLowerCase() === "[object object]"
        && !obj.length;
};


