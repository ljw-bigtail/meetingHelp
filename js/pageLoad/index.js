(function () {
    console.log(tools.getCookie('phone'));
    console.log(tools.getCookie('email'));
    console.log(tools.getCookie('desc'));
    console.log(tools.getCookie('department'));

    let username = tools.getCookie('username');
    tools.noUser(username);
    tools.headValue('首页-'+project_name);
    tools.titleValue(project_name);

    // 加载待进行会议
    ajaxTool.getMeetList({
        'user': username
    }, (data) => {
        var num = 0;
        data.meetList.map((data) => {
            let now = new Date();
            let start = new Date(data.mStartTime)
            // 未过期的会议
            if (now < start) {
                num++;
            }
        });
        document.querySelector('.num').innerHTML = num;
    });
})()