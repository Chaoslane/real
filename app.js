#!/usr/bin/env node
const Log = require('log');
const log = new Log('info');

// -------------------koa----------------------
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
// const senttcp = require('./mid_sendtcp');

app.use(koaBody());
app.use(router.routes());
app.use(router.allowedMethods());
// router 调用中间件
router.post(rhconf.realhook.stat_path, realstatus.keepReal());
// router.post(rhconf.realhook.stat_path, senttcp());





server.listen(rhconf.realhook.stat_port);
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


// --------------socket.io--------------------
const io = require('socket.io')(server);
const realhook = io.of('/realhook');

realhook.on('connection', (socket) => {
    setInterval(function () {
        socket.emit('realdata', realstatus.status);
    }, 1000);
});
