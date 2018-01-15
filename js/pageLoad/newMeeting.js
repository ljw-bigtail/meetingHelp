(function () {
    // 提示信息
    const err = new Err(errMes);

    let username = tools.getCookie('username');
    let meet = tools.getQuery('meet');
    tools.noUser(username);
    if (meet) {
        tools.titleValue('修改会议信息');
        tools.headValue('正在修改' + meet + '的信息-' + project_name);
    } else {
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

    const showRoom = document.querySelector('#showRoom');
    const chooseRoom = showRoom.querySelector('.chooseRoom');
    const timeChoose = document.querySelector('#timeChoose');
    const timeChooseTit = timeChoose.querySelector('.right .title');
    const timeChooseClock = timeChoose.querySelector('.right .clock');

    let now = new Date();

    // 渲染时间dom
    function addTimeBox(stateData) {
        console.log('1')
        let timeTitleDom = '';
        let timeClockDomA = '';
        let timeClockDomB = '';
        work_time.map((data, index) => {
            if (index % 2 == 0) {
                timeTitleDom += '<li>' + data + '</li>'
                if (stateData[index] == 1) {
                    // 判定为被选中的
                    timeClockDomA += '<li><input type="checkbox" name="08" value="' + data + '" disabled="disabled" checked="checked"></li>'
                } else {
                    timeClockDomA += '<li><input type="checkbox" name="08" value="' + data + '" ></li>'
                }
            } else {
                if (stateData[index] == 1) {
                    // 判定为被选中的
                    timeClockDomB += '<li><input type="checkbox" name="08" value="' + data + '" disabled="disabled" checked="checked"></li>'
                } else {
                    timeClockDomB += '<li><input type="checkbox" name="08" value="' + data + '"></li>'
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
    }

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

        ajaxTool.getRoomGap({
            'date': start.value
        }, (req) => {
            // 渲染会议室状态表
            let roomDOM = '';
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
                roomDOM += '<input type="radio" name="meeting-room" title="' + data.rName + '" data-time="' + data.utilization + '"><span>' + data.rName + '</span>';
                roomDOM += '<progress value="' + (utilization / timeLength * 100) + '" max="100"></progress></li>';
                roomDOM += '</li>';
            });
            chooseRoom.innerHTML = roomDOM;
        });

        showRoom.style.display = 'block';
    });

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
            addTimeBox(getStateByTime(roomSelectRadio));
            timeChoose.style.display = 'block';
        } else if (e.target.nodeName == 'PROGRESS') {
            roomSelectRadio = e.target.previousSibling.previousSibling;
            roomSelectRadio.click();
        }
    });

    // 筛选出连续的时间段对应的状态
    function isGap() {
        // 获取时间
        let status = [];
        let timeChooseClockSelect = timeChooseClock.querySelectorAll('li');
        for (var i = 0; i < timeChooseClockSelect.length; i++) {
            let chooseOneFromClock = timeChooseClockSelect[i].querySelector('input');
            if (chooseOneFromClock.checked) {
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

    // 保存后获取对应位置的信息
    save.addEventListener('click', () => {
        let joinList = getListText(join.querySelectorAll('li.select'));
        let gapIndex = isGap();
        let gapState = true;
        // 查看是否连贯
        for (let i = 0; i < gapIndex.length; i++) {
            if (gapIndex[i + 1] - gapIndex[i] > 1) {
                gapState = false;
            }
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
            'start': start.value + 'T' + work_time[gapIndex[0]],
            'end': start.value + 'T' + work_time[(gapIndex[gapIndex.length - 1] + 1)],
            'room': showRoom.getAttribute('data-room'),
            'sponsor': sponsor.innerHTML,
            'joinList': joinList,
            'mNote': canRead.className == 'selected' ? 0 : 1,
            'mJoin': autoJoin.className == 'selected' ? 0 : 1
        };

        err.errMesShow('正在创建，请稍后。');
        ajaxTool.addMeet(meetData, (res) => {
            // 修改会议室状态
            ajaxTool.updateRoom({
                'rName': meetData.room,
                'update': {
                    'rStatus': 2
                }
            }, (_res) => {
                if (_res.status == 'success' && res.status == 'success') {
                    err.errMesShow('新建成功，请保存二维码。');
                    // 展示生成的二维码（签到用）
                    qrcode.querySelector('#qrCodeImg').src = res.qrCode;
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
    });

    qrCodeClose.addEventListener('click', () => {
        window.location.href = '/';
    });
})()