(() => {
    // 获取并设置会议室信息
    let room = tools.getQuery('room');
    let username = tools.getCookie('username');
    const roomName = document.querySelector('.roomName');
    tools.noUser(username);
    tools.titleValue('会议室状态');
    tools.headValue(room + '状态-' + project_name);
    roomName.innerHTML = room;

    // 绑定事件
    let backList = document.querySelectorAll('.back');
    // 设置返回按钮
    events.goBack(backList);

    const roomNumber = document.querySelector('.roomNumber');
    const roomAddress = document.querySelector('.roomAddress');
    const roomDevice = document.querySelector('.roomDevice');
    const newMeet = document.querySelector('.newMeet');

    ajaxTool.findRoom({
        'attr': 'rName',
        'val': room
    }, function (data) {
        roomNumber.innerHTML = data.rNum;
        roomAddress.innerHTML = data.rPlace;
        roomDevice.innerHTML = addDom(data.rDevice.split('/'));
    });

    //跳转到传递了房间名称的新建会议页面
    newMeet.addEventListener('click', () => {
        window.location.href = '/newMeeting.html?place=' + room;
    });

    // 还需要计算会议室预定信息，后台暂未提供对应的信息和接口
    function addDom(data) {
        var dom = '';
        data.map((text) => {
            dom += '<i>' + text + '</i><br>';
        });
        return dom;
    }
})()