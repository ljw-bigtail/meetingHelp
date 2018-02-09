(function () {
    const err = new Err(errMes);
    let userData = tools.getUserFormCookie();

    let username = tools.getCookie('username');
    tools.noUser(username);
    tools.titleValue('我的信息');
    tools.headValue(username + '的信息-' + project_name);

    // 绑定事件
    const backList = document.querySelectorAll('.back');
    // 设置返回按钮
    events.goBack(backList);

    // 初始化页面数据
    let phone = tools.getCookie('phone');
    let email = tools.getCookie('email');
    let desc = tools.getCookie('desc');
    let department = tools.getCookie('department');

    const userDom = document.getElementById('username');
    const phoneDom = document.getElementById('phone');
    const emailDom = document.getElementById('email');
    const descDom = document.getElementById('desc');
    const descTit = document.querySelectorAll('.myMes .changeMes')[3].querySelector('span');
    const departmentDom = document.getElementById('department');
    const logout = document.querySelector('.logout');
    const departmentLi = document.querySelectorAll('.myMes .changeMes')[4]

    userDom.value = username;
    phoneDom.value = phone;
    emailDom.value = email;
    descDom.value = desc;
    departmentDom.value = department;

    tools.runUserFunc(userData, () => {
        // 管理员
        descTit.innerHTML = '邮箱密码';
        descDom.setAttribute('placeholder', '请填写QQ邮箱授权码');
        descDom.setAttribute('type', 'password');

        departmentLi.style.display = 'none';
    });

    // 保存数据
    document.querySelector('.save').addEventListener('click', () => {
        // 校验
        if (phoneDom.value && emailDom.value) {
            if (!tools.isMobile(phoneDom.value)) {
                phoneDom.parentNode.className += ' wrong';
                return false;
            }
            if (!tools.isEmail(emailDom.value)) {
                emailDom.parentNode.className += ' wrong';
                return false;
            }
            // 判断是否修改
            if (phoneDom.value == phone && emailDom.value == email && descDom.value == desc) {
                err.errMesShow('请修改信息后再保存');
            }
            let userData = {
                'name': userDom.value,
                'update': {
                    'phone': phoneDom.value,
                    'email': emailDom.value,
                    'desc': descDom.value
                }
            }
            //校验成功
            ajaxTool.updateUser(userData, (req) => {
                //修改cookie中的值
                tools.setCookie('phone', phoneDom.value, save_day);
                tools.setCookie('email', emailDom.value, save_day);
                tools.setCookie('desc', descDom.value, save_day);
            });
        }
    });

    phoneDom.addEventListener('focus', () => {
        phoneDom.parentNode.className = 'changeMes';

    });
    emailDom.addEventListener('focus', () => {
        emailDom.parentNode.className = 'changeMes';
    });

    logout.addEventListener('click', () => {
        tools.delCookie('username');
        tools.delCookie('phone');
        tools.delCookie('email');
        tools.delCookie('desc');
        tools.delCookie('department');
        tools.delCookie('initiate');
        tools.delCookie('level');
        window.location.href = '/login.html';
    });
})()