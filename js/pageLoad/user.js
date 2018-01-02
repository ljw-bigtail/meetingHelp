(function () {
    // 初始化页面数据
    let username = document.getElementById('username');
    let phone = document.getElementById('phone');
    let email = document.getElementById('email');
    let desc = document.getElementById('desc');
    let department = document.getElementById('department');
    let logout = document.querySelector('.logout');

    username.value = tools.getCookie('username');
    phone.value = tools.getCookie('phone');
    email.value = tools.getCookie('email');
    desc.value = tools.getCookie('desc');
    department.value = tools.getCookie('department');

    // 保存数据
    document.querySelector('.save').addEventListener('click', () => {
        // 校验
        if (phone.value && email.value) {
            if (!tools.isMobile(phone.value)) {
                phone.parentNode.style.outline = '2px dashed red';
                return false;
            }
            if (!tools.isEmail(email.value)) {
                email.parentNode.style.outline = '2px dashed red';
                return false;
            }
            let userData = {
                'name': username.value,
                'update': {
                    'phone': phone.value,
                    'email': email.value,
                    'desc': desc.value
                }
            }
            //校验成功
            ajaxTool.updateUser(userData, (req) => {
                //修改cookie中的值
                tools.setCookie('phone', req.userMes.phone, 7);
                tools.setCookie('email', req.userMes.email, 7);
                tools.setCookie('desc', req.userMes.desc, 7);
            });
        }
    });

    phone.addEventListener('focus', () => {
        phone.parentNode.style.outline = '0px';
    });
    email.addEventListener('focus', () => {
        email.parentNode.style.outline = '0px';
    });

    logout.addEventListener('click', () => {
        tools.delCookie('username');
        tools.delCookie('phone');
        tools.delCookie('email');
        window.location.href = '/login.html';
    });
})()