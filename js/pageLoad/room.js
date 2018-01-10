(() => {
    let userData = tools.getUserFormCookie();
    tools.noUser(userData.username);

    tools.titleValue('会议室列表');
    tools.headValue('会议室列表-' + project_name);
    
    const err = new Err(errMes);

    // 绑定事件
    let backList = document.querySelectorAll('.back');
    let roomList = document.querySelectorAll('.roomList');
    // 设置返回按钮
    events.goBack(backList);
    // 禁用按钮显示与功能
    events.showBtnEvent(roomList, (e) => {
        let updateData = {
            'rStatus': 0
        }
        if (e.innerHTML == '禁用') {
            updateData.rStatus = 0;
        }
        if (e.innerHTML == '启用') {
            updateData.rStatus = 1;
        }
        // 需要判断会议室当前是否占用

        ajaxTool.updateRoom({
            'rName': e.parentNode.querySelector('h3').innerHTML,
            'update': updateData
        }, (req) => {
            if (req.status !== "success") {
                err.errMesShow('修改失败，请稍后重试')
                return false;
            }
            err.errMesShow('修改成功');
            window.location.reload();
        });
    });

    let newRoom = document.querySelector('.newRoom');
    let rName = document.querySelector('.rName');
    let rPlace = document.querySelector('.rPlace');
    let rNum = document.querySelector('.rNum');
    let rDevice = document.querySelector('.rDevice');
    let save = document.querySelector('.save');
    let leaveClose = document.querySelector('.leaveClose');
    let leaveBox = document.querySelector('.leaveBox');

    // 创建会议室
    newRoom.addEventListener('click', () => {
        leaveBox.style.display = 'block';
    });

    leaveClose.addEventListener('click', () => {
        leaveBox.style.display = 'none';
    });

    save.addEventListener('click', () => {
        if (rName.value == '' || rPlace.value == '' || rNum.value == '' || rDevice.value == '') {
            err.errMesShow('请完整填写会议室信息');
            return false;
        }
        ajaxTool.addRoom({
            "rName": rName.value,
            "rPlace": rPlace.value,
            "rNum": rNum.value,
            "rDevice": rDevice.value
        }, (req) => {
            console.log(req);
            if (req.status == "success") {
                err.errMesShow('创建成功', () => {
                    window.location.reload();
                });
                return false;
            }
            err.errMesShow('创建失败，请稍后重试。');
        });
    });

    // 加载会议室列表
    ajaxTool.getRoomAndState({
        'userLevel': userData.level,
        'time': room_future_status
    }, (data) => {
        let dom = '';
        data.roomList.map((data) => {
            dom += '<li><div class="main"><div class="mes"><a href="roomState.html?room=' +
                data.rName + '"><h3>' +
                data.rName + '</h3><div class="mesPeople"><img src="img/01.png" alt=""><span>' +
                data.rNum + '人</span><img src="img/02.png" alt=""><span>' +
                data.rDevice + '</span></div>' + '<div class="mesTime">' +
                futureMes(data) + '</div></a></div><span class="showBtn">&gt;' + '</span></div><div class="' +
                (data.rStatus == 0 ? 'del success' : 'del') + '" style="display: none;">' +
                (data.rStatus == 0 ? '启用' : '禁用') + '</div></li>';
        });
        // 在会议地点中加载
        document.querySelector('.roomList ul').innerHTML = dom;
    });

    // 根据会议室状态渲染未来n小时的占用状态
    function futureMes(data) {
        if (data.rStatus == 0) {
            return '<span>会议室被禁用</span>';
        } else {
            if (data.future == 0) {
                return '<span>未来' + room_future_status + '小时</span><span>会议室空闲</span>'
            } else {
                return '<span>未来' + room_future_status + '小时</span><span>会议室有预定</span>'
            }
        }
    }



})();