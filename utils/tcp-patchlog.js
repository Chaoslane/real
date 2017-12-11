#!/usr/bin env node
const fs = require('fs');
const querystring = require('querystring');
const utils = require('../lib/utils');

const filePath = process.argv[2];
const lines = fs.readFileSync(filePath).toString().split('\n');


// liaoning patch log
const config = require('../conf/realhook.json')
const net = require('net');

var client = net.connect(config.tcpserver, function(){
    console.log('client connected');
});

client.on('data',function (data) {
    // console.log(data.toString());
})

client.setTimeout(5000, function () {
    client.destroy();
    console.log('disconnected from server');
});

lines.forEach(line => {
    //console.log(line);
    const fields = line.split(" ");
    if (fields.length === 15) {
        const jsonLine = JSON.stringify({
            timestamp: utils.addHours(fields[0] + " " + fields[1]),
            request: {
                host: fields[4],
                path: fields[6],
                qury: querystring.parse(fields[7], '&', '=', {decodeURIComponent: s => s}),
                ckie: fields[12]
            }
        }) + '\n';
        // console.log(jsonLine);
        client.write(jsonLine);
    }
});

