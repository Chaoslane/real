const config = require('./sync_config');

setInterval(() => {
    console.log(JSON.stringify(config));
},1000);