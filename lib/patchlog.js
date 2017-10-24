#!/usr/bin env node
const fs = require('fs');
const querystring = require('querystring');

const filePath = process.argv[2];
const lines = fs.readFileSync(filePath).toString().split('\n');


const addHours = function (timeStr) {
    let timestamp = new Date(timeStr).getTime() + 8 * 3600 * 1000;
    let newDate = new Date(new Date(timestamp).toLocaleString());
    let yyyy = newDate.getFullYear();
    let MM = newDate.getMonth() < 9 ? '0' + (newDate.getMonth() + 1) : (newDate.getMonth() + 1);
    let dd = newDate.getDate() < 10 ? ('0' + newDate.getDate()) : (newDate.getDate());
    let HH = newDate.getHours() < 10 ? ('0' + newDate.getHours()) : (newDate.getHours());
    let mm = newDate.getMinutes() < 10 ? ('0' + newDate.getMinutes()) : (newDate.getMinutes());
    let ss = newDate.getSeconds() < 10 ? ('0' + newDate.getSeconds()) : (newDate.getSeconds());
    return yyyy + '-' + MM + '-' + dd + ' ' + HH + ':' + mm + ':' + ss;
};


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
            timestamp: addHours(fields[0] + " " + fields[1]),
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

