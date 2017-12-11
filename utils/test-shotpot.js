#!/bin/node
const rhConf = require(`../conf/${process.env.REALHOOK_ENV}/realhook.json`);
const utils = require('../lib/utils');

const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
    console.log(ctx.request.body);
    ctx.body = 'Hello World';
});

app.listen(rhConf.realhook.stat_port);

utils.sync2shotpot(rhConf);