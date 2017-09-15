#!/usr/bin/env node

const cluster = require('cluster');
const Log = require('log');
const log = new Log('info');
const Koa = require('koa');
const app = new Koa();
const server = require('http').Server(app.callback());

// sync config to shotpot
const rhconf = require('./conf/realhook.json');
const port = rhconf.realhook.stat_port || 3000;

// middleware
const koaBody = require('koa-body');
const Router = require('koa-router');
const router = new Router();

app.use(koaBody());
app.use(router.routes());
app.use(router.allowedMethods());


const properties = process.argv;

if (properties.find(str => str.indexOf('-t') > -1)){
    log.info(`Start trans log to flume module`);
    const sendtcp = require('./lib/mid_sendtcp');
    router.post(rhconf.realhook.stat_path, sendtcp());
}

if (properties.find(str => str.indexOf('-r') > -1)){
    log.info(`Start real time analysis module`);
    const realstatus = require('./lib/mid_realstatus');
    router.post(rhconf.realhook.stat_path, realstatus.keepReal());
}

// response
router.post(rhconf.realhook.stat_path, async ctx => {
    ctx.body = "OK";
});

// error handler
app.on('error', function(err,ctx){
    log.error(err.message);
});

server.listen(port);
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
    log.info('Realhook listening on ' + bind);
}

module.exports = server;