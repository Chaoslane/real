#!/usr/bin/env node

const Log = require('log');
const log = new Log('info');
const fs = require('fs');
const http = require('http');
const hll = require('hll');

// configPath
const rhconfPath = `${__dirname}/../conf/realhook.json`;
const rhconf = readConf(rhconfPath);

let em_status;

sync2shotpot(rhconf);
initRealObj(rhconf);


fs.watchFile(rhconfPath, path => {
    log.info(`File ${path} has been changed, start sync config to shotpot`);
    sync2shotpot(rhconf);
    initReal(rhconf);
});

// 阻塞读配置文件
function readConf(confPath) {
    return JSON.parse(fs.readFileSync(confPath, {encoding: "utf-8"}));
}

// 发送http request 同步配置文件到shotpot
function sync2shotpot(rhconf) {
    let data = JSON.stringify(rhconf);
    rhconf.servers.forEach((serv) => {
        log.info(`Sync conf to shotpot: ${serv.host}:${serv.port}`);
        let req = http.request({
            host: serv.host,
            port: serv.port,
            method: 'POST',
            path: '/realhook/set_checkpoint',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        }, (res) => {
            res.setEncoding('utf8');
            log.info(`Shotpot: ${serv.host}:${serv.port} STATUS: ${res.statusCode}`);
            res.on('data', (chunk) => {
                log.info(`Shotpot: ${serv.host}:${serv.port} BODY: ${chunk}`)
            });
            res.on('end', () => {
                log.info(`Shotpot: ${serv.host}:${serv.port} Finished.`)
            })
        });

        req.on('error', (e) => {
            log.error(`Shotpot: ${serv.host}:${serv.port} ${e.message}`)
        });
        req.write(data);
        req.end()
    });
}

function initRealObj(rhconf) {
    em_status = {
        summary: {
            campaign: 0,
            uv: 0,
            uv_set: hll(),
            history_uv: [],
            iuv: 0,
            iuv_set: hll(),
            history_iuv: [],
            suc_time:0,
            suc_rate:0
        },
        campaigns: []
    };
    rhconf.cprules.forEach((cprule) => {
        em_status.summary.campaign += 1;
        em_status.campaigns.push({
            name: cprule.name,
            uv: 0,
            uv_set: hll(),
            history_uv: [],
            iuv: 0,
            iuv_set: hll(),
            history_iuv: [],
            suc_time:0,
            suc_rate:0
        });
    });
}


// ------koa-------
const Koa = require('koa');
const app = new Koa();
const server = require('http').Server(app.callback());


server.listen(rhconf.realhook.stat_port, () => {
    log.info(`Realhook server start at: ${rhconf.realhook.stat_port}`);
});

// middleware
const koaBody = require('koa-body');
const Router = require('koa-router');
const router = new Router();
// const senttcp = require('./sendtcp');

app.use(koaBody());
app.use(router.routes());
app.use(router.allowedMethods());
// router.use(senttcp());

router.post(rhconf.realhook.stat_path, async (ctx, next) => {
    console.log(JSON.stringify(ctx.request.body));
    ctx.request.body.forEach((hit) => {
        em_status.summary.uv_set.insert(hit.ckid);
        em_status.campaigns.forEach((campaign) => {
            if (hit.name === campaign.name) {
                em_status.campaign.uv.insert(hit.ckid);
            }
        });
    });
});


// socket.io
const io = require('socket.io')(server);
const realhook = io.of('/realhook');

realhook.on('connection', (socket) => {
    setInterval(function () {
        socket.emit('realdata', em_status);
    }, 3000);
});


// test socket.io
// setInterval(() => {
//     let date = new Date();
//     em_status.summary.uv_set.insert(date.toString());
//     em_status.summary.total_uv = em_status.summary.uv_set.estimate();
//     em_status.campaigns.forEach((campaign) => {
//         campaign.uv_set.insert(date.toString());
//         campaign.uv = campaign.uv_set.estimate();
//     });
// },1000);