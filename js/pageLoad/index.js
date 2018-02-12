(function () {
    const err = new Err(errMes, 1000);

    let userData = tools.getUserFormCookie();
    tools.noUser(userData.username);

    // 修改标题
    tools.headValue('首页-' + project_name);
    tools.titleValue(project_name);

    const userTip = document.querySelector('.userTip');
    const adminTip = document.querySelector('.adminTip');
    const addMeetBtn = document.querySelector('.btnBox:nth-child(3) ul li:nth-child(1)');
    const cameraBtn = document.querySelector('.btnBox:nth-child(3) ul li:nth-child(3)');
    const newSth = document.querySelector('.btnBox:last-child');

    const addUser = document.querySelector('.addUser');
    const leaveBox = document.querySelector('.leaveBox');
    const leaveClose = document.querySelector('.leaveClose');
    const save = document.querySelector('.save');

    const haveNew = document.querySelector('#haveNew');
    const name = document.querySelector('.name');
    const email = document.querySelector('.email');
    const phone = document.querySelector('.phone');
    const dName = document.querySelector('.dName');

    // 扫码的dom
    const qrBtn = document.querySelector('#cameraBtn');
    const qrInput = document.querySelector('#cameraInput');

    qrBtn.addEventListener('click', function () {
        qrInput.click();
    });

    // 拍照上传二维码文件
    qrInput.addEventListener('change', () => {
        err.errMesShow('正在签到，请稍等……');        
        handleFiles(qrInput.files[0]);
        qrcode.callback = (e) => {
            let data = JSON.parse(decodeURI(e))
            let now = new Date();
            let start = new Date(data.mStartTime);
            let end = new Date(data.mEndTime);

            let canSign = 0;
            
            // 参与者需要签到，其他人不用签到
            data.mPeople.map((user) => {
                if (user == userData.username) {
                    canSign += 1;
                }
            });
            // 管理员也可以签到
            if (user == data.mAdmin) {
                canSign += 1;
            }
            // 记录员也可以签到            
            if (user == data.mRecorder) {
                canSign += 1;
            }

            // 校验时间，校验人员
            if (start <= now && now <= end) {
                // 会议进行中                
                err.errMesShow('签到成功，但是你迟到了。');
            }
            if (end <= now) {
                // 会议结束后
                err.errMesShow('会议已经结束了。');
                return false;
            }
            if (now <= start) {
                if (canSign > 0) {
                    ajaxTool.updateStatus({
                        'option': {
                            'name': userData.username,
                            'mName': data.mName,
                            'sSign': 0,
                        }
                    }, (req) => {
                        if (req.status == "success") {
                            err.errMesShow('签到成功。');
                            return false;
                        }
                        if (req.mes == "信息重复。") {
                            err.errMesShow('请勿重复签到。');
                            return false;
                        }
                        err.errMesShow('签到失败，请稍后再试。');
                    });
                } else {
                    err.errMesShow('你无需参加本会议。');
                }
            }
        };
    });

    // 搞不明白是怎么用的，llqrcode.js
    function handleFiles(f) {
        var reader = new FileReader();
        reader.onload = (function (theFile) {
            return function () {
                qrcode.decode(reader.result);
            };
        })(f);
        reader.readAsDataURL(f);
    }

    haveNew.addEventListener('click', () => {
        events.toggleClass(haveNew, '', 'selected');
    })

    // 根据用户权限修改显示的按钮：管理员，用户，可以发起会议，不可以发起会议
    tools.runUserFunc(userData, () => {
        userTip.style.display = 'none';
        adminTip.style.display = 'block';
        cameraBtn.style.display = 'none';

        // 一个统计图
        let myChart = echarts.init(document.querySelector('.adminTip'));
        myChart.setOption({
            'title': {
                'text': '月度会议趋势',
                'left': '4%',
                'top': '4%',
                'textStyle': {
                    'color': '#f0f0f0',
                    'align': 'center',
                    'lineHeight': 20,
                    'fontSize': 16
                }
            },
            'tooltip': {
                'trigger': 'axis',
            },
            'legend': {
                'data': ['会议数量'],
                'top': '5%',
                'right': '5%',
                'textStyle': {
                    'color': '#f0f0f0',
                }
            },
            'grid': {
                'left': '4%',
                'right': '4%',
                'bottom': '4%',
                'top': '28%',
                'containLabel': true,
            },
            'xAxis': [{
                'type': 'category',
                'boundaryGap': false,
                'data': ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                'nameRotate': 30,
                'axisLine': {
                    'lineStyle': {
                        'color': '#f0f0f0'
                    }
                }
            }],
            'yAxis': [{
                'type': 'value',
                'axisLine': {
                    'lineStyle': {
                        'color': '#f0f0f0'
                    }
                }
            }],
            'series': [{
                'name': '会议数量',
                'type': 'line',
                'stack': '总量',
                'areaStyle': {
                    'normal': {
                        'color': chart_color
                    }
                },
                'itemStyle': {
                    'normal': {
                        'lineStyle': {
                            'color': chart_color
                        }
                    }
                },
                'data': []
            }]
        });
        myChart.showLoading();
        // 加载统计图数据
        ajaxTool.getMonthData({
            'username': userData.username
        }, (data) => {
            myChart.hideLoading();
            myChart.setOption({
                'series': [{
                    'data': data.meetData
                }]
            });
        });
        return false;
    }, () => {
        userTip.style.display = 'block';
        adminTip.style.display = 'none';
        newSth.style.display = 'none';

        // 加载待进行会议
        ajaxTool.getMeetList({
            'user': userData.username
        }, (data) => {
            let num = 0;
            let futureMeet = 0;
            let now = new Date();
            let tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            data.meetList.map((data) => {
                let start = new Date(data.mStartTime)
                // 未过期的会议
                if (now < start) {
                    num++;
                    if (start < tomorrow) {
                        // 一天内的会议
                        futureMeet++;
                    }
                }
            });
            if (futureMeet > 0) {
                document.querySelector('.userTip').style.backgroundImage = tip_mes_image;
            }
            document.querySelector('.num').innerHTML = num;
        });
        return false;
    }, () => {
        addMeetBtn.style.display = 'inlinr-block';
        return false;
    }, () => {
        addMeetBtn.style.display = 'none';
        return false;
    }, )

    // 新建用户
    addUser.addEventListener('click', function () {
        if (userData.level == 0) {
            leaveBox.style.display = 'block';
        }
    });
    leaveClose.addEventListener('click', function () {
        leaveBox.style.display = 'none';
    });
    save.addEventListener('click', function () {
        const data = {
            "name": name.value,
            "email": email.value,
            "phone": phone.value,
            "dName": dName.value,
            "initiate": haveNew.className == 'selected' ? 0 : 1
        }
        if (name.value == '') {
            err.errMesShow('请输入用户名称');
            return false;
        };
        if (!tools.isEmail(email.value)) {
            err.errMesShow('邮箱有误');
            return false;
        };
        if (!tools.isMobile(phone.value)) {
            err.errMesShow('手机号有误');
            return false;
        };
        if (dName.value == '') {
            err.errMesShow('请输入用户部门');
            return false;
        };
        ajaxTool.addUser(data, (req) => {
            if (req.status == "success") {
                err.errMesShow('创建成功', () => {
                    name.value = '';
                    email.value = '';
                    phone.value = '';
                    dName.value = '';
                    leaveClose.click();
                });
            }
        });
    });

})()