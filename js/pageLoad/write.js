(() => {
    let userData = tools.getUserFormCookie();
    tools.noUser(userData.username);

    const err = new Err(errMes);

    tools.titleValue('我的纪要');
    tools.headValue('我的纪要列表-' + project_name);

    // 绑定事件
    let backList = document.querySelectorAll('.back');
    let writeList = document.querySelectorAll('.writeList');
    // 设置返回按钮
    events.goBack(backList);
    // 删除按钮显示与功能
    events.showBtnEvent(writeList, (e) => {
        // 判断权限：公共的不能随便删，可以删自己的
        tools.runUserFunc(userData, () => {
        }, () => {
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
        });
    });

    // 搜索功能实现
    // 筛选信息，修改值时
    searchBtn.addEventListener('keyup', function () {
        if (writeTitleData > 0) {
            err.errMesShow('数据未加载完成，请稍后。');
            return false;
        }
        haveTextInData(this.value, writeTitleData, function () {
            events.hideList(writeListLi);
        }, function (isFind) {
            events.hideList(writeListLi);
            isFind.map(function (num) {
                writeListLi[num].style.display = 'block';
            });
        });
    });

    // 查询Data中是否有text
    function haveTextInData(text, Data, callback1, callback2) {
        let reg = new RegExp(text, 'g');
        let isFind = [];
        Data.map(function (value, index) {
            if (value.match(reg)) {
                isFind.push(index)
            }
        });
        if (isFind.length == 0) {
            // 没找到
            callback1();
        } else {
            // 找到的数组           
            callback2(isFind);
        }
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
                (_data.name == '' ? '公共纪要' : '我的纪要') + '</span></div></a></div>' +
                '<span class="showBtn">&gt;</span></div><div class="del">删除，不可逆</div></li>'
        });
        return dom;
    }
})();