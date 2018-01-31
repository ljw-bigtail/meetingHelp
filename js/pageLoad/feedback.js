(() => {
    const err = new Err(errMes);

    let username = tools.getCookie('username');
    let meet = tools.getQuery('meet');
    tools.noUser(username);
    tools.headValue(meet + '-反馈统计-' + project_name);
    tools.titleValue('反馈统计');

    const dom_ul_1 = document.querySelector('.tabMain li[data-index="1"] ul');
    const dom_ul_2 = document.querySelector('.tabMain li[data-index="2"] ul');
    
    const dom_span_1 = document.querySelector('.tabTittle li[data-index="1"] span');
    const dom_span_2 = document.querySelector('.tabTittle li[data-index="2"] span');

    let data_1,
        data_2,
        data_3;

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
        // 已经反馈
        data_1 = tools.filterData(data.statusList, 'sStatus', 0);
        data_2 = tools.filterData(data.statusList, 'sStatus', 1);
        dom_span_1.innerHTML = data_1.length + data_2.length;
        dom_ul_1.innerHTML = addDom(data_1.concat(data_2));

        // 没有反馈
        data_3 = tools.filterData(data.statusList, 'sStatus', 2);
        dom_span_2.innerHTML = data_3.length;
        dom_ul_2.innerHTML = addDom(data_3);
    });

    function addDom(data) {
        let userDom = '';
        data.map((data) => {
            userDom += '<li><div class="pic" style="background:' + tools.radomData(user_avatar_data) + '">' + data.name.split('')[0] + '</div><span>' + data.name + '</span></li>'
        });
        return userDom;
    }
})()