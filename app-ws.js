#!/bin/node
global.rhConf = require(`./conf/${process.env.REALHOOK_ENV}/realhook.json`);
const utils = require('./lib/utils');
const Log = require('log');
const log = new Log('info');

// koa
const http = require('http');
const path = require('path');
const Koa = require('koa');
const app = new Koa();
const server = http.createServer(app.callback());
const static = require('koa-static');


// koa middleware
app.use(static(path.join(__dirname, `./static/${process.env.REALHOOK_ENV}`)));

// koa listeners
server.listen(rhConf.realhook.websocket_port);
server.on('error', (err)=> {
    log.error(`Start webSocket service failed`);
    throw err;
});
server.on('listening', ()=>{
    log.info(`WebSocket is listen on ${rhConf.realhook.websocket_port}.`)
});


// socket.io
const io = require('socket.io')(server);
const realhook = io.of('/realhook');
const emitStatus = require(`./lib/${process.env.REALHOOK_ENV}/socketio-handler`);

// socket.io listeners
realhook.on('connection', (socket) => {
    log.info(`New connection from: ${socket.handshake.address}`);
    socket.on('getstatus', () => {
        socket.emit('status', emitStatus);
    });
    socket.on('disconnect', (reason) => {
        log.info(`Client exit: ${reason}`);
    });
    socket.on('error', (error) => {
        log.error(error);
    });
});

