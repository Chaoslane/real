#!/usr/bin env node
const fs = require('fs');
const readline = require('readline');

const filePath = process.argv[2];
const fileReadStream = fs.createReadStream(filePath);
const readlineInstance = readline.createInterface({input: fileReadStream});

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
const config = require('./conf/realhook.json')
const net = require('net');
const socket = new net.Socket();

socket.connect(config.tcpserver, () => {
    console.log(`Connect TCP server succeed: ${config.tcpserver.host}`)
});
socket.on('error', () => {
    console.log(`Connection error, please check TCP Server: ${config.tcpserver.host}`);
});

readlineInstance.on('line', (line) => {
    //console.log(line);
    const fields = line.split(" ");
    const jsonLine = JSON.stringify({
        timestamp: addHours(fields[0]+" "+fields[1]),
        request: {
            host: fields[4],
            path: fields[6],
            qury: fields[7],
            ckie: fields[12]
        }
    }) + '\n'
    // console.log(jsonLine);
    socket.write(jsonLine);
});