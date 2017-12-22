(function () {
    let username = document.querySelector('#username');
    let password = document.querySelector('#password');
    let login = document.querySelector('#login');

    let usernameValue,
        passwordValue;

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
            'type':'name',
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
            if(req.status == "success"){
                window.location.pathname = '/index.html';
                //存cookie
                tools.setCookie('username', req.userMes.name, 7);
                tools.setCookie('phone', req.userMes.phone, 7);
                tools.setCookie('email', req.userMes.email, 7);
                tools.setCookie('desc', req.userMes.desc, 7);
                tools.setCookie('department', req.userMes.dName, 7);
            }
            return false;
            //验证失败
            var reqMes = document.querySelector('#reqMes');
            reqMes.style.display = 'block';                
            reqMes.innerHTML = req.mes;
            setTimeout(function(){
                reqMes.style.display = 'none';
            } ,3000);
        });
    });
    // 6ECSwj
})()