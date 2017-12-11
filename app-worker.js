#!/bin/node
global.rhConf = require(`./conf/${process.env.REALHOOK_ENV}/realhook.json`);
const utils = require('./lib/utils');
const Log = require('log');
const log = new Log('info');

// koa
const Koa = require('koa');
const app = new Koa();
// middleware
const koaBody = require('koa-body');
const Router = require('koa-router');
const router = new Router();
const path = require('path');
const static = require('koa-static');
const reqHandler = require(`./lib/${process.env.REALHOOK_ENV}/request-handler`);


const appHost = rhConf.realhook.host;
const appPort = rhConf.realhook.stat_port;
const appPath = rhConf.realhook.stat_path;


// middlewares
app.use(koaBody());
app.use(router.routes());
app.use(router.allowedMethods());
router.post(appPath, midReqestHandler());


// listeners
app.listen(appPort, function () {
    log.info('Start server succeed, listen on: ' + appHost + ":" + appPort);
    utils.sync2shotpot(rhConf);
});
app.on('error', err => {
    log.error('Worker error: ' + err.message);
});


// custom request handler wapper
function midReqestHandler() {
    return async (ctx, next) => {
        try {
            reqHandler(ctx);
            await next();
            ctx.status = 200;
            ctx.body = 'OK';
        } catch (err) {
            ctx.status = err.status || 500;
            ctx.body = err.message;
            ctx.app.emit('error', err, ctx);
        }
    }
}

