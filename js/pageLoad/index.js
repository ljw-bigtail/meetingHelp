(function () {
    let userData = tools.getUserFormCookie();
    tools.noUser(userData.username);

    // 修改标题
    tools.headValue('首页-' + project_name);
    tools.titleValue(project_name);

    const userTip = document.querySelector('.userTip');
    const adminTip = document.querySelector('.adminTip');
    const addMeetBtn = document.querySelector('.btnBox:nth-child(3) ul li:nth-child(1)');
    const cameraBtn = document.querySelector('.btnBox:nth-child(3) ul li:nth-child(3)');

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
})()