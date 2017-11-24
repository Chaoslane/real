#!/usr/bin/env node

const Log = require('log');
const log = new Log('info');

const Koa = require('koa');
const app = new Koa();
const server = require('http').Server(app.callback());




// middleware
const koaBody = require('koa-body');
const Router = require('koa-router');
const router = new Router();
const path = require('path');
const static = require('koa-static');
const staticPath = './static';

app.use(koaBody());
app.use(router.routes());
app.use(router.allowedMethods());

app.use(static(
    path.join(__dirname, staticPath)
));

const properties = process.argv;

if (properties.find(str => str.indexOf('-t') > -1)){
    const sendtcp = require('./lib/mid_sendtcp');
    router.post(rhconf.realhook.stat_path, sendtcp());
}

if (properties.find(str => str.indexOf('-r') > -1)){
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


server.listen(rhconf.realhook.stat_port);
server.on('error', (err)=> {
    log.error(`Start worker failed`);
    throw err;
});
server.on('listening', ()=>{
    log.info(`Worker is listen on ${rhconf.realhook.stat_port}`)
});

module.exports = server;