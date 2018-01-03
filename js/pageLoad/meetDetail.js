(() => {
    const err = new Err(errMes);

    let username = tools.getCookie('username');
    let meet = tools.getQuery('meet');

    tools.titleValue('会议详情');
    tools.headValue('会议详情-' + project_name);  

    // 绑定事件
    let backList = document.querySelectorAll('.back');
    // 设置返回按钮
    events.goBack(backList);

    // let changeBtn = document.querySelector('.changeBtn');
    let meetTitle = document.querySelector('.meetTitle');
    let meetPlace = document.querySelector('.meetPlace');
    let startDom = document.querySelector('.start');
    let endDom = document.querySelector('.end');
    let mDesc = document.querySelector('.meetMes');
    let meetAdmin = document.querySelector('.meetAdmin');
    let meetPeople = document.querySelector('.meetPeople');
    let pic = meetAdmin.querySelector('.pic');
    let name = meetAdmin.querySelector('.name');
    let email = meetAdmin.querySelector('.email');
    let phone = meetAdmin.querySelector('.phone');
    let pushMes = document.querySelector('#pushMes');
    let pushBtn = document.querySelector('.pushBtn');

    let joinNum = document.querySelector('.joinNum');
    let leaveNum = document.querySelector('.leaveNum');
    let noBackNum = document.querySelector('.noBackNum');

    let joinBtn = document.querySelector('.join');
    let footerBtn = document.querySelector('.meetMain footer')

    // 保留会议纪要加载之后的那条信息
    let pushMesValue = '';

    // 加载会议回应状态
    joinNum.href = 'afterMeetNum.html?meet=' + meet;
    leaveNum.href = 'beforeMeetNum.html?meet=' + meet;
    // noBackNum

    // 更新会议相关信息
    ajaxTool.findMeet({
        'attr': 'mName',
        'val': meet
    }, (meetData) => {
        meetTitle.innerHTML = meetData.mName;
        meetPlace.innerHTML = meetData.mName;
        startDom.innerHTML = meetData.mStartTime;
        endDom.innerHTML = meetData.mEndTime;
        mDesc.innerHTML = meetData.mDesc;

        // 加载发起人
        pic.innerHTML = meetData.mAdmin.split('')[0];
        pic.style.background = tools.radomData(user_avatar_data);
        ajaxTool.findUser({
            'attr': 'name',
            'val': meetData.mAdmin
        }, (userData) => {
            name.innerHTML += userData.name;
            email.innerHTML += userData.email;
            phone.innerHTML += userData.phone;
        });

        // 加载参会人
        let userDom = '';
        meetData.mPeople.split(',').map((data) => {
            userDom += '<li><div class="pic" style="background:' + tools.radomData(user_avatar_data) + '">' + data.split('')[0] + '</div><span>' + data + '</span></li>'
        });
        meetPeople.innerHTML = userDom;

        // 根据状态改变现实效果
        let now = new Date();
        let start = new Date(meetData.mStartTime)
        let end = new Date(meetData.mEndTime)
        if (now < start) {
            // 会议未开
            footerBtn.style.display = 'block';

        } else if (end < now) {
            // 会议开完

        } else {
            // 会议正在开

        }

        // 获取我对于本会议留过的会议纪要
        ajaxTool.findNote({
            option: {
                'mName': meet,
                'name': meetData.mAdmin == username ? '' : username,
            }
        }, (noteData) => {
            if (noteData.nMes) {
                pushMes.value = noteData.nMes;
                pushBtn.innerHTML = '更新';
                pushMes.setAttribute('data-title', noteData.nTitle);
                return false;
            }
            pushMesValue = pushMes.value;
            pushBtn.innerHTML = '发表';
        });

        // 判断用户在当前会议的状态
        ajaxTool.getStatusByOption({
            option: {
                'mName': meet,
                'name': username
            }
        }, (statusData) => {
            if (now < start && statusData.sStatus == 2) {
                // 参加的,隐藏状态标签
                footerBtn.style.display = 'block';
            }
        });
    });

    // 更新参与人员数量
    ajaxTool.getStatusList({
        'attr': 'mName',
        'val': meet
    }, (data) => {
        // 确认参加
        let data_1 = tools.filterData(data.statusList, 'sStatus', 1);
        document.querySelector('.joinNum span').innerHTML = data_1.length;

        // 已请假
        let data_2 = tools.filterData(data.statusList, 'sLeave', 1);
        document.querySelector('.leaveNum span').innerHTML = data_2.length;

        // 未反馈
        let data_3 = tools.filterData(data.statusList, 'sStatus', 0);
        document.querySelector('.noBackNum span').innerHTML = data_3.length;
    });

    // 确认参加按钮
    joinBtn.addEventListener('click', () => {
        ajaxTool.updateStatus({
            'option': {
                'name': username,
                'mName': meet,
                'sStatus': 0,
            }
        }, (req) => {
            if (req.status == "success") {
                window.location.reload();
            } else {
                err.errMesShow('参加失败，请稍后重试。');
            }
        });
    });

    // 请假
    let leaveBtn = document.querySelector('.leaveBtn');
    let leaveBox = document.querySelector('.leaveBox');
    let leaveClose = document.querySelector('.leaveClose');
    let leaveSave = document.querySelector('.leaveSave');
    let leaveMes = leaveBox.querySelector('textarea');
    let nowSize = leaveBox.querySelector('.nowSize');
    let maxSize = leaveBox.querySelector('.maxSize');
    if (leaveBtn && leaveBox && leaveClose && leaveSave) {
        leaveBtn.addEventListener('click', function () {
            leaveBox.style.display = 'block';
        });
        leaveClose.addEventListener('click', function () {
            leaveBox.style.display = 'none';
            leaveMes.value = '';
        });
        leaveMes.addEventListener('keyup', () => {
            if (leaveMes.value.length <= maxSize.innerHTML - 1) {
                nowSize.innerHTML = leaveMes.value.length + 1;
            } else {
                leaveMes.value = leaveMes.value.substring(0, 99);
                err.errMesShow('最多插入100个字符');
            }
        });
        leaveSave.addEventListener('click', function () {
            //保存请假信息
            if (leaveMes.value == '') {
                err.errMesShow('请填写请假原因再提交。');
                return false;
            }
            ajaxTool.updateStatus({
                'option': {
                    'name': username,
                    'mName': meet,
                    'sStatus': 1,
                    'sMes': leaveMes.value
                }
            }, (req) => {
                if (req.status == "success") {
                    window.location.reload();
                } else {
                    err.errMesShow('请假失败，请稍后重试。');
                }
            });
        });
    }

    // 保存\更新纪要信息
    pushBtn.addEventListener('click', () => {
        if (pushBtn.innerHTML == '发表') {
            let note = {
                'nTitle': pushMes.value.substring(0, 15),
                'name': name.innerHTML.split('：')[1] == username ? '' : username,
                'mName': meet,
                'nMes': pushMes.value
            };
            if (pushMes.value == pushMesValue) {
                err.errMesShow('请填写内容后再发表。');
                return false;
            }
            ajaxTool.addNote(note, (req) => {
                if (req.status == 'success') {
                    err.errMesShow('会议纪要发表成功。');
                } else {
                    err.errMesShow('请稍后重试，谢谢。');
                }
            });
        } else if (pushBtn.innerHTML == '更新') {
            // 更新纪要
            let note = {
                'nTitle': pushMes.getAttribute('data-title'),
                'name': name.innerHTML.split('：')[1] == username ? '' : username,
                'mName': meet,
                'nMes': pushMes.value
            };
            if (pushMes.value == pushMes.getAttribute('data-title')) {
                err.errMesShow('请更新内容后再发表。');
                return false;
            }
            ajaxTool.updateNote(note, (req) => {
                if (req.status == 'success') {
                    err.errMesShow('会议纪要更新成功。');
                } else {
                    err.errMesShow('请稍后重试，谢谢。');
                }
            });
        } else {
            err.errMesShow('系统繁忙，请稍后。');
        }
    });

})();