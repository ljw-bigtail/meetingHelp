let events = {
    // 批量增加返回上一页功能
    goBack: (domList) => {
        events.addEventForList(domList, 'click', () => {
            history.go(-1);
        })
    },
    // 展开按钮盒子，并绑定按钮事件（删除）
    showBtnEvent: (domList, callback) => {
        domList.forEach(function (item, index) {
            item.addEventListener('click', function (e) {
                // 展开删除按钮,事件代理
                if (e.target.className == 'showBtn') {
                    events.toggleShow(e.toElement.parentNode.parentNode.querySelector('.del'));
                }
                // 删除本条,事件代理
                if (e.target.classList[0] == 'del') {
                    // 删除当前节点，后续操作没有想好,
                    // 回传的参数未定，后续增加。
                    callback && callback(e.toElement);
                }
            });
        });
    },
    // 单选盒子事件代理
    chooseOne: (domList, callback) => {
        domList.forEach(function (item, index) {
            item.querySelector('ul').addEventListener('click', function (e) {
                if (e.target.nodeName == 'LI') {
                    events.removeClass(this.querySelectorAll('li'));
                    events.toggleClass(e.toElement, 'select', '');
                    item.querySelector('ul').parentNode.querySelector('span.val').innerHTML = e.toElement.innerHTML;
                    // 不确定回传的参是什么
                    callback && callback();
                }
            });
        });
    },
    // 多选盒子事件代理
    chooseList: (domList, callback) => {
        domList.forEach(function (item, index) {
            item.querySelector('ul').addEventListener('click', function (e) {
                if (e.target.nodeName == 'LI') {
                    events.toggleClass(e.toElement, 'select', '');
                    // item.querySelector('span.val').innerHTML = '已选择' + item.querySelectorAll('ul li.select').length + '人';
                    // 不确定回传的参是什么
                    callback && callback();
                }
            });
        });
    },
    // tab切换
    runTab: (mPTabTitle, mPTabMain, callback) => {
        events.addEventForList(mPTabMain, 'click', function (item, index) {
            events.removeClass(mPTabMain);
            events.hideList(mPTabTitle);
            events.toggleClass(item, 'select', '');
            mPTabTitle[index].style.display = 'block';
            callback && callback();
        })
    },
    // 批量删除dom的类名
    removeClass: (domList) => {
        domList.forEach(function (item, index) {
            item.className = '';
        });
    },
    // 批量隐藏dom
    hideList: (domList) => {
        domList.forEach(function (item, index) {
            item.style.display = 'none';
        });
    },
    // 批量监听事件
    addEventForList: (domList, event, callback) => {
        domList.forEach(function (item, index) {
            item.addEventListener(event, function () {
                callback(item, index);
            });
        });
    },
    //切换显示方式
    toggleShow: (dom) => {
        if (dom) {
            if (dom.style.display == 'block') {
                dom.style.display = 'none';
            } else {
                dom.style.display = 'block';
            }
        }
    },
    //切换class
    toggleClass: (dom, oldClassName, newClassName) => {
        if (dom.className == newClassName) {
            dom.className = oldClassName;
        } else {
            dom.className = newClassName;
        }
    }
}