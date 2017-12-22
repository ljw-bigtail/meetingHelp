/**
 * Created by lenovo on 2017/6/8 0008.
 */
;
var io = require('socket.io');
var socket;
var socketMap = {};

/**
 * 初始化socket
 * @param server
 */
function init(server) {
    socket = io.listen(server);
    // 同客户端建立连接
    socket.sockets.on('connection', onConnection);
    socket.sockets.on('disconnect', onDisconnect);
}

/**
 * 建立连接
 * @param socketIO
 */
function onConnection(socketIO) {
    var address = socketIO.handshake.address;
    console.log("已建立新链接,ip=" + address);
    socketMap[socketIO.id] = socketIO.id;
    // 遍历网站链接
    // var testWeb = new TestWeb(socketIO.id, doEmit);
    socketIO.on("readURL-start", function (data) {
        if(!data.url || data.url == ""){
            doEmit("pushWebInfo", "请填入正确的URL", socketIO.id);
            return;
        }
        // testWeb.start(data.url, data.option);
    });
    socketIO.on("readURL-stop", function () {
        // testWeb.stop();
    });
}

/**
 * 推送消息
 * @param tag
 * @param info
 * @param socketId
 */
function doEmit(tag, info, socketId) {
    if (socketId) {
        var client = socket.sockets.connected[socketId];
        client.emit(tag, info);
    } else {
        socket.sockets.emit(tag, info);
    }
}

/**
 * 断开连接
 */
function onDisconnect() {
    // TODO 未验证
    console.log("断开连接" + JSON.stringify(this.handshake.address));
    delete socketMap[this.id];

    // TODO 需要停止当前socket正在推送的事件
}

module.exports = {
    init: init,
    socket: socket,
    onConnection: onConnection,
    onDisconnect: onDisconnect,
    doEmit: doEmit
};