(() => {
    let userData = tools.getUserFormCookie();
    tools.noUser(userData.username);

    const err = new Err(errMes);

    // 获取参数
    let room = tools.getQuery('room');

    // 修改标题
    tools.titleValue('会议室详情');
    tools.headValue(room + '详情-' + project_name);

    // 获取并设置会议室信息
    const roomName = document.querySelector('.roomName');
    roomName.innerHTML = room;

    const roomNumber = document.querySelector('.roomNumber');
    const roomAddress = document.querySelector('.roomAddress');
    const roomDevice = document.querySelector('.roomDevice');
    const newMeet = document.querySelector('.newMeet');
    const openReBox = document.querySelector('.openReBox');

    const changeBox = document.querySelector('.changeBox');
    const rName = document.querySelector('.rName');
    const rPlace = document.querySelector('.rPlace');
    const rNum = document.querySelector('.rNum');
    const rDevice = document.querySelector('.rDevice');

    const roomStateMes = document.querySelector('.roomStateMes');
    const roomMesShow = document.querySelectorAll('.roomState .mes')[1];

    let roomData = {
        rDevice: '',
        rName: room,
        rNum: '',
        rPlace: '',
        rStatus: '',
    };

    // 根据用户权限修改显示的按钮：管理员，用户，可以发起会议，不可以发起会议
    tools.runUserFunc(userData, () => {
        newMeet.innerHTML = '提交';
        openReBox.innerHTML = '修改会议室信息';
        openReBox.className = 'openReBox';
        return false;
    }, () => {

    }, () => {}, () => {
        document.querySelector('body>footer').style.display = 'none';
        document.querySelector('body>article.hasFooter').className = '';
    });

    // 绑定事件
    let backList = document.querySelectorAll('.back');
    // 设置返回按钮
    events.goBack(backList);

    ajaxTool.findRoom({
        'attr': 'rName',
        'val': room
    }, function (data) {
        roomNumber.innerHTML = data.rNum;
        roomAddress.innerHTML = data.rPlace;
        roomDevice.innerHTML = addDom(data.rDevice.split('/'));

        rName.value = room;
        rPlace.value = data.rPlace;
        rNum.value = data.rNum;
        rDevice.value = data.rDevice;

        roomData.rDevice = data.rDevice;
        roomData.rNum = data.rNum;
        roomData.rPlace = data.rPlace;

        // 获取会议室占用信息
        ajaxTool.getMeetList({
            'attr': 'rName',
            'val': data.rName
        }, (req) => {
            let dom = '';
            req.meetList.map((meet) => {
                let date = new Date(meet.mStartTime);
                let now = new Date();
                if (now < date) {
                    dom += '<li><div><span>' +
                        meet.mStartTime.replace(/T/, ' ') + '</span><span>至</span><span>' +
                        meet.mEndTime.replace(/T/, ' ') + '</span></div><p>预订人：<span class="adminName">' +
                        meet.mAdmin + '</span></p></li>';
                }
            });
            document.querySelector('.roomStateMes').innerHTML = dom || '<li><span>会议室暂无预定</span></li>';
        });
    });

    roomStateMes.addEventListener('click', (e) => {
        if (e.target.className == 'adminName') {
            ajaxTool.findUser({
                'attr': 'name',
                'val': e.toElement.innerHTML
            }, (req) => {
                err.errMesShow(e.toElement.innerHTML + '的联系方式是：' + req.phone || req.email);
            });
        }
    });

    // 打开设置信息的盒子
    openReBox.addEventListener('click', () => {
        if (openReBox.innerHTML == '修改会议室信息') {
            changeBox.style.display = 'block';
            roomMesShow.style.display = 'none';
            openReBox.innerHTML = '取消修改';
            return false;
        }
        if (openReBox.innerHTML == '取消修改') {
            changeBox.style.display = 'none';
            roomMesShow.style.display = 'block';
            openReBox.innerHTML = '修改会议室信息';
            return false;
        }
    });

    // 跳转到传递了房间名称的新建会议页面
    newMeet.addEventListener('click', () => {
        if (newMeet.innerHTML == '新建会议') {
            window.location.href = '/newMeeting.html?place=' + room;
            return false;
        }
        let isChange = roomData.rName == rName.value && roomData.rDevice == rDevice.value && roomData.rNum == rNum.value && roomData.rPlace == rPlace.value;
        if (newMeet.innerHTML == '提交') {
            if (openReBox.innerHTML == '修改会议室信息' || isChange) {
                err.errMesShow('请修改会议室信息后再提交。')
                return false;
            }
            ajaxTool.updateRoom({
                'rName': rName.value,
                'update': {
                    'rPlace': rPlace.value,
                    'rNum': rNum.value,
                    'rDevice': rDevice.value
                }
            }, (req) => {
                if (req.status !== "success") {
                    err.errMesShow('修改失败，请稍后重试')
                    return false;
                }
                err.errMesShow('修改成功', () => {
                    window.location.reload();
                });
            });
        }
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