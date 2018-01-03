window.onload = function () {
    let backList = document.querySelectorAll('.back');
    let showList = document.querySelectorAll('.list ul');

    let chooseBox = document.querySelectorAll('.chooseBox');
    let chooseBtnList = document.querySelectorAll('.chooseBox .btn');
    let chooseListBox = document.querySelectorAll('.chooseList');
    let chooseListBtnList = document.querySelectorAll('.chooseList .btn');

    let selectChoose = document.querySelectorAll('.selectBox .choose');

    // 返回上一页
    addEventForList(backList, 'click', function (item, index) {
        history.go(-1);
    })

    showList.forEach(function (item, index) {
        item.addEventListener('click', function (e) {
            // 展开删除按钮,事件代理
            if (e.target.className == 'showBtn') {
                toggleShow(e.toElement.parentNode.parentNode.querySelector('.del'));
            }
            // 删除本条,事件代理
            if (e.target.className == 'del') {
                // 删除当前节点，后续操作没有想好：
                // 不确定是直接删除还是不允许删除，等待管理员进行删除
                item.removeChild(e.toElement.parentNode)
            }
        });
    });

    // 展开单选盒子
    addEventForList(chooseBtnList, 'click', function (item, index) {
        toggleShow(chooseBox[index].querySelector('ul'));
    })

    // 展开多选盒子
    addEventForList(chooseListBtnList, 'click', function (item, index) {
        toggleShow(chooseListBox[index].querySelector('ul'));
    })

    //单选盒子,事件代理
    chooseBox.forEach(function (item, index) {
        let chooseOne = item.querySelector('ul');
        chooseOne.addEventListener('click', function (e) {
            if (e.target.nodeName == 'LI') {
                let chooseOneList = this.querySelectorAll('li');
                removeClass(chooseOneList);
                toggleClass(e.toElement, 'select', '');
                chooseOne.parentNode.querySelector('span.val').innerHTML = e.toElement.innerHTML;
            }
        });
    });

    // 多选盒子,事件代理
    chooseListBox.forEach(function (item, index) {
        let chooseOne = item.querySelector('ul');
        chooseOne.addEventListener('click', function (e) {
            if (e.target.nodeName == 'LI') {
                let chooseOneList = this.querySelectorAll('li');
                toggleClass(e.toElement, 'select', '');
                item.querySelector('span.val').innerHTML = '已选择' + item.querySelectorAll('ul li.select').length + '人';
            }
        });
    });

    // 是否选中状态
    addEventForList(selectChoose, 'click', function (item, index) {
        toggleClass(item.querySelector('div'), 'selected', '');
    })



    //是否选中，待审批
    let mPMainList = document.querySelectorAll('.meetPeopleSelect .tabMain > li');
    let meetPeopleList = document;
    mPMainList.forEach(function (item, index) {
        let mPMainListOne = item.querySelector('ul');
        mPMainListOne.addEventListener('click', function (e) {
            if (e.target.nodeName == 'LI') {
                toggleClass(e.target, 'select', '');
            }
        });
    });

    //tab切换
    let mPTabTitle = document.querySelectorAll('.meetPeopleTab .tabMain > li');
    let mPTabMain = document.querySelectorAll('.meetPeopleTab .tabTittle li');
    addEventForList(mPTabMain, 'click', function (item, index) {
        removeClass(mPTabMain);
        hideList(mPTabTitle);
        toggleClass(item, 'select', '');
        mPTabTitle[index].style.display = 'block';
    })
}

// 批量删除dom的类名
function removeClass(domList) {
    domList.forEach(function (item, index) {
        item.className = '';
    });
}

// 批量隐藏dom
function hideList(domList) {
    domList.forEach(function (item, index) {
        item.style.display = 'none';
    });
}

// 批量监听事件
function addEventForList(domList, event, callback) {
    domList.forEach(function (item, index) {
        item.addEventListener(event, function () {
            callback(item, index);
        });
    });
}

//切换显示方式
function toggleShow(dom) {
    if (dom.style.display == 'block') {
        dom.style.display = 'none';
    } else {
        dom.style.display = 'block';
    }
}


//切换class
function toggleClass(dom, oldClassName, newClassName) {
    if (dom.className == newClassName) {
        dom.className = oldClassName;
    } else {
        dom.className = newClassName;
    }
}