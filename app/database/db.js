/**
 * Created by lenovo on 2017/4/18 0018.
 */
var mongoose = require('mongoose'),
    DB_URL = 'mongodb://localhost:27017/meetingHelp';

/**
 * 连接
 */
mongoose.Promise = global.Promise;
mongoose.connect(DB_URL, {
    useMongoClient: true,
    /* other options */
});

/**
 * 连接成功
 */
mongoose.connection.on('connected', function () {
    console.log('Mongoose connection open to ' + DB_URL);
});

/**
 * 连接异常
 */
mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});

/**
 * 连接断开
 */
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose connection disconnected');
});

// 当应用重启或终止的时候 关闭连接
Shutdown = function (msg, callback) {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through ' + msg);
        callback();
    });
};

// nodemon 重启
process.once('SIGUSR2', function () {
    Shutdown('nodemon restart', function () {
        process.kill(process.pid, 'SIGUSR2');
    });
});

// 应用终止
process.on('SIGINT', function () {
    Shutdown('app termination', function () {
        process.exit(0);
    });
});

module.exports = mongoose;