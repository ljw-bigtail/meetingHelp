(() => {
    let username = tools.getCookie('username');
    tools.titleValue('会议室列表');
    tools.headValue('会议室列表-' + project_name);
    tools.noUser(username);

    const err = new Err(errMes);

    // 绑定事件
    let backList = document.querySelectorAll('.back');
    let roomList = document.querySelectorAll('.roomList');
    // 设置返回按钮
    events.goBack(backList);
    // 删除按钮显示与功能
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
        if(rName.value == '' || rPlace.value == '' || rNum.value == '' || rDevice.value == ''){
            err.errMesShow('请完整填写会议室信息');
            return false;
        }
        ajaxTool.addRoom({
            "rName" : rName.value,
            "rPlace" : rPlace.value,
            "rNum" : rNum.value,
            "rDevice" : rDevice.value
        },(req)=>{
            console.log(req);
            if(req.status == "success"){
                err.errMesShow('创建成功',()=>{
                    window.location.reload();
                });
                return false;
            }
            err.errMesShow('创建失败，请稍后重试。');            
        });
    });

    // 加载会议室列表
    ajaxTool.getRoomList((data) => {
        var dom = '';
        data.roomList.map((data) => {
            dom += '<li><div class="main"><div class="mes"><a href="roomState.html?room=' +
                data.rName + '"><h3>' + data.rName + '</h3><div class="mesPeople">' +
                '<img src="img/01.png" alt=""><span>' + data.rNum + '人</span>' +
                '<img src="img/02.png" alt=""><span>' + data.rDevice +
                '</span></div>' + '<div class="mesTime"><span>未来三小时</span><span>' +
                stateMes(data.rStatus) + '</span></div></a></div><span class="showBtn">&gt;' +
                '</span></div><div class="' + (data.rStatus == 0 ? 'del success' : 'del') +
                '" style="display: none;">' +
                (data.rStatus == 0 ? '启用' : '禁用') + '</div></li>'
        });

        // 在会议地点中加载
        document.querySelector('.roomList ul').innerHTML = dom;
    });

    function stateMes(state) {
        switch (state) {
            case 0:
                return '会议室被禁用';
                break;
            case 1:
                return '会议室空闲中';
                break;
            case 2:
                return '会议室使用中';
                break;
            case 3:
                return '会议室被预定';
                break;
        }
    }
})();