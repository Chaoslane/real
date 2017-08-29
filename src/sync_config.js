const Log = require('log');
const log = new Log('info');
const http = require('http');

// 发送http request 同步配置文件到shotpot
// 读取并同步配置文件
module.exports = function sync2shotpot(rhconf) {
    let data = JSON.stringify(rhconf);
    rhconf.servers.forEach((server) => {
        log.info(`Sync conf to shotpot: ${server.host}:${server.port}`);
        let req = http.request({
            host: server.host,
            port: server.port,
            method: 'POST',
            path: '/realhook/set_checkpoint',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        }, (res) => {
            res.setEncoding('utf8');
            log.info(`Shotpot: ${server.host}:${server.port} STATUS: ${res.statusCode}`);
            res.on('data', (chunk) => {
                log.info(`Shotpot: ${server.host}:${server.port} BODY: ${chunk}`)
            });
            res.on('end', () => {
                log.info(`Shotpot: ${server.host}:${server.port} Finished.`)
            })
        });

        req.on('error', (e) => {
            log.error(`Shotpot: ${server.host}:${server.port} ${e.message}`)
        });
        req.write(data);
        req.end()
    });
};






