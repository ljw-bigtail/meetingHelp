(() => {
    const err = new Err(errMes);

    let username = tools.getCookie('username');
    let meet = tools.getQuery('meet')

    ajaxTool.getStatusList({
        'attr': 'mName',
        'val': meet
    }, (data) => {
        // 待审批
        let data_1 = tools.filterData(data.statusList, 'sLeave', 0);
        document.querySelector('.tabTittle li[data-index="1"] span').innerHTML = data_1.length;
        document.querySelector('.tabMain li[data-index="1"] ul').innerHTML = addDom(data_1);

        // 已请假
        let data_2 = tools.filterData(data.statusList, 'sLeave', 1);
        document.querySelector('.tabTittle li[data-index="2"] span').innerHTML = data_2.length;
        document.querySelector('.tabMain li[data-index="2"] ul').innerHTML = addDom(data_2);

        // 退审
        let data_3 = tools.filterData(data.statusList, 'sLeave', 2);
        document.querySelector('.tabTittle li[data-index="3"] span').innerHTML = data_3.length;
        document.querySelector('.tabMain li[data-index="3"] ul').innerHTML = addDom(data_3);

    });

    // 获取当前需要操作的人员列表
    document.querySelector('.pass').addEventListener('click', () => {
        let userList = getUserList();
        if (userList.length == 0) {
            err.errMesShow('请选择需要修改的用户。');
            return false;
        }
        // 发起请求
        userList.map((user)=>{
            ajaxTool.updateStatus({
                'option': {
                    'name': user,
                    'mName': meet,
                    'sLeave': 1,
                }
            }, (req) => {
                if (req.status == "success") {
                    err.errMesShow('批准成功。',()=>{
                        window.location.reload();
                    });
                } else {
                    err.errMesShow('批准失败，请稍后重试。');
                }
            });
        });
    });

    document.querySelector('.noPass').addEventListener('click', () => {
        let userList = getUserList();
        if (userList.length == 0) {
            err.errMesShow('请选择需要修改的用户。');
            return false;
        }
        // 发起请求
        userList.map((user)=>{
            ajaxTool.updateStatus({
                'option': {
                    'name': user,
                    'mName': meet,
                    'sLeave': 2,
                }
            }, (req) => {
                if (req.status == "success") {
                    err.errMesShow('驳回成功。',()=>{
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
            userDom += '<li><div class="pic" style="background:' + tools.radomData(userBgData) + '">' + data.name.split('')[0] + '</div><div><h5>' + data.name + '</h5><span>' + data.sMes + '</span></div></li>';
        });
        return userDom;
    }
})()