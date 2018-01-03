(function () {
    // 提示信息
    const err = new Err(errMes);

    let username = tools.getCookie('username');
    let meet = tools.getQuery('meet');
    tools.noUser(username);
    if(meet){
        tools.titleValue('修改会议信息');
        tools.headValue('正在修改'+meet+'的信息-' + project_name);
    }else{
        tools.titleValue('新建会议');
        tools.headValue('新建会议-' + project_name);
    }

    // 绑定事件
    let backList = document.querySelectorAll('.back');
    let chooseOneBox = document.querySelectorAll('.chooseBox');
    let chooseOneBtnList = document.querySelectorAll('.chooseBox .btn');
    let chooseListBox = document.querySelectorAll('.chooseList');
    let chooseListBtnList = document.querySelectorAll('.chooseList .btn');
    let selectChoose = document.querySelectorAll('.selectBox .choose');
    // 设置返回按钮
    events.goBack(backList);
    // 展开单选盒子
    events.addEventForList(chooseOneBtnList, 'click', function (item, index) {
        events.toggleShow(chooseOneBox[index].querySelector('ul'));
    })
    // 设置单选
    events.chooseOne(chooseOneBox);
    // 展开多选盒子
    events.addEventForList(chooseListBtnList, 'click', function (item, index) {
        events.toggleShow(chooseListBox[index].querySelector('ul'));
    })
    // 设置多选
    events.chooseList(chooseListBox);
    // 是否选中状态
    events.addEventForList(selectChoose, 'click', function (item, index) {
        events.toggleClass(item.querySelector('div'), 'selected', '');
    })

    const name = document.querySelector('#name');
    const detail = document.querySelector('#detail');
    const newsPic = document.querySelector('#newsPic');
    const start = document.querySelector('#start');
    const end = document.querySelector('#end');
    const room = document.querySelector('#room');
    const sponsor = document.querySelector('#sponsor');
    const join = document.querySelector('#join');
    const canRead = document.querySelector('#canRead');
    const autoJoin = document.querySelector('#autoJoin');
    const save = document.querySelector('#save');
    const qrCodeClose = document.querySelector('.qrCodeClose');
    const qrCodeSave = document.querySelector('.qrCodeSave');
    const qrcode = document.querySelector('.qrcode');
    let now = new Date();

    // 加载会议地点
    ajaxTool.getRoomList((data) => {
        var dom = '';
        data.roomList.map((data) => {
            dom += '<li>' + data.rName + '</li>';
        });

        // 在会议地点中加载
        room.parentElement.querySelector('ul').innerHTML = dom;

        // 根据传递来的参数自动选择当前的会议室地点，然后click
        var place = tools.getQuery('place');
        room.parentNode.querySelectorAll('ul li').forEach((e) => {
            if (e.innerHTML == place) {
                e.click();
            }
        });
    });
    // 加载会议人物
    ajaxTool.getUserList((data) => {
        var dom = '';
        data.userList.map((data) => {
            dom += '<li>' + data.name + '</li>';
        });

        // 在发起人中加载
        sponsor.parentElement.querySelector('ul').innerHTML = dom;
        // 在参会人中加载
        join.innerHTML = dom;
    });

    // -----------------------------------

    // 获取已经选择的dom的内容
    function getListText(list) {
        var data = [];
        list.forEach(element => {
            data.push(element.innerHTML);
        });
        return data;
    }

    // 上传文件
    // 问题：live server后，上传文件后会刷新页面
    const upLoadPicBtn = document.querySelector('#upLoadPicBtn');
    const uploadImg = document.querySelector('#uploadImg');
    upLoadPicBtn.addEventListener('click', () => {
        if (!newsPic.files.length) {
            alert('请选择文件后再上传！');
            return false;
        }
        // 临时禁用保存按钮
        save.className = 'stop';
        ajaxTool.uploadImg(newsPic, (req) => {
            uploadImg.src = 'http://192.168.199.206:5500/uploads/' + req.filePath;
            // alert("上传完毕！");

            // 开启保存功能
            save.className = 'success';
        });
    });

    // 开始时间小于结束时间
    start.addEventListener('focus', () => {
        // 开始时间不能小于当前时间
        start.min = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + 'T' + now.getHours() + ':' + now.getMinutes();
        // 如果先填写了结束时间，开始时间不能大于结束时间
        if (end.value) {
            start.max = end.value;
        }
    });

    //结束时间大于开始时间
    end.addEventListener('focus', () => {
        // 结束时间不能小于当前时间
        start.min = now.getFullYear() + '-' + (now.getMonth() + 1) + '-' + now.getDate() + 'T' + now.getHours() + ':' + now.getMinutes();
        // 如果填写了开始时间,结束时间必须大于开始时间
        if (start.value) {
            end.min = start.value;
        }
    });

    // 保存后获取对应位置的信息
    save.addEventListener('click', () => {
        let joinList = getListText(join.querySelectorAll('li.select'));

        if (save.className == 'stop') {
            err.errMesShow('请等待上传完成');
            return false;
        }
        if (name.value == '') {
            err.errMesShow('请输入会议名称');
            return false;
        };
        if (detail.value == '') {
            err.errMesShow('请输入会议详情');
            return false;
        };
        if (start.value == '') {
            err.errMesShow('请选择开始时间');
            return false;
        };
        if (end.value == '') {
            err.errMesShow('请选择结束时间');
            return false;
        };
        if (room.innerHTML == '请选择') {
            err.errMesShow('请选择会议地点');
            return false;
        }
        if (sponsor.innerHTML == '请选择') {
            err.errMesShow('请选择发起人');
            return false;
        }
        if (joinList.length == 0) {
            err.errMesShow('请选择参会人');
            return false;
        }

        var meetData = {
            'name': name.value,
            'detail': detail.value,
            'uploadImg': uploadImg.getAttribute('src'),
            'start': start.value,
            'end': end.value,
            'room': room.innerHTML,
            'sponsor': sponsor.innerHTML,
            'joinList': joinList,
            'mNote': canRead.className == 'selected' ? 0 : 1,
            'mNote': autoJoin.className == 'selected' ? 0 : 1
        };
        err.errMesShow('正在创建，请稍后。');
        ajaxTool.addMeet(meetData, (res) => {
            if (res.status == 'success') {
                err.errMesShow('新建成功，正在跳转。');
                // 展示生成的二维码（签到用）
                qrcode.querySelector('#qrCodeImg').setAttribute('src', res.qrCode);
                qrcode.style.display = 'block';
            } else {
                if (res.mes.code == 11000) {
                    err.errMesShow('会议重复，请修改名称。');
                    return false;
                }
                err.errMesShow('新建失败，请重新来过。');
            }
        });
    });

    qrCodeClose.addEventListener('click', () => {
        window.location.href = '/';
    });
})()