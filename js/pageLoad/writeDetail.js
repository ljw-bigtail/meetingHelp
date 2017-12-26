(() => {
    // 获取并设置会议室信息
    var note = tools.getQuery('note');
    document.querySelector('.noteName').innerHTML = note;

    ajaxTool.findNote({
        'attr': 'nTitle',
        'val': note
    }, function (data) {
        console.log(data)
        // document.querySelector('.roomNumber').innerHTML = data.rNum;
        // document.querySelector('.roomAddress').innerHTML = data.rPlace;
        // var dom = '';
        // data.rDevice.split('/').map((text) => {
        //     dom += '<i>' + text + '</i><br>'
        // });
        // document.querySelector('.roomDevice').innerHTML = dom;
    });

    // 还需要计算会议室预定信息，后台暂未提供对应的信息和接口

})()