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
            log.error(`Shotpot: ${server.host}:${server.port} ${e.message}`);
            log.error("Please check shotpot is online and restart Realhook.")
            process.exit(1);
        });
        req.write(postData);
        req.end();
    });
};


// 时区问题加8小时
exports.addHours = function (timeStr) {
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


// 判断是否是json对象
exports.isJson = function (obj) {
    return typeof(obj) === "object"
        && Object.prototype.toString.call(obj).toLowerCase() === "[object object]"
        && !obj.length;
};


// 判断时间是否在范围
exports.timeIsBetween= function(dateTime ,start, end) {
    return moment(dateTime).isBetween(start, end);
}


// 判断时间是否超过5天
exports.timeIsBeforeDays = function (dateTime) {
    let daysAgo = moment(new Date()).add(-5, 'days');
    return moment(dateTime).isBefore(daysAgo);
};

