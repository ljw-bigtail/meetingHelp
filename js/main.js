window.onload = function () {
    let backList = document.querySelectorAll('.back');
    let showList = document.querySelectorAll('.showBtn');
    let delList = document.querySelectorAll('.del');
    
    let chooseBox = document.querySelectorAll('.chooseBox');
    let chooseBtnList = document.querySelectorAll('.chooseBox .btn');
    let chooseListBox = document.querySelectorAll('.chooseList');
    let chooseListBtnList = document.querySelectorAll('.chooseList .btn');

    let selectChoose = document.querySelectorAll('.selectBox .choose');    
    
    // 返回上一页
    addEventForList (backList, 'click', function(item, index){
        history.go(-1);
    })
    
    // 删除本条
    addEventForList (delList, 'click', function(item, index){
        console.log('删除')
    })

    // 展开删除按钮
    addEventForList (showList, 'click', function(item, index){
        toggleShow(delList[index]);
    })

    // 展开单选盒子
    addEventForList (chooseBtnList, 'click', function(item, index){
        toggleShow(chooseBox[index].querySelector('ul'));
    })

    // 展开多选盒子
    addEventForList (chooseListBtnList, 'click', function(item, index){
        toggleShow(chooseListBox[index].querySelector('ul'));
    })
    
    //单选盒子,事件代理
    chooseBox.forEach(function(item, index){
        let chooseOne = item.querySelector('ul');
        chooseOne.addEventListener('click', function(e){
            if(e.target.nodeName == 'LI'){
                let chooseOneList = this.querySelectorAll('li');
                removeClass(chooseOneList);
                toggleClass(e.toElement, 'select', '');
                chooseOne.parentNode.querySelector('span.val').innerHTML = e.toElement.innerHTML;
            }
        });
    });

    // 多选盒子,事件代理
    chooseListBox.forEach(function(item, index){
        let chooseOne = item.querySelector('ul');
        chooseOne.addEventListener('click', function(e){
            if(e.target.nodeName == 'LI'){
                let chooseOneList = this.querySelectorAll('li');
                toggleClass(e.toElement, 'select', '');
                item.querySelector('span.val').innerHTML = '已选择' + item.querySelectorAll('ul li.select').length + '人';    
            }
        });
    });

    addEventForList (selectChoose, 'click', function(item, index){
        toggleClass(item.querySelector('div'), 'selected', '');
    })

    // 请假
    let leaveBtn = document.querySelector('.leaveBtn');    
    let leaveBox = document.querySelector('.leaveBox');
    let leaveClose = document.querySelector('.leaveClose');
    let leaveSave = document.querySelector('.leaveSave');
    if(leaveBtn && leaveBox && leaveClose && leaveSave){
        leaveBtn.addEventListener('click', function(){
            leaveBox.style.display = 'block';
        });
        leaveClose.addEventListener('click', function(){
            leaveBox.style.display = 'none';
        });
        leaveSave.addEventListener('click', function(){
            //保存请假信息
            leaveBox.style.display = 'none';
        });
    }

    //是否选中，待审批
    let mPMainList = document.querySelectorAll('.meetPeopleSelect .tabMain > li');
    let meetPeopleList = document;
    mPMainList.forEach(function(item, index){
        let mPMainListOne = item.querySelectorAll('ul li');
        addEventForList (mPMainListOne, 'click', function(item, index){
            toggleClass(item, 'select', '');
        })
    });

    //tab切换
    let mPTabTitle = document.querySelectorAll('.meetPeopleTab .tabMain > li');
    let mPTabMain = document.querySelectorAll('.meetPeopleTab .tabTittle li');
    addEventForList (mPTabMain, 'click', function(item, index){
        removeClass(mPTabMain);  
        hideList(mPTabTitle);
        toggleClass(item, 'select', '');
        mPTabTitle[index].style.display = 'block';
    })
    
    //请假通过、不通过
    let noPassBtn = document.querySelector('.noPass');
    let passBtn = document.querySelector('.pass');
    if(noPassBtn){
        noPassBtn.addEventListener('click', function(){
            console.log('不通过')
        });
    }
    if(passBtn){
        passBtn.addEventListener('click', function(){
            console.log('通过')
        });
    }
     
    //搜索
    let searchBtn =document.querySelector('.searchBtn');
    let writeList =document.querySelectorAll('.writeList li');
    let writeTitleData = [];
    document.querySelectorAll('.writeList li h3').forEach(function(dom){
        writeTitleData.push(dom.innerHTML)
    });
    if(searchBtn){
        searchBtn.addEventListener('keyup', function(){
            haveTextInData(this.value, writeTitleData, function(){
                hideList(writeList);        
            }, function(isFind){
                hideList(writeList);        
                isFind.map(function(num){
                    writeList[num].style.display = 'block';
                });
            });
        });
    }

    // 查询Data中是否有text
    function haveTextInData(text, Data, callback1, callback2){
        var reg = new RegExp(text);
        var isFind = [];
        Data.map(function(value, index){
            if(value.match(reg)){
                isFind.push(index)
                console.log(value,index+1);
            }
        });
        if(isFind.length == 0){
            callback1();
        }else{
            callback2(isFind);
        }
    }
}

// 批量删除dom的类名
function removeClass(domList){
    domList.forEach(function(item, index){
        item.className = '';
    });
}

// 批量隐藏dom
function hideList(domList){
    domList.forEach(function(item, index){
        item.style.display = 'none';
    });
}

// 批量监听事件
function addEventForList (domList, event, callback){
    domList.forEach(function(item, index){
        item.addEventListener(event, function(){
            callback(item, index);
        });
    });
}

//切换显示方式
function toggleShow(dom){
    if(dom.style.display == 'block'){
        dom.style.display = 'none';
    }else{
        dom.style.display = 'block';
    }
}


//切换class
function toggleClass(dom, oldClassName, newClassName){
    if(dom.className == newClassName){
        dom.className = oldClassName;
    }else{
        dom.className = newClassName;
    }
}
