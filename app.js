#!/usr/bin/env node
const Log = require('log');
const log = new Log('info');
const Koa = require('koa');
const app = new Koa();
const server = require('http').Server(app.callback());

// sync config to shotpot
const rhconf = require('./conf/realhook.json');
const syncConfig = require('./lib/sync_config')(rhconf);


// middleware
const koaBody = require('koa-body');
const Router = require('koa-router');
const router = new Router();
const realstatus = require('./lib/mid_realstatus');

app.use(koaBody());
app.use(router.routes());
app.use(router.allowedMethods());
router.post(rhconf.realhook.stat_path, realstatus.keepReal());


// response
router.post(rhconf.realhook.stat_path, async ctx => {ctx.body = "OK";});
// error handler
app.on('error', function(err,ctx){
    log.error(err.message);
});

// --------------socket.io--------------------
const io = require('socket.io')(server);
const realhook = io.of('/realhook');

realhook.on('connection', (socket) => {
    log.info(`New connection from: ${socket.handshake.address}`);
    socket.on('getstatus', () => {
        socket.emit('status', realstatus.status);
    });
    socket.on('disconnect', (reason) => {
        log.info(`Client exit: ${reason}`);
    });
    socket.on('error', (error) => {
        log.error(error);
    });
});


module.exports = server;
