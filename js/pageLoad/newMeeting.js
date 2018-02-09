(function () {
    // 提示信息
    const err = new Err(errMes);
    const tipBox = new Err(canNext);
    const message = new Message(['email', 'app']);

    let userCookie = tools.getUserFormCookie();
    let username = tools.getCookie('username');
    let meet = tools.getQuery('meet');
    let place = tools.getQuery('place');
    tools.noUser(username);
    if (meet) {
        tools.titleValue('修改会议信息');
        tools.headValue('正在修改' + meet + '的信息-' + project_name);
    } else {
        tools.titleValue('新建会议');
        tools.headValue('新建会议-' + project_name);
    }

    // 绑定事件
    const userBox = document.querySelector('#user');
    const userBoxSearch = userBox.querySelector('.search .searchBtn');
    const userBoxYes = userBox.querySelector('.yes');
    const userBoxSelect = userBox.querySelector('ul.userSelect');
    const userBoxLits = userBox.querySelector('div.userLits');

    let backList = document.querySelectorAll('.back');
    // let chooseOneBox = document.querySelectorAll('.chooseBox');
    // let chooseOneBtnList = document.querySelectorAll('.chooseBox .btn');
    let chooseListBox = document.querySelectorAll('.chooseList');
    let chooseListBtnList = document.querySelectorAll('.chooseList .btn');
    let selectChoose = document.querySelectorAll('.selectBox .choose');
    // 设置返回按钮
    events.goBack(backList);
    // 展开多选盒子
    events.addEventForList(chooseListBtnList, 'click', function (item, index) {
        let thisId = item.parentElement.querySelector('.val').getAttribute('id')
        // 初始化用户表的选中状态
        userBoxLits.querySelectorAll('i').forEach((e) => {
            if (e.className == 'select') {
                e.click();
            }
        });

        // 寻位标记
        userBox.setAttribute('data-where', thisId);
        // 类型标记
        userBox.setAttribute('data-type', item.getAttribute('data-type'));

        // 渲染选择的user
        let userData = item.parentElement.querySelector('.val').innerHTML.split(',');
        console.log(userData)
        if (userData[0] != '请选择') {
            clickUser(userData)
        } else {
            clickUser([])
        }

        // 没有动画
        // userBox.style.display = 'block';
        // 加上动画
        userBox.className = 'openUserBox';
    })
    // 设置多选
    // events.chooseList(chooseListBox);
    // 是否选中状态
    events.addEventForList(selectChoose, 'click', function (item, index) {
        events.toggleClass(item.querySelector('div'), 'rmSelected', 'selected');
    })

    const name = document.querySelector('#name');
    const detail = document.querySelector('#detail');
    const newsPic = document.querySelector('#newsPic');
    const start = document.querySelector('#start');
    const end = document.querySelector('#end');
    const room = document.querySelector('#room');
    const mAdmin = document.querySelector('#mAdmin');
    const join = document.querySelector('#join');
    const canRead = document.querySelector('#canRead');
    const autoJoin = document.querySelector('#autoJoin');
    const save = document.querySelector('#save');
    const qrCodeClose = document.querySelector('.qrCodeClose');
    const qrCodeSave = document.querySelector('.qrCodeSave');
    const qrcode = document.querySelector('.qrcode');

    const showRoom = document.querySelector('#showRoom');
    const chooseRoom = showRoom.querySelector('.chooseRoom');
    const timeChoose = document.querySelector('#timeChoose');
    const timeChooseTit = timeChoose.querySelector('.right .title');
    const timeChooseClock = timeChoose.querySelector('.right .clock');

    let now = new Date();

    function isIn(_name, list) {
        let state = -1;
        list.map((data, index) => {
            if (_name.split('')[0] == data[0].user.name.split('')[0]) {
                state = index;
                return false;
            }
        });
        return state;
    }

    // 修改数组格式
    function getNewData(data) {
        let userData = [];
        data.reverse().map((_data, index) => {
            // 先根据name返回二维数组
            let dataIndex = isIn(_data.name, userData);
            if (dataIndex > -1) {
                userData[dataIndex].push({
                    'first': _data.name.split('')[0],
                    'user': _data
                });
            } else {
                userData.push([{
                    'first': _data.name.split('')[0],
                    'user': _data
                }]);
            }
        });
        return userData;
    }

    // 加载用户列表
    function initUser(dom, _data, stateData) {
        let sData = stateData || [];
        let userDom = '<ul class="userLits">';
        _data.map((data) => {
            userDom += '<li><div class="title">' + data[0].first + '</div><ul class="list">';
            data.map((user) => {
                userDom += '<li class="userLine"><i data-name="' + user.user.name + '"></i>';
                userDom += '<div class="pic" style="background:' + tools.radomData(user_avatar_data) + '">' + user.user.name.split('')[0] + '</div>';
                userDom += '<span>' + user.user.name + '</span></li>';
            });
            userDom += '</ul></li>';
        });
        userDom += '</ul>';
        dom.innerHTML = userDom;
    }

    // 查询Data中是否有text
    function haveTextInData(text, Data, callback1, callback2) {
        let reg = new RegExp(text, 'g');
        let findData = [];
        Data.map(function (value, index) {
            if (value.name.match(reg)) {
                findData.push(value)
            }
        });
        if (findData.length == 0) {
            // 没找到
            callback1();
        } else {
            // 找到的数组
            callback2(findData);
        }
    }

    // 根据data点击表格
    function clickUser(data) {
        if (data.length == 0) {
            if (user.getAttribute('data-type') == 'one') {
                userBoxLits.querySelectorAll('ul li .title')[0].click();
            } else {
                userBoxLits.querySelectorAll('i').forEach((e) => {
                    // 单选的取消全选
                    if (e.className == 'select') {
                        e.click();
                    }
                });
            }
            return false;
        }
        data.map((user) => {
            userBoxLits.querySelectorAll('i').forEach((e) => {
                if (e.getAttribute('data-name') == user) {
                    e.click();
                }
            });
        });
    }

    // 触发input的change事件
    function changeDom(dom) {
        // 构造change事件对象
        let event = new UIEvent('change');
        // 触发input的change事件
        dom.dispatchEvent(event);
    }

    // 加载会议人物
    ajaxTool.getUserList((data) => {
        // 在userBox中加载列表
        let userData = getNewData(data.userList);
        initUser(userBoxLits, userData);

        // 页面内搜索
        userBoxSearch.addEventListener('keyup', function () {
            haveTextInData(this.value, data.userList, function () {
                userBoxLits.innerHTML = '<li><li>';
            }, function (userData) {
                let newData = getNewData(userData);
                let stateUserData = userBoxYes.getAttribute('data-user');
                initUser(userBoxLits, newData, stateUserData.split(','));
                clickUser(userBoxYes.getAttribute('data-user').split(','))
            });
        });

        // 根据meet来做修改会议信息时的效果
        if (meet) {
            ajaxTool.findMeet({
                'attr': 'mName',
                'val': meet
            }, (req) => {
                name.value = req.mName;
                name.disabled = 'true';
                detail.value = req.mDesc;
                document.querySelector('.inputBox').style.display = 'none';
                document.querySelectorAll('.new .newBox')[1].style.display = 'none';
                // newsPic.value = req.mFile;
                // start.value = req.mStartTime.split('T')[0];
                // changeDom(start);
                // 不允许修改管理员
                chooseListBox[0].style.display = 'none';
                join.innerHTML = req.mPeople;
                canRead.className = req.mNote == 1 ? 'selected' : '';
                autoJoin.className = req.mJoin == 1 ? 'selected' : '';
                save.innerHTML = '保存';
            });
        }
    });

    // 选择用户的事件，代理
    userBoxLits.addEventListener('click', (e) => {
        // 选择li
        let liDom = e.toElement.tagName == 'LI';
        let spanDom = e.toElement.tagName == 'SPAN';
        let iDom = e.toElement.tagName == 'I';
        let divDom = e.toElement.tagName == 'DIV' && e.toElement.className == 'pic';
        // 单选
        if (user.getAttribute('data-type') == 'one') {
            userBoxLits.querySelectorAll('.userLine i').forEach((e) => {
                e.className = '';
            });
        }
        // 选择的两种情况
        if (liDom) {
            events.toggleClass(e.target.querySelector('i'), '', 'select');
        }
        if (spanDom || iDom || divDom) {
            events.toggleClass(e.target.parentNode.querySelector('i'), '', 'select');
        }
        // 生成选择的user并渲染
        let picData = [];
        let userData = [];
        userBoxLits.querySelectorAll('.userLine').forEach((e) => {
            if (e.querySelector('i').className == 'select') {
                picData.push(e.querySelector('.pic').outerHTML);
                userData.push(e.querySelector('span').innerHTML);
            }
        });
        userBoxSelect.innerHTML = '';
        userBoxYes.setAttribute('data-user', userData);
        picData.map((dom) => {
            userBoxSelect.innerHTML += '<li>' + dom + '</li>';
        });
        userBoxSelect.style.width = picData.length * 5 + 'rem';
    });

    // 确定并返回用户数组
    userBoxYes.addEventListener('click', (e) => {
        // 没有效果
        // userBox.style.display = 'none';
        // 有效果
        userBox.className = 'closeUserBox';

        document.querySelector('#' + userBox.getAttribute('data-where')).innerHTML = userBoxYes.getAttribute('data-user') || '请选择';
    });

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

    // 一天中的工时
    let time0 = work_time[work_time.length - 1].split(':')[0] - 0;
    let time1 = work_time[0].split(':')[0] - 0;
    let timeLength = time0 - time1 + 1;

    // 开始时间小于结束时间
    start.addEventListener('change', () => {
        // 先选择日期，然后通过日期查找会议室的占用状态
        // 根据会议室占用状态，推荐对应的会议室，然后打开时间表
        // 选择时间
        // 保存的时候根据md中的格式来拼接

        // 过去的日期不允许选择
        let startTime = new Date(start.value);
        startTime.setHours(0);
        let yestarday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        if (startTime <= yestarday) {
            err.errMesShow('不能选择已经过去的时间，请重新选择');
            start.value = '';
            return false;
        }
        err.errMesShow('请尽快选择时间并提交，抢占先机');
        ajaxTool.getRoomGap({
            'date': start.value
        }, (req) => {
            // 渲染会议室状态表
            let roomDOM = '<li class="title"><span>会议室名称</span><span>会议室当天占用率</span></li>';
            req.reqData.map((data) => {
                let timeDate = data.utilization.split('&');
                let utilization = 0;
                timeDate.map((data, index) => {
                    let startTime,
                        endTime;
                    if (data != '' && index % 2 == 0) {
                        startTime = data.split('T')[1].split(':');
                        endTime = timeDate[index + 1].split('T')[1].split(':');
                        utilization += endTime[0] - startTime[0] + (endTime[1] - startTime[1]) / 60;
                    }
                });
                roomDOM += '<li>';
                if (place && place == data.rName) {
                    roomDOM += '<input type="radio" checked name="meeting-room" title="' + data.rName + '" data-time="' + data.utilization + '"><span>' + data.rName + '</span>';
                } else {
                    roomDOM += '<input type="radio" name="meeting-room" title="' + data.rName + '" data-time="' + data.utilization + '"><span>' + data.rName + '</span>';
                }
                roomDOM += '<progress value="' + (utilization / timeLength * 100) + '" max="100"></progress></li>';
                roomDOM += '</li>';
            });
            chooseRoom.innerHTML = roomDOM;
        });
        showRoom.style.display = 'block';
    });

    // 选择会议室
    chooseRoom.addEventListener('click', (e) => {
        let roomSelectRadio;
        if (e.target.nodeName == 'SPAN') {
            roomSelectRadio = e.target.previousSibling;
            roomSelectRadio.click();
        } else if (e.target.nodeName == 'INPUT') {
            roomSelectRadio = e.target;
            // 根据会议室信息选择当天的时间段
            showRoom.setAttribute('data-room', roomSelectRadio.getAttribute('title'));
            // 根据状态渲染dom，刷新时间选择器的dom,根据占据时间
            addTimeBox(getStateByTime(roomSelectRadio), start.value.split('-')[2]);
            timeChoose.style.display = 'block';
        } else if (e.target.nodeName == 'PROGRESS') {
            roomSelectRadio = e.target.previousSibling.previousSibling;
            roomSelectRadio.click();
        }
    });

    // 给选择的时间点增加对应链接
    timeChooseClock.addEventListener('click', (e) => {
        if (e.target.tagName == 'SPAN' && e.target.className.split(' ')[1] == 'chooseRadioTip') {
            let roomList = chooseRoom.querySelectorAll('input');
            let selectRoomVal = '';
            for (let i = 0; i < roomList.length - 1; i++) {
                if (roomList[i].checked) {
                    selectRoomVal = roomList[i].getAttribute('title');
                }
            }
            tipBox.tipShow('查看会议联系人信息，协商会议事项。', selectRoomVal, () => {
                window.location.href = '/roomState.html?room=' + selectRoomVal;
            });
        }
    });

    // 保存后获取对应位置的信息
    save.addEventListener('click', () => {
        if (save.innerHTML == '保存') {
            let changeMeet = {
                'mDesc': detail.value,
                'mPeople': join.innerHTML,
                'mNote': canRead.className == 'selected' ? 0 : 1,
                'mJoin': autoJoin.className == 'selected' ? 0 : 1
            };
            ajaxTool.updateMeet({
                'mName': name.value,
                'option': changeMeet
            }, (req) => {
                if (req.status == "success") {
                    err.errMesShow('信息修改成功', () => {
                        window.history.back();
                    });
                    return false;
                }
                err.errMesShow(req.mes);
            });
            return false;
        }

        let gapIndex = isGap();
        // 时间点连续
        let gapState = true;
        // 查看是否连贯
        if (gapIndex.length) {
            for (let i = 0; i < gapIndex.length; i++) {
                if (gapIndex[i + 1] - gapIndex[i] > 1) {
                    gapState = false;
                }
            }
        } else {
            err.errMesShow('请选择会议召开时间');
            return false;
        }

        // 数据正确性判断
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
        if (!gapState) {
            err.errMesShow('时间段需要连续选择');
            return false;
        }
        if (start.value == '') {
            err.errMesShow('请选择开始时间');
            return false;
        };
        if (!showRoom.getAttribute('data-room')) {
            err.errMesShow('请选择会议地点');
            return false;
        }
        if (mAdmin.innerHTML == '请选择' || mAdmin.innerHTML == '') {
            err.errMesShow('请选择管理员');
            return false;
        }
        if (write.innerHTML == '请选择' || write.innerHTML == '') {
            err.errMesShow('请选择记录员');
            return false;
        }
        if (join.innerHTML == '请选择' || join.innerHTML == '') {
            err.errMesShow('请选择参会者');
            return false;
        }


        var meetData = {
            'name': name.value,
            'detail': detail.value,
            'uploadImg': uploadImg.getAttribute('src'),
            'start': start.value + 'T' + work_time[gapIndex[0]],
            'end': start.value + 'T' + work_time[(gapIndex[gapIndex.length - 1] + 1)],
            'room': showRoom.getAttribute('data-room'),
            'mAdmin': mAdmin.innerHTML,
            'joinList': join.innerHTML.split(','),
            'mNote': canRead.className == 'selected' ? 0 : 1,
            'mJoin': autoJoin.className == 'selected' ? 0 : 1,
            'mApplicant': userCookie.username,
            'mRecorder': write.innerHTML
        };

        err.errMesShow('正在创建，请稍后。');
        ajaxTool.addMeet(meetData, (res) => {
            // 不需要修改会议室状态
            if (res.status == 'success') {
                // 查看申请者是不是管理员
                if (meetData.mAdmin == meetData.mApplicant) {
                    qrcode.querySelector('#qrCodeImg').src = res.qrCode;
                    qrcode.style.display = 'block';
                }
                // 展示生成的二维码（签到用），由于申请者不一定是管理员，所以不允许展示二维码
                err.errMesShow('新建成功，正在通知相关人员。');
                // 管理员权限消息
                message.sendMes({
                    userList: meetData.mAdmin,
                    title: newMeet_admin_title,
                    mes: newMeet_admin_mes
                }, (req) => {
                    err.errMesShow(tools.checkState(req, '消息推送成功', '管理员的App端消息推送失败', '管理员的邮件推送失败'))
                })
                // 记录员权限消息
                message.sendMes({
                    userList: meetData.mRecorder,
                    title: newMeet_admin_title,
                    mes: newMeet_admin_mes
                }, (req) => {
                    err.errMesShow(tools.checkState(req, '消息推送成功', '记录员的App端消息推送失败', '记录员的邮件推送失败'))
                })
                // 参会者权限消息
                message.sendMes({
                    userList: meetData.joinList,
                    title: newMeet_admin_title,
                    mes: newMeet_admin_mes
                }, (req) => {
                    err.errMesShow(tools.checkState(req, '消息推送成功', '参会者的App端消息推送失败', '参会者的邮件推送失败'))
                })
            } else {
                if (res.mes.code == 11000) {
                    err.errMesShow('会议重复，请修改名称。');
                    return false;
                }
                if (res.mes == '填写的过程中，您选择的时间段被占用了') {
                    err.errMesShow(res.mes);
                    return false;
                }
                err.errMesShow('新建失败，请重新来过。');
            }
        });
    });



    qrCodeClose.addEventListener('click', () => {
        window.location.href = '/';
    });

    // 根据会议室名称出发事件
    if (place) {
        let month = now.getMonth() + 1;
        let monthStr = '';
        if (month / 10 < 1) {
            monthStr = '0' + month;
        }
        start.value = now.getFullYear() + '-' + monthStr + '-' + (now.getDate() + 1);
        changeDom(start);
    }

    // 筛选出连续的时间段对应的状态
    function isGap() {
        // 获取时间
        let status = [];
        let timeChooseClockSelect = timeChooseClock.querySelectorAll('li');
        for (var i = 0; i < timeChooseClockSelect.length; i++) {
            let chooseOneFromClock = timeChooseClockSelect[i].querySelector('input');
            if (chooseOneFromClock.checked && !chooseOneFromClock.disabled) {
                status.push(1);
            } else {
                status.push(0);
            }
        }

        // 整理时间段数组，返回值是连贯的
        let statusA = status.slice(0, status.length / 2);
        let statusB = status.slice(status.length / 2, status.length);
        let statusData = [];
        statusA.map((_data, index) => {
            statusData.push(statusA[index]);
            statusData.push(statusB[index]);
        });
        // 根据连贯状态判断时间段是否有间断
        let gapIndex = [];
        // 间断状态，如果有间断，就为false
        // 返回选中状态的index值

        statusData.map((state, index) => {
            if (state == 1) {
                gapIndex.push(index);
            }
        });
        return gapIndex;
    }

    function getStateByTime(roomSelectRadio) {
        // 根据返回的时间段，计算出对应的时间状态数组
        let data = roomSelectRadio.getAttribute('data-time');
        let timeDate = data.split('&');
        let timeState = new Array(work_time.length);
        timeState.fill(0);
        timeDate.map((data, index) => {
            let Time = data.split('T')[1];
            if (index == timeDate.length - 1) {
                return false;
            }
            work_time.map((time, _index) => {
                if (Time == time) {
                    timeState[_index] = 1;
                }
            });
        });
        timeState.map((data, index) => {
            if (data == 1) {
                if (timeState[index + 1] == 1) {
                    timeState[index + 1] = 0;
                } else {
                    timeState[index + 1] = 1;
                }
            }
        });
        return timeState;
    }

    // 渲染时间dom
    function addTimeBox(stateData, valDate) {
        let timeTitleDom = '';
        let timeClockDomA = '';
        let timeClockDomB = '';
        // 从服务器获取当前时间
        ajaxTool.getNow((data) => {
            let serverNow = new Date(data.now);
            work_time.map((data, index) => {
                // <input type="checkbox" name="chooseTime" value="' + data + '" disabled="disabled" checked="checked"><span></span>
                let checkDom = '<li><label class="chooseLabel"><input class="chooseRadio" type="checkbox" value="' + data + '" name="chooseTime" disabled="disabled" checked="checked"><span class="chooseRadioInput chooseRadioTip"></span></label></li>';
                // <li><input type="checkbox" name="chooseTime" value="' + data + '" disabled="disabled"></li>
                let disableDom = '<li><label class="chooseLabel"><input class="chooseRadio" type="checkbox" value="' + data + '" name="chooseTime" disabled="disabled"><span class="chooseRadioInput"></span></label></li>';
                // <li><input type="checkbox" name="chooseTime" value="' + data + '" ></li>
                let normalDom = '<li><label class="chooseLabel"><input class="chooseRadio" type="checkbox" value="' + data + '" name="chooseTime"><span class="chooseRadioInput"></span></label></li>';
                // 是不是今天现在之前的时间
                let isFuture = data.split(':')[0] - 0 <= serverNow.getHours() && valDate - 0 == serverNow.getDate();
                if (index % 2 == 0) {
                    timeTitleDom += '<li>' + data + '</li>'
                    // 根据已选择的会议判定为被选中的
                    if (stateData[index] == 1) {
                        timeClockDomA += checkDom;
                    } else {
                        if (isFuture) {
                            timeClockDomA += disableDom;
                        } else {
                            timeClockDomA += normalDom;
                        }
                    }
                } else {
                    if (stateData[index] == 1) {
                        timeClockDomB += checkDom;
                    } else {
                        if (isFuture) {
                            timeClockDomB += disableDom;
                        } else {
                            timeClockDomB += normalDom;
                        }
                    }
                }
            });
            // 渲染时间段--时间dom
            timeChooseTit.innerHTML = timeTitleDom;
            // 渲染时间段--时间checkbox
            timeChooseClock.innerHTML = timeClockDomA + timeClockDomB;
            // 设置宽度
            let timeChooseTitWidth = 8 * (work_time.length / 2);
            timeChooseTit.style.width = timeChooseTitWidth + 'rem';
            timeChooseClock.style.width = timeChooseTitWidth + 'rem';
        });

    }
})()