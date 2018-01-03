(() => {
    const err = new Err(errMes);

    let username = tools.getCookie('username');
    tools.noUser(username);
    tools.headValue('扫码签到-' + project_name);
    tools.titleValue('扫码签到');

    // 绑定事件 
    let backList = document.querySelectorAll('.back');
    let cameraBtn = document.querySelector('#cameraBtn');
    let cameraInput = document.querySelector('#cameraInput');
    // 返回按钮
    events.goBack(backList);
    // 出发上传文件按钮
    cameraBtn.addEventListener('click', function () {
        cameraInput.click();
    });

    // 拍照上传二维码文件
    cameraInput.addEventListener('change', () => {
        handleFiles(cameraInput.files[0]);
        qrcode.callback = (e) => {
            let data = JSON.parse(decodeURI(e))
            let now = new Date();
            let start = new Date(data.mStartTime);
            let end = new Date(data.mEndTime);

            let canSign = 0;

            data.mPeople.map((user) => {
                if (user == username) {
                    canSign += 1;
                }
            });
            // 校验时间，校验人员
            if (start <= now && now <= end) {
                // 会议进行中                
                err.errMesShow('你迟到了。');
                return false;
            }
            if (end <= now) {
                // 会议结束后
                err.errMesShow('会议已经结束了。');
                return false;
            }
            if (now <= start) {
                if (canSign == 1) {
                    ajaxTool.updateStatus({
                        'option': {
                            'name': username,
                            'mName': data.mName,
                            'sSign': 0,
                        }
                    }, (req) => {
                        if (req.status == "success") {
                            err.errMesShow('签到成功。');
                            return false;
                        }
                        if (req.mes == "信息重复。") {
                            err.errMesShow('请勿重复签到。');
                            return false;
                        }
                        err.errMesShow('签到失败，请稍后再试。');
                    });
                } else {
                    err.errMesShow('你无权参加本会议。');
                }
            }
        };
    });

    // 搞不明白是怎么用的，llqrcode.js
    function handleFiles(f) {
        var reader = new FileReader();
        reader.onload = (function (theFile) {
            return function () {
                qrcode.decode(reader.result);
            };
        })(f);
        reader.readAsDataURL(f);
    }

})()