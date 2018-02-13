(() => {
    tools.stopZoomInIos();
    const err = new Err(errMes);
    const message = new Message(['email', 'app']);
    let userData = tools.getUserFormCookie();

    let meet = tools.getQuery('meet');
    tools.noUser(userData.username);
    tools.headValue(meet + '-参会统计-' + project_name);
    tools.titleValue('参会统计');

    const dom_ul_1 = document.querySelector('.tabMain li[data-index="1"] ul');
    const dom_ul_2 = document.querySelector('.tabMain li[data-index="2"] ul');
    // const dom_ul_3 = document.querySelector('.tabMain li[data-index="3"] ul');
    const dom_span_1 = document.querySelector('.tabTittle li[data-index="1"] span');
    const dom_span_2 = document.querySelector('.tabTittle li[data-index="2"] span');
    // const dom_span_3 = document.querySelector('.tabTittle li[data-index="3"] span');
    const tipsTo = document.querySelector('.tipsTo');
    let data_1, data_2, data_3;

    const chooseAll = document.querySelector('.chooseAll');

    ajaxTool.findMeet({
        'attr': 'mName',
        'val': meet
    }, (meetData) => {
        // 放置没有权限的审批请假
        let canManage = userData.username != meetData.mAdmin && userData.level != 0;
        if (canManage) {
            document.querySelector('.tabMain li[data-index="2"]').removeChild(document.querySelector('footer'));
            dom_ul_2.className = 'userPic';
        }
    });

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
        // data_1 = tools.filterData(data.statusList, 'sStatus', 0);
        // dom_span_1.innerHTML = data_1.length || 0;
        // dom_ul_1.innerHTML = addDom(data_1);

        // 已签到
        data_1 = tools.filterData(data.statusList, 'sSign', 0);
        dom_span_1.innerHTML = data_1.length;
        dom_ul_1.innerHTML = addDom(data_1);

        // 未签到
        data_2 = tools.filterData(data.statusList, 'sSign', 1);
        dom_span_2.innerHTML = data_2.length;
        dom_ul_2.innerHTML = addDom(data_2);

        chooseAll.click();
        // clickAll(dom_ul_2.querySelectorAll('li'));        
    });

    // 角色可选
    dom_ul_2.addEventListener('click', (e) => {
        let dom;
        if (e.target.nodeName == 'DIV' || e.target.nodeName == 'SPAN') {
            dom = e.target.parentNode
        } else if (e.target.nodeName == 'LI') {
            dom = e.target
        } else {
            return false;
        }

        if (dom.className == 'active') {
            dom.className = '';
        } else {
            dom.className = 'active';
        }
    });

    // 全选/取消
    chooseAll.addEventListener('click', (e) => {
        let userListDom = dom_ul_2.querySelectorAll('li');
        if (e.target.innerHTML == '全选') {
            clickAll(userListDom);
            e.target.innerHTML = '反选';
        } else if (e.target.innerHTML == '反选') {
            clickAll(userListDom);
            e.target.innerHTML = '全选'
        }
    });

    function clickAll(list) {
        list.forEach((e) => {
            e.click();
        });
    }

    // 提醒签到    
    tipsTo.addEventListener('click', () => {
        const noSignList = dom_ul_2.querySelectorAll('li.active');
        let userList = [];

        if (noSignList.length == 0) {
            err.errMesShow('请选择需要提醒的角色。');
            return false;
        }
        for (var i = 0; i < noSignList.length; i++) {
            userList.push(noSignList[i].querySelector('span').innerHTML);
        }

        message.sendMes({
            userList: userList,
            title: warn_signin_title,
            mes: warn_signin_mes
        }, (req) => {
            err.errMesShow(tools.checkState(req, '消息推送成功', 'App端消息推送失败', '通知邮件发送消息失败'))
        })
    });

    function addDom(data) {
        let userDom = '';
        data.map((data) => {
            userDom += '<li><div class="pic" style="background:' + tools.radomData(user_avatar_data) + '">' + data.name.split('')[0] + '</div><span>' + data.name + '</span></li>'
        });
        return userDom;
    }
})()