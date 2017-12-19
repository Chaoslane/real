const net = require('net');

scanPorts("192.168.4.2", 1, 10000, port =>{
    console.log(port)
});

function loopPorts(host, start, end) {
    return new Promise(function (resolve, reject) {
        let counts = end - start + 1;
        let ports = [];

        for (let i = 0; i <= end; i++) {
            let socket = net.connect({host: host, port: i}, () => {
                ports.push(i);
                socket.destroy();
            });

            //最后一个端口扫描完成后 resolve ports变量
            socket.on('close', () => {
                // console.log(i)
                if (i === end) {
                    if (ports.length) {
                        resolve(ports);
                    } else {
                        reject("no ports open");
                    }
                }
            });

            // 端口未开放 触发error 必须监听
            // error触发后触发close
            socket.on('error', (error) => {
            });
        }
    });
}

function scanPorts(host, start, end, callback) {
    // 判断参数个数 重新赋值
    if (typeof end === "function" && callback === undefined) {
        callback = end;
        end = start;
    }

    loopPorts(host, start, end).then(ports => {
        callback(ports);
    }).catch(err => {
        console.log(err);
    });
}
