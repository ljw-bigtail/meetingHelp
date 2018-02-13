(() => {
    tools.stopZoomInIos();
    
    let userData = tools.getUserFormCookie();
    tools.noUser(userData.username);

    const err = new Err(errMes);

    tools.titleValue('会议记录');
    tools.headValue('我的记录列表-' + project_name);

    // 绑定事件
    let backList = document.querySelectorAll('.back');
    let writeList = document.querySelectorAll('.writeList');
    // 设置返回按钮
    events.goBack(backList);
    // 删除按钮显示与功能
    events.showBtnEvent(writeList, (e) => {
        // 判断权限：公共的不能随便删，可以删自己的
        tools.runUserFunc(userData, () => {}, () => {
            if (e.parentNode.querySelector('.mesIsPub span').innerHTML == '公共纪要') {
                err.errMesShow('没有权限，请联系管理员');
                return false;
            }
        });
        // 删除功能
        ajaxTool.delNote({
            option: {
                'nTitle': e.parentNode.querySelector('h3').innerHTML,
                'name': '',
            }
        }, (req) => {
            if (req.status == "success") {
                err.errMesShow('删除成功');
                e.parentNode.style.display = 'none';
            }
        });
    });

    const searchBtn = document.querySelector('.searchBtn');
    const writeListUl = writeList[0].querySelector('ul');
    let writeListLi;
    let writeTitleData = [];

    // 根据用户权限修改显示的按钮：管理员，用户
    tools.runUserFunc(userData, () => {
        ajaxTool.findNoteList({
            'name': ''
        }, (data) => {
            // 在会议地点中加载
            writeListUl.innerHTML = addDOM(data);
            // 重组数组
            writeListLi = writeListUl.querySelectorAll('li');
            data.forEach(function (_data) {
                writeTitleData.push(_data.nTitle);
            });
            // 根据dom绑定搜索
            bindSearch(writeTitleData, writeListLi);
        });
    }, () => {
        // 加载会议室列表
        ajaxTool.getwriteList({
            'user': userData.username
        }, (data) => {
            // 在会议地点中加载
            writeListUl.innerHTML = addDOM(data.writeList);
            // 重组数组
            writeListLi = writeListUl.querySelectorAll('li');
            data.writeList.forEach(function (_data) {
                writeTitleData.push(_data.nTitle);
            });
            // 根据dom绑定搜索
            bindSearch(writeTitleData, writeListLi);
        });
    });

    // 搜索功能实现
    // 筛选信息，修改值时
    function bindSearch(data, dom) {
        searchBtn.addEventListener('change', function () {
            tools.haveTextInData(this.value, data, function () {
                events.hideList(dom);
            }, function (isFind) {
                events.hideList(dom);
                isFind.map(function (num) {
                    dom[num].style.display = 'block';
                });
            });
        });
    }

    // 修改时间显示格式
    function changeTime(time) {
        let data = time.replace(/T/, ' ').split(':');
        return data[0] + ':' + data[1];
    }

    function addDOM(data) {
        let dom = '';
        data.map((_data) => {
            dom += '<li><div class="main"><div class="mes">' +
                '<a href="writeDetail.html?note=' + _data.nTitle + '&isMain=' +
                (_data.name == '' ? true : false) + '"><h3>' + _data.nTitle +
                '</h3><div class="mesPeople"><img src="img/03.png" alt=""><span>' +
                changeTime(_data.meta.updateAt) + '</span></div><div class="mesIsPub"><img src="img/public1.png" alt=""><span>' +
                (_data.name == '' ? '会议纪要' : '我的笔记') + '</span></div></a></div>' +
                (_data.name == '' && userData.level == 1 ? '<span>&gt;</span></div>' : '<span class="showBtn">&gt;</span></div><div class="del">彻底删除</div>') +
                '</li>'
        });
        return dom;
    }
})();