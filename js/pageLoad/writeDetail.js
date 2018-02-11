(() => {
    let err = new Err(document.querySelector('#errMes'));
    let userData = tools.getUserFormCookie();

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

    const mainBox = document.querySelector('body > .hasFooter');
    const footerBox = document.querySelector('body > footer');
    const publicBtn = document.querySelector('#public');
    const save = document.querySelector('.save');
    const textMain = document.querySelector('.textMain textarea');
    const noteName = document.querySelector('.noteName');
    const writeMainTit = document.querySelector('.writeMain h5');
    const writeMainTime = document.querySelector('.writeMain .mesPeople span:last-child');

    const detailTitle = document.querySelector('.writeMain h6');
    const pushState = document.querySelector('.writeMain .pushState span');

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

         // 提示状态信息
         if(data.isPush){
            pushState.innerHTML = '已发布，请谨慎修改';
            pushState.style.color = 'rgb(216, 23, 17)'
        }else{
            pushState.innerHTML = '还没有发布呢';            
        }
        
        // 填充数据
        writeMainTime.innerHTML = changeTime(data.meta.updateAt);
        writeMainTit.innerHTML = '<a href="meetDetail.html?meet=' + data.mName + '">' + data.mName + '</a>';

        // 会议公共纪要
        // 还需要增加一个条件：用户不是该meet的管理员
        ajaxTool.findMeet({
            'attr': 'mName',
            'val': noteDate.mName
        }, (mData) => {
            tools.runUserFunc(userData, () => {
                // 如果管理员怎样都行
                publicBtn.style.display = 'block';
                textMain.value = data.nMes;
                textMain.removeAttribute('disabled');
            }, () => {
                // 如果是公共纪要，icon显示
                if (isMain == 'true') {
                    publicBtn.style.display = 'block';
                    // 如果是会议管理员的话可以编辑
                    if (mData.mRecorder == username) {
                        textMain.value = data.nMes;
                        textMain.removeAttribute('disabled');
                    } else {
                        // 检查公共纪要的权限
                        if (mData.mNote == 1) {
                            err.errMesShow('没有查看公共纪要的权限。', () => {
                                history.back();
                            });
                        } else {
                            // 只能查看
                            footerBox.style.display = 'none';
                            mainBox.className = '';
                            textMain.value = data.nMes;
                        }
                    }
                } else {
                    // 如果是个人纪要，可以编辑
                    publicBtn.style.display = 'none';
                    textMain.value = data.nMes;
                    textMain.removeAttribute('disabled');
                    detailTitle.innerHTML = '笔记内容';
                    tools.titleValue('笔记详情');
                    tools.headValue(note + '的笔记详情-' + project_name);
                }
            });
        });
    });

    // 点击提示
    publicBtn.addEventListener('click', function () {
        err.errMesShow('公共纪要，谨慎操作。');
    });

    // 保存纪要信息
    save.addEventListener('click', function () {
        err.errMesShow('正在保存，请稍后...');
        if (noteDate.nMes == textMain.value) {
            err.errMesShow('纪要内容没有修改。');
            return false;
        }
        if (textMain.value.length == 0) {
            err.errMesShow('请填写后再保存纪要信息。');
            return false;
        }
        noteDate.nMes = textMain.value;
        // 更新请求
        ajaxTool.updateNote(noteDate, (data) => {
            // console.log(data)
            if (data.status == 'success') {
                err.errMesShow('修改完成。');
            }
        });
    });

    // 修改时间显示格式
    function changeTime(time) {
        let data = time.replace(/T/, ' ').split(':');
        return data[0] + ':' + data[1];
    }

})()