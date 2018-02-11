let tools = {
    // 设置cookie
    setCookie: (c_name, value, expiredays) => {
        var exdate = new Date()
        exdate.setDate(exdate.getDate() + expiredays)
        // console.log(c_name, value, exdate)
        document.cookie = c_name + "=" + escape(value) +
            ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
    },
    // 获取对应cookie
    getCookie: (c_name) => {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=")
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1
                c_end = document.cookie.indexOf(";", c_start)
                if (c_end == -1) c_end = document.cookie.length
                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return ""
    },
    // 删除对应cookie
    delCookie: (name) => {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = tools.getCookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },
    // 验证是否为身份证
    isCardNo: (card) => {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (reg.test(card) === false) {
            return false;
        } else {
            return true;
        }
    },
    // 验证是否为移动电话
    isMobile: (sMobile) => {
        var reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
        if (reg.test(sMobile) === false) {
            return false;
        } else {
            return true;
        }
    },
    // 验证是否为邮箱
    isEmail: (email) => {
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        if (reg.test(email) === false) {
            return false;
        } else {
            return true;
        }
    },
    // 获取对应的参数
    getQuery: (name) => {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var data = window.location.search.substr(1).match(reg);
        if (data != null) {
            return decodeURI(data[2]);
        }
        return null;
    },
    // 从数组中随机筛选一个
    radomData: (data) => {
        let num = Math.floor(Math.random() * data.length);
        return data[num];
    },
    // 根据条件筛选某条参数符合的数组
    filterData: (data, attr, val) => {
        var newData = [];
        data.map((d) => {
            if (d[attr] == val) {
                newData.push(d);
            }
        });
        return newData;
    },
    // 设置标题
    titleValue: (value) => {
        let title = document.querySelector('header h1.title') || document.querySelector('header');
        if (title) {
            title.innerHTML = value;
        } else {
            console.error('没有找到标题位');
        }
    },
    // 设置head的标题
    headValue: (value, leaveVal) => {
        document.title = value;
        window.onblur = function () {
            document.title = leaveVal || leave_title;
        };
        window.onfocus = function () {
            document.title = value;
        };
    },
    // 未获取到用户信息，跳转至登录
    noUser: (user) => {
        if (!user) {
            window.location.href = './login.html?isRe=true';
        }
    },
    // 通过cookie获取登录时存储的用户数据
    getUserFormCookie: () => {
        return {
            'username': tools.getCookie('username'),
            'phone': tools.getCookie('phone'),
            'email': tools.getCookie('email'),
            'desc': tools.getCookie('desc'),
            'department': tools.getCookie('department'),
            'initiate': tools.getCookie('initiate'),
            'level': tools.getCookie('level'),
        }
    },
    // 根据用户权限修改显示的按钮
    runUserFunc: (userData, callback1, callback2, callback3, callback4) => {
        let level = userData.level;
        let initiate = userData.initiate;
        level -= 0;
        initiate -= 0;
        if (level == 0) {
            // 管理员
            callback1 && callback1();
        } else if (level == 1) {
            // 用户
            callback2 && callback2();
        }
        if (initiate == 0) {
            // 可以发起会议
            callback3 && callback3();
        } else if (initiate == 1) {
            // 不可以发起会议
            callback4 && callback4();
        }
    },
    // 根据index值（第几个半点）返回时间段，从0开始
    getPeriod: (index, joiner) => {
        return work_time[index] + joiner + work_time[index + 1];
    },
    // 查询Data中是否有text
    haveTextInData: (text, Data, callback1, callback2) => {
        let reg = new RegExp(text, 'g');
        let isFind = [];
        Data.map(function (value, index) {
            if (value.match(reg)) {
                isFind.push(index)
            }
        });
        if (isFind.length == 0) {
            // 没找到
            callback1();
        } else {
            // 找到的数组           
            callback2(isFind);
        }
    },
    // 校验状态数组并返回消息
    checkState: (stateArray, mesOk, mesApp, mesEmail) => {
        let mes = mesOk;
        let len = stateArray.length;
        let count = 0;
        stateArray.map((data) => {
            count++;
            if (data.msg == 'false') {
                if (data.way == 'app') {
                    mes = mesApp;
                }
                if (data.way == 'email') {
                    mes = mesEmail;
                }
            }
            if (count >= len) {
                return mes;
            }
        });
    }
}