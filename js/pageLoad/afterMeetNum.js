(() => {
    const err = new Err(errMes);

    let username = tools.getCookie('username');
    let meet = tools.getQuery('meet');
    tools.noUser(username);
    tools.headValue(meet + '-参会统计-' + project_name);
    tools.titleValue('参会统计');

    const dom_ul_1 = document.querySelector('.tabMain li[data-index="1"] ul');
    const dom_ul_2 = document.querySelector('.tabMain li[data-index="2"] ul');
    const dom_ul_3 = document.querySelector('.tabMain li[data-index="3"] ul');
    const dom_span_1 = document.querySelector('.tabTittle li[data-index="1"] span');
    const dom_span_2 = document.querySelector('.tabTittle li[data-index="2"] span');
    const dom_span_3 = document.querySelector('.tabTittle li[data-index="3"] span');
    const tipsTo = document.querySelector('.tipsTo');
    let data_1, data_2, data_3;

    // 绑定事件
    const backList = document.querySelectorAll('.back');
    const mPTabTitle = document.querySelectorAll('.meetPeopleTab .tabMain > li');
    const mPTabMain = document.querySelectorAll('.meetPeopleTab .tabTittle li');
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
        data_1 = tools.filterData(data.statusList, 'sStatus', 1);
        dom_span_1.innerHTML = data_1.length;
        dom_ul_1.innerHTML = addDom(data_1);

        // 已签到
        data_2 = tools.filterData(data.statusList, 'sSign', 0);
        dom_span_2.innerHTML = data_2.length;
        dom_ul_2.innerHTML = addDom(data_2);

        // 未签到
        data_3 = tools.filterData(data.statusList, 'sSign', 1);
        dom_span_3.innerHTML = data_3.length;
        dom_ul_3.innerHTML = addDom(data_3);
    });

    // 提醒签到    
    tipsTo.addEventListener('click', () => {
        const noSignList = dom_ul_3.querySelectorAll('li');
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
                        title: email_title,
                        mes: email_mes
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
            userDom += '<li><div class="pic" style="background:' + tools.radomData(user_avatar_data) + '">' + data.name.split('')[0] + '</div><span>' + data.name + '</span></li>'
        });
        return userDom;
    }
})()