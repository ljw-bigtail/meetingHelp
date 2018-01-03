(() => {
    let errMes = new Err(document.querySelector('#errMes'));

    // 绑定事件
    let backList = document.querySelectorAll('.back');
    // 设置返回按钮
    events.goBack(backList);

    // 获取并设置会议室信息
    let note = tools.getQuery('note');
    let isMain = tools.getQuery('isMain');
    document.querySelector('.noteName').innerHTML = note;

    let publicBtn = document.querySelector('#public');
    let save = document.querySelector('.save');
    let textMain = document.querySelector('.textMain textarea');

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
        document.querySelector('.writeMain .mesPeople span:last-child').innerHTML = changeTime(data.meta.updateAt);
        textMain.value = data.nMes;
        document.querySelector('.writeMain h5').innerHTML = '<a href="meetDetail.html?meet=' + data.mName + '">' + data.mName + '</a>';

        // 会议公共纪要
        if (isMain == 'true') {
            publicBtn.style.display = 'block';
            textMain.disabled = 'disabled';
        } else {
            publicBtn.style.display = 'none';
        }
    });

    // 点击提示
    publicBtn.addEventListener('click', function () {
        errMes.errMesShow('公共纪要，可以查看，不可编辑。');
    });

    // 保存纪要信息
    save.addEventListener('click', function () {
        errMes.errMesShow('正在保存，请稍后...');
        // 纪要内容不修改，不提交
        if (noteDate.nMes == textMain.value) {
            errMes.errMesShow('纪要内容没有修改。');
            return false;
        } else {
            noteDate.nMes = textMain.value;
        }
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