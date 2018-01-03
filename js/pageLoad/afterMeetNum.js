(() => {
    const err = new Err(errMes);

    let username = tools.getCookie('username');
    let meet = tools.getQuery('meet')

    const noSign = document.querySelector('.tabMain li[data-index="3"] ul');

    // 绑定事件
    let backList = document.querySelectorAll('.back');
    let mPTabTitle = document.querySelectorAll('.meetPeopleTab .tabMain > li');
    let mPTabMain = document.querySelectorAll('.meetPeopleTab .tabTittle li');
    // 设置返回按钮
    events.goBack(backList);
    // 设置Tab
    events.runTab(mPTabTitle, mPTabMain);
    

    // 加载数据
    ajaxTool.getStatusList({
        'attr': 'mName',
        'val': meet
    }, (data) => {
        // 确认参加
        let data_1 = tools.filterData(data.statusList, 'sStatus', 1);
        document.querySelector('.tabTittle li[data-index="1"] span').innerHTML = data_1.length;
        document.querySelector('.tabMain li[data-index="1"] ul').innerHTML = addDom(data_1);

        // 已签到
        let data_2 = tools.filterData(data.statusList, 'sSign', 0);
        document.querySelector('.tabTittle li[data-index="2"] span').innerHTML = data_2.length;
        document.querySelector('.tabMain li[data-index="2"] ul').innerHTML = addDom(data_2);

        // 未签到
        let data_3 = tools.filterData(data.statusList, 'sSign', 1);
        document.querySelector('.tabTittle li[data-index="3"] span').innerHTML = data_3.length;
        noSign.innerHTML = addDom(data_3);

    });

    // 提醒签到    
    document.querySelector('.tipsTo').addEventListener('click', () => {
        const noSignList = noSign.querySelectorAll('li');
        if (noSignList.length == 0) {
            err.errMesShow('参会人员均已签到。');
            return false;
        }
        var userList = [];
        for (var i = 0; i < noSignList.length; i++) {
            userList.push(noSignList[i].querySelector('span').innerHTML);
        }
        var userMesList = [];
        userList.map((user) => {
            ajaxTool.findUser({
                'attr': 'name',
                'val': user
            }, (req) => {
                userMesList.push(req);
                if (userMesList.length == userList.length) {
                    // 计算对应邮件信息
                    let emailString = '';
                    userMesList.map((user) => {
                        emailString += (user.email + ',');
                    });
                    ajaxTool.sendMail({
                        email: emailString,
                        title: '会议签到提醒-来自会议助手',
                        mes: '您的会议已经开始，请不要忘记参加并签到。'
                    }, (req) => {
                        if (req.status.trim() == '250 Ok: queued as') {
                            err.errMesShow('正在通过邮件提醒参会人员。');
                            return false;
                        }
                        err.errMesShow(req.status);
                    });
                }
            });
        });
    });

    function addDom(data) {
        let userDom = '';
        data.map((data) => {
            userDom += '<li><div class="pic" style="background:' + tools.radomData(userBgData) + '">' + data.name.split('')[0] + '</div><span>' + data.name + '</span></li>'
        });
        return userDom;
    }
})()