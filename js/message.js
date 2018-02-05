function Message(wayOption) {
    this.wayOption = wayOption;

    this.sendMes = (data, callback) => {
        let userList = data.userList;
        let title = data.title;
        let mes = data.mes;

        let isOk = false;

        if (Array.isArray(wayOption)) {
            wayOption.map((way) => {
                if (way == 'email') {
                    console.log('正在通过邮件发送信息')
                    byMail(userList, title, mes, (req) => {
                        if (req.status.trim() == '250 Ok: queued as') {
                            isOk = true;
                        } else {
                            isOk = false;
                        }
                    });
                }
                if (way == 'app') {
                    console.log('正在通过App发送提醒')
                    byApp(userList, mes, (req) => {
                        if (req == 'success') {
                            isOk = true;
                        } else {
                            isOk = false;
                        }
                    });
                }
            });
            if (isOk) {
                callback && callback('信息发送成功');
            }
        }
    }

    // 通过邮件发信息
    let byMail = (userList, title, mes, callback) => {
        console.log(userList, title, mes)
        ajaxTool.sendMail({
            userList: userList,
            title: title,
            mes: mes
        }, (req) => {
            callback && callback(req);
        });
    }

    // 通过App发信息
    let byApp = (userList, mes, callback) => {
        console.log(userList, mes)
        callback && callback('success');
    }
}