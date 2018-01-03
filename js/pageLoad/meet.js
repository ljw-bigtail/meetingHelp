(() => {
    let username = tools.getCookie('username');
    let showEnd = tools.getQuery('end')

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
    });

    const btnValue = '取消会议';

    const startTit = '<h4>我发起的会议</h4><ul class="startDom">';
    const joinTit = '<h4>我参加的会议</h4><ul class="joinDom">';
    const endTit = '<h4>历史会议</h4><ul class="endfDom">';

    let startDom = startTit;
    let joinDom = joinTit;
    let endDom = endTit;

    // 加载会议列表
    ajaxTool.getMeetList({
        'user': username
    }, (data) => {
        data.meetList.map((data) => {
            let now = new Date();
            let start = new Date(data.mStartTime)

            // 过期的会议
            if (now > start) {
                endDom += initDom(data);
            } else {
                // 待参加的会议
                if (data.mAdmin == username) {
                    // 我发起的会议
                    startDom += initDom(data);
                } else {
                    // 我参加的会议
                    joinDom += initDom(data);
                }
            }

        });

        if (startDom == startTit) {
            startDom += noMeetDom('没有发起会议。')
        }
        if (joinDom == joinTit) {
            joinDom += noMeetDom('暂无其他需要参加会议。')
        }
        if (endDom == endTit) {
            endDom += noMeetDom('暂无历史会议。')
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

    });

    function noMeetDom(val) {
        return '<li><div class="main"><div class="mes"><span>' + val + '</span></div></li>';
    }

    function initDom(data) {
        return '<li><div class="main"><div class="mes">' + '<a href="meetDetail.html?meet=' +
            data.mName + '"><h3>' +
            data.mName + '</h3>' + '<div class="mesPeople">' + '<img src="img/04.png" alt="">' + '<span>会议地点</span><span>' +
            data.rName + '</span>' + '</div><div class="mesPeople">' + '<img src="img/03.png" alt=""><span>开始时间</span>' + '<span>' +
            data.mStartTime + '</span>' + '</div></a></div><span class="showBtn">&gt;</span>' + '</div><div class="del">' +
            btnValue + '</div></li>';
    }
})();