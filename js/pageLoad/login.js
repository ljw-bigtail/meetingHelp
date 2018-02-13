(function () {
    tools.stopZoomInIos();
    
    const err = new Err(errMes);

    let username = document.querySelector('#username');
    let password = document.querySelector('#password');
    let login = document.querySelector('#login');

    let isRe = tools.getQuery('isRe');
    if(isRe){
        err.errMesShow('请登录后再进行操作。');
    }

    tools.headValue('登录-' + project_name);
    tools.titleValue(project_name);

    let usernameValue, passwordValue;

    username.addEventListener('keyup', () => {
        username.style.borderColor = '#cccccc';
    });
    password.addEventListener('keyup', () => {
        passwordValue = password.value;
        if (passwordValue !== '' && passwordValue.length >= 6) {
            login.style.height = '6rem';
        } else {
            login.style.height = 0;
        }
    });
    login.addEventListener('click', () => {
        usernameValue = username.value;
        passwordValue = password.value;
        let checkData = {
            'type': 'name',
            'val': usernameValue,
            'password': passwordValue
        };

        // 非空判断
        if (usernameValue == '') {
            username.style.borderColor = 'red';
            return false;
        }

        //密码校验
        ajaxTool.checkUser(checkData, (req) => {
            if (req.status == "success") {
                //存cookie
                tools.setCookie('username', req.userMes.name, save_day);
                tools.setCookie('phone', req.userMes.phone, save_day);
                tools.setCookie('email', req.userMes.email, save_day);
                tools.setCookie('desc', req.userMes.desc, save_day);
                tools.setCookie('department', req.userMes.dName, save_day);
                tools.setCookie('initiate', req.userMes.initiate, save_day);
                tools.setCookie('level', req.userMes.level, save_day);
                // 跳转至主页
                window.location.href = './index.html';
            }
            //验证失败
            err.errMesShow(req.mes);
        });
    });
})()