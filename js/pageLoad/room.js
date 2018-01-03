(() => {
    // 绑定事件
    let backList = document.querySelectorAll('.back');
    let roomList = document.querySelectorAll('.roomList');
    // 设置返回按钮
    events.goBack(backList);
    // 删除按钮显示与功能
    events.showBtnEvent(roomList, (e) => {
        e.parentNode.style.display = 'none';
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
                '</span></div><div class="del" style="display: none;">删除</div></li>'
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