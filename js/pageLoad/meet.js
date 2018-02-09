(() => {
    const err = new Err(errMes);

    let userData = tools.getUserFormCookie();
    // let username = tools.getCookie('username');
    let showEnd = tools.getQuery('end')
    tools.noUser(userData.username);
    if (showEnd == 'true') {
        tools.titleValue('相关会议');
        tools.headValue('相关会议-' + project_name);
    } else {
        tools.titleValue('待进行会议');
        tools.headValue('待进行会议-' + project_name);
    }

    // 绑定事件
    let backList = document.querySelectorAll('.back');
    let meetList = document.querySelectorAll('.meetList');
    // 设置返回按钮
    events.goBack(backList);
    // 删除按钮显示与功能
    events.showBtnEvent(meetList, (e) => {
        e.parentNode.style.display = 'none';
        ajaxTool.delMeet({
            "mName": e.parentNode.querySelector('h3').innerHTML
        }, (req) => {
            err.errMesShow(req.mes)
        });
    });

    const btnValue = '取消会议';
    const startTit = '<h4>我发起的会议</h4><ul class="startDom">';
    const joinTit = '<h4>我参加的会议</h4><ul class="joinDom">';
    const endTit = '<h4>历史会议</h4><ul class="endfDom">';
    const futureTit = '<h4>新的会议</h4><ul class="endfDom">';

    let startDom = startTit;
    let joinDom = joinTit;
    let endDom = endTit;
    let futureDom = futureTit;

    // 预备搜索
    const searchBtn = document.querySelector('.searchBtn');
    let meetTitleData = [];
    let meetListLi;

    // 根据用户权限修改显示的按钮：管理员，用户
    tools.runUserFunc(userData, () => {
        // 加载会议列表
        ajaxTool.getMeetList({}, (data) => {
            data.meetList.map((data) => {
                meetTitleData.push(data.mAdmin + data.mName + data.mStartTime.split('T')[0]);

                let now = new Date();
                let start = new Date(data.mStartTime);
                // 过期的会议
                if (now > start) {
                    endDom += initDom(data);
                } else {
                    // 待参加的会议
                    futureDom += initDom(data);
                }
            });
            if (futureDom == futureTit) {
                futureDom += noMeetDom('暂无新的会议。');
            }
            if (endDom == endTit) {
                endDom += noMeetDom('暂无历史会议。');
            }
            startDom += '</ul>';
            endDom += '</ul>';
            document.querySelector('.meetList').innerHTML += futureDom + endDom;

            meetListLi = document.querySelectorAll('.meetList li:not(.noneData)');

            // 根据dom绑定搜索
            bindSearch(meetTitleData, meetListLi);
        });
    }, () => {
        // 加载会议列表
        ajaxTool.getMeetList({
            'user': userData.username
        }, (data) => {
            data.meetList.map((data) => {
                meetTitleData.push(data.mName + '&' + data.mAdmin + '&' + data.mStartTime.split('T')[0]);
                let now = new Date();
                let start = new Date(data.mStartTime);
                // 过期的会议
                if (now > start) {
                    endDom += initDom(data);
                } else {
                    // 待参加的会议
                    if (data.mAdmin == userData.username) {
                        // 我发起的会议
                        startDom += initDom(data);
                    } else {
                        // 我参加的会议
                        joinDom += initDom(data);
                    }
                }
            });
            if (startDom == startTit) {
                startDom += noMeetDom('没有发起会议。');
            }
            if (joinDom == joinTit) {
                joinDom += noMeetDom('暂无其他需要参加会议。');
            }
            if (endDom == endTit) {
                endDom += noMeetDom('暂无历史会议。');
            }
            startDom += '</ul>';
            joinDom += '</ul>';
            endDom += '</ul>';
            // 在会议列表中加载
            if (showEnd == 'true') {
                document.querySelector('.meetList').innerHTML += startDom + joinDom + endDom;
            } else {
                document.querySelector('.meetList').innerHTML += startDom + joinDom;
            }

            meetListLi = document.querySelectorAll('.meetList li:not(.noneData)');

            // 根据dom绑定搜索
            bindSearch(meetTitleData, meetListLi);
        });
    });

    function bindSearch(data, dom) {
        searchBtn.addEventListener('change', function () {
            tools.haveTextInData(this.value, data, function () {
                events.hideList(dom);
            }, function (isFind) {
                events.hideList(dom);
                isFind.map(function (num) {
                    dom[num].style.display = 'block';
                });
            });
        });
    }

    function noMeetDom(val) {
        return '<li class="noneData"><div class="main"><div class="mes"><span>' + val + '</span></div></li>';
    }

    function initDom(data) {
        // 是否是会议管理员 || 是否是管理员 
        let canManage = userData.username == data.mAdmin || userData.level == 0;
        return '<li><div class="main"><div class="mes">' + '<a href="meetDetail.html?meet=' +
            data.mName + '"><h3>' +
            data.mName + '</h3>' + '<div class="mesPeople">' + '<img src="img/04.png" alt="">' + '<span>会议地点</span><span>' +
            data.rName + '</span>' + '</div><div class="mesPeople">' + '<img src="img/03.png" alt=""><span>开始时间</span>' + '<span>' +
            data.mStartTime.replace(/T/,' ') + '</span>' + '</div></a></div><span class="' + 
            (canManage ? 'showBtn' : '') + '">&gt;</span>' + '</div> ' +
            (canManage ? ('<div class="del">' + btnValue + '</div>') : '') + '</li>';
    }
})();