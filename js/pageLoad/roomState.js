(() => {
    // 获取并设置会议室信息
    var room = tools.getQuery('room');

    // 绑定事件
    let backList = document.querySelectorAll('.back');
    // 设置返回按钮
    events.goBack(backList);

    document.querySelector('.roomName').innerHTML = room;

    ajaxTool.findRoom({
        'attr': 'rName',
        'val': room
    }, function (data) {
        document.querySelector('.roomNumber').innerHTML = data.rNum;
        document.querySelector('.roomAddress').innerHTML = data.rPlace;
        var dom = '';
        data.rDevice.split('/').map((text) => {
            dom += '<i>' + text + '</i><br>'
        });
        document.querySelector('.roomDevice').innerHTML = dom;
    });

    //跳转到传递了房间名称的新建会议页面
    document.querySelector('.newMeet').addEventListener('click', () => {
        window.location.href = '/newMeeting.html?place=' + room;
    });

    // 还需要计算会议室预定信息，后台暂未提供对应的信息和接口

})()