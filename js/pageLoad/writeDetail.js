(() => {
    let errMes = new Err(document.querySelector('#errMes'));

    // 获取并设置会议室信息
    let note = tools.getQuery('note');
    let isMain = tools.getQuery('isMain');
    var username = tools.getCookie('username');
    tools.noUser(username);
    tools.titleValue('纪要详情');
    tools.headValue(note + '的纪要详情-' + project_name);

    // 绑定事件
    let backList = document.querySelectorAll('.back');
    // 设置返回按钮
    events.goBack(backList);

    const publicBtn = document.querySelector('#public');
    const save = document.querySelector('.save');
    const textMain = document.querySelector('.textMain textarea');
    const noteName = document.querySelector('.noteName');
    const writeMainTit = document.querySelector('.writeMain h5');
    const writeMainTime = document.querySelector('.writeMain .mesPeople span:last-child');

    noteName.innerHTML = note;

    let noteDate = {
        mName: '',
        nMes: '',
        nTitle: '',
        name: '',
    };

    ajaxTool.findNote({
        option: {
            'nTitle': note
        }
    }, function (data) {
        // 数组合并
        Object.assign(noteDate, data);

        // 填充数据
        writeMainTime.innerHTML = changeTime(data.meta.updateAt);
        textMain.value = data.nMes;
        writeMainTit.innerHTML = '<a href="meetDetail.html?meet=' + data.mName + '">' + data.mName + '</a>';

        // 会议公共纪要
        // 还需要增加一个条件：用户不是该meet的管理员
        ajaxTool.findMeet({
            'attr': 'mName',
            'val': noteDate.mName
        }, (mData) => {
            if(mData.mAdmin == username || isMain != 'true'){
                publicBtn.style.display = 'none';
                textMain.removeAttribute('disabled');
            }
        });
    });

    // 点击提示
    publicBtn.addEventListener('click', function () {
        errMes.errMesShow('公共纪要，可以查看，不可编辑。');
    });

    // 保存纪要信息
    save.addEventListener('click', function () {
        errMes.errMesShow('正在保存，请稍后...');
        if (noteDate.nMes == textMain.value) {
            errMes.errMesShow('纪要内容没有修改。');
            return false;
        }
        if(textMain.value.length == 0){
            errMes.errMesShow('请填写后再保存纪要信息。');
            return false;
        } 
        noteDate.nMes = textMain.value;
        // 更新请求
        ajaxTool.updateNote(noteDate, (data) => {
            console.log(data)
            if (data.status == 'success') {
                errMes.errMesShow('修改完成。');
            }
        });
    });

    // 修改时间显示格式
    function changeTime(time) {
        let data = time.replace(/T/, ' ').split(':');
        return data[0] + ':' + data[1];
    }

})()