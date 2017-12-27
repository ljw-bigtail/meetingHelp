(() => {
    const err = new Err(errMes);

    let username = tools.getCookie('username');
    let meet = tools.getQuery('meet')

    let changeBtn = document.querySelector('.changeBtn');
    let meetTitle = document.querySelector('.meetTitle');
    let meetPlace = document.querySelector('.meetPlace');
    let startDom = document.querySelector('.start');
    let endDom = document.querySelector('.end');
    let mDesc = document.querySelector('.meetMes');
    let meetAdmin = document.querySelector('.meetAdmin');
    let meetPeople = document.querySelector('.meetPeople');
    let pic = meetAdmin.querySelector('.pic');
    let name = meetAdmin.querySelector('.name');
    let email = meetAdmin.querySelector('.email');
    let phone = meetAdmin.querySelector('.phone');
    let pushMes = document.querySelector('#pushMes');
    let pushBtn = document.querySelector('.pushBtn');

    // 保留会议纪要加载之后的那条信息
    let pushMesValue = '';
    
    // 用户头像背景色数组
    const userBgData = ['#F76B8A', '#028090', '#02C39A', '#EC9454', '#849561'];

    // 获取我对于本会议留过的会议纪要
    ajaxTool.findNote({
        option: {
            'mName': meet,
            'name':''
        }
    }, (noteData) => {
        if(noteData.nMes){
            pushMes.value = noteData.nMes;
            pushBtn.innerHTML = '更新';        
        }
        pushMesValue = pushMes.value;
        pushBtn.innerHTML = '发表';
    });

    // 更新会议相关信息
    ajaxTool.findMeet({
        'attr': 'mName',
        'val': meet
    }, (meetData) => {
        // console.log(meetData);
        meetTitle.innerHTML = meetData.mName;
        meetPlace.innerHTML = meetData.mName;
        startDom.innerHTML = meetData.mStartTime;
        endDom.innerHTML = meetData.mEndTime;
        mDesc.innerHTML = meetData.mDesc;

        // 加载发起人
        pic.innerHTML = meetData.mAdmin.split('')[0];
        pic.style.background = radomData(userBgData);
        ajaxTool.findUser({
            'attr': 'name',
            'val': meetData.mAdmin
        }, (userData) => {
            // console.log(userData);
            name.innerHTML += userData.name;
            email.innerHTML += userData.email;
            phone.innerHTML += userData.phone;
        });

        // 加载参会人
        let userDom = '';
        meetData.mPeople.split(',').map((data) => {
            userDom += '<li><div class="pic" style="background:' + radomData(userBgData) + '">' + data.split('')[0] + '</div><span>' + data + '</span></li>'
        });
        meetPeople.innerHTML = userDom;

        // 根据状态改变现实效果
        let now = new Date();
        let start = new Date(meetData.mStartTime)
        let end = new Date(meetData.mEndTime)
        if (now < start) {
            console.log('会议未开')

        } else if (end < now) {
            console.log('会议开完')
            document.querySelector('.meetMain footer').style.display = 'none';

        } else {
            console.log('会议正在开')

        }

    });

    // 保存\更新纪要信息
    pushBtn.addEventListener('click', () => {
        var note = {
            'nTitle': pushMes.value.substring(0, 15),
            'name': name.innerHTML.split('：')[1] == username ? '' : username,
            'mName': meet,
            'nMes': pushMes.value
        };
        if(pushBtn.innerHTML == '发表'){
            // 新建纪要
            if (pushMes.value == pushMesValue) {
                err.errMesShow('请填写内容后再发表。');
                return false;
            }  
            ajaxTool.addNote(note,(req)=>{
                if(req.status == 'success'){
                    err.errMesShow('会议纪要发表成功。');
                }else{
                    err.errMesShow('请稍后重试，谢谢。');                
                }
            });
        }else if(pushBtn.innerHTML == '更新'){
            // 更新纪要
            
        }else{
            err.errMesShow('系统繁忙，请稍后。');            
        }
    });

    function radomData(data) {
        let num = Math.floor(Math.random() * data.length);
        return data[num];
    }
})();