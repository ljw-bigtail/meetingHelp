(() => {
    let cameraBtn = document.querySelector('#cameraBtn');
    let photoBtn = document.querySelector('#photoBtn');
    let cameraInput = document.querySelector('#cameraInput');
    let photoInput = document.querySelector('#photoInput');

    cameraBtn.addEventListener('click', function () {
        cameraInput.click();
    });
    photoBtn.addEventListener('click', function () {
        photoInput.click();
    });

    // 上传二维码文件   

})()