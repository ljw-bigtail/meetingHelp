(function () {
    const err = new Err(errMes);

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
    const departmentDom = document.getElementById('department');
    const logout = document.querySelector('.logout');

    userDom.value = username;
    phoneDom.value = phone;
    emailDom.value = email;
    descDom.value = desc;
    departmentDom.value = department;

    // 保存数据
    document.querySelector('.save').addEventListener('click', () => {
        // 校验
        if (phoneDom.value && emailDom.value) {
            if (!tools.isMobile(phoneDom.value)) {
                phoneDom.parentNode.style.outline = '2px dashed red';
                return false;
            }
            if (!tools.isEmail(emailDom.value)) {
                emailDom.parentNode.style.outline = '2px dashed red';
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
                tools.setCookie('phone', phoneDom.value, saveDay);
                tools.setCookie('email', emailDom.value, saveDay);
                tools.setCookie('desc', descDom.value, saveDay);
            });
        }
    });

    phoneDom.addEventListener('focus', () => {
        phoneDom.parentNode.style.outline = '0px';
    });
    emailDom.addEventListener('focus', () => {
        emailDom.parentNode.style.outline = '0px';
    });

    logout.addEventListener('click', () => {
        tools.delCookie('username');
        tools.delCookie('phone');
        tools.delCookie('email');
        window.location.href = '/login.html';
    });
})()