(() => {
    const err = new Err(errMes);

    let username = tools.getCookie('username');
    let meet = tools.getQuery('meet');
    tools.noUser(username);
    tools.headValue(meet + '-请假统计-' + project_name);
    tools.titleValue('请假统计');

    // if(username == )
    ajaxTool.findMeet({
        'attr': 'mName',
        'val': meet
    }, (meetData) => {
        // 放置没有权限的审批请假
        if (username != meetData.mAdmin) {
            window.location.href = '/';
        }
    });

    const dom_ul_1 = document.querySelector('.tabMain li[data-index="1"] ul');
    const dom_ul_2 = document.querySelector('.tabMain li[data-index="2"] ul');
    const dom_ul_3 = document.querySelector('.tabMain li[data-index="3"] ul');
    const dom_span_1 = document.querySelector('.tabTittle li[data-index="1"] span');
    const dom_span_2 = document.querySelector('.tabTittle li[data-index="2"] span');
    const dom_span_3 = document.querySelector('.tabTittle li[data-index="3"] span');
    const pass = document.querySelector('.pass');
    const noPass = document.querySelector('.noPass');
    let data_1, data_2, data_3;

    // 绑定事件
    let backList = document.querySelectorAll('.back');
    let mPTabTitle = document.querySelectorAll('.meetPeopleTab .tabMain > li');
    let mPTabMain = document.querySelectorAll('.meetPeopleTab .tabTittle li');
    let mPMainList = document.querySelectorAll('.meetPeopleSelect .tabMain > li[data-index="1"]');
    // 设置返回按钮
    events.goBack(backList);
    // 设置Tab
    events.runTab(mPTabTitle, mPTabMain);
    // 绑定角色选中（多选）
    events.chooseList(mPMainList);

    ajaxTool.getStatusList({
        'attr': 'mName',
        'val': meet
    }, (data) => {
        // 请假
        dataLeave = tools.filterData(data.statusList, 'sStatus', 1);

        // 待审批
        // 条件：请假、待审批
        data_1 = tools.filterData(dataLeave, 'sLeave', 0);
        dom_span_1.innerHTML = data_1.length || 0;
        dom_ul_1.innerHTML = addDom(data_1);

        // 已请假
        // 请假、已审批
        data_2 = tools.filterData(dataLeave, 'sLeave', 1);
        dom_span_2.innerHTML = data_2.length || 0;
        dom_ul_2.innerHTML = addDom(data_2);

        // 退审
        // 请假、退审
        data_3 = tools.filterData(dataLeave, 'sLeave', 2);
        dom_span_3.innerHTML = data_3.length || 0;
        dom_ul_3.innerHTML = addDom(data_3);
    });

    // 获取当前需要操作的人员列表
    pass.addEventListener('click', () => {
        let userList = getUserList();
        if (userList.length == 0) {
            err.errMesShow('请选择需要修改的用户。');
            return false;
        }
        // 发起请求
        userList.map((user) => {
            ajaxTool.updateStatus({
                'option': {
                    'name': user,
                    'mName': meet,
                    'sLeave': 1,
                }
            }, (req) => {
                if (req.status == "success") {
                    err.errMesShow('批准成功。', () => {
                        window.location.reload();
                    });
                } else {
                    err.errMesShow('批准失败，请稍后重试。');
                }
            });
        });
    });

    noPass.addEventListener('click', () => {
        let userList = getUserList();
        if (userList.length == 0) {
            err.errMesShow('请选择需要修改的用户。');
            return false;
        }
        // 发起请求
        userList.map((user) => {
            ajaxTool.updateStatus({
                'option': {
                    'name': user,
                    'mName': meet,
                    'sLeave': 2,
                }
            }, (req) => {
                if (req.status == "success") {
                    err.errMesShow('驳回成功。', () => {
                        window.location.reload();
                    });
                } else {
                    err.errMesShow('驳回失败，请稍后重试。');
                }
            });
        });
    });

    function getUserList() {
        let userList = [];
        let choosedUser = document.querySelectorAll('.tabMain li[data-index="1"] ul li.select');
        for (var i = 0; i < choosedUser.length; i++) {
            userList.push(choosedUser[i].querySelector('h5').innerHTML);
        }
        return userList;
    }

    function addDom(data) {
        let userDom = '';
        data.map((data) => {
            userDom += '<li><div class="pic" style="background:' + tools.radomData(user_avatar_data) + '">' + data.name.split('')[0] + '</div><div><h5>' + data.name + '</h5><span>' + data.sMes + '</span></div></li>';
        });
        return userDom;
    }
})()