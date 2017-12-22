(function(){
    let upLoadPicBtn = document.querySelector('#upLoadPicBtn');

    let newsPic = document.querySelector('#newsPic');
    let uploadImg = document.querySelector('#uploadImg');
    upLoadPicBtn.addEventListener('click', function(){
        if(!newsPic.files.length){
            alert('请选择文件后再上传！');
            return false;
        }
        ajaxTool.uploadImg(newsPic, (req) => {
            document.querySelector('#uploadImg').src = 'http://192.168.199.206:5500/uploads/'+req.filePath;
           // alert("上传完毕！");
        });
    });

})()