(() => {
    let username = tools.getCookie('username');

    let showEnd = tools.getQuery('end')
    console.log(showEnd)

    let startDom = '<h4>我发起的会议</h4><ul class="startDom">';
    let joinDom = '<h4>我参加的会议</h4><ul class="joinDom">';
    let endDom = '<h4>过期的会议</h4><ul class="endfDom">';

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
            }else{
                // 待参加的会议
                if (data.mAdmin == username) {
                    // 我发起的会议
                    startDom += initDom(data);
                }else{
                    // 我参加的会议
                    joinDom += initDom(data);
                }
            }
        });

        startDom += '</ul>';
        joinDom += '</ul>';
        endDom += '</ul>';

        // 在会议列表中加载
        if(showEnd == 'true'){
            document.querySelector('.meetList').innerHTML += startDom + joinDom + endDom;
        }else{
            document.querySelector('.meetList').innerHTML += startDom + joinDom;
        }

    });

    function initDom(data) {
        return '<li><div class="main"><div class="mes">' +
            '<a href="meetDetail.html?meet='+data.mName+'"><h3>' + data.mName + '</h3>' +
            '<div class="mesPeople"><img src="img/04.png" alt="">' +
            '<span>会议地点</span><span>' + data.rName + '</span>' +
            '</div><div class="mesPeople">' +
            '<img src="img/03.png" alt=""><span>开始时间</span>' +
            '<span>' + data.mStartTime + '</span>' +
            '</div></a></div><span class="showBtn">&gt;</span>' +
            '</div><div class="del">删除</div></li>';
    }
})();