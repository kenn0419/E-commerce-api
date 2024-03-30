'use strict'

const mongoose = require('mongoose');
const os = require('os')
const process = require('process');

const _SECONDS = 5000;

//Count connect
const countConnect = () => {
    const count = mongoose.connections.length;
    console.log(`Count: ${count}`);
}

//Check over load
const checkOverLoad = () => {
    setInterval(() => {
        const countConnection = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;

        console.log('Active connections: ' + countConnection);
        console.log(`Memory usage: ${memoryUsage / 1024 / 1024}MB`);

        const maxConnections = numCores * 5;
        if (countConnection > maxConnections) {
            console.log('Connection overload detected')
        }
    }, _SECONDS);
}

module.exports = {
    countConnect,
    checkOverLoad,
};