function Message(wayOption) {
    this.wayOption = wayOption;

    this.sendMes = (data, callback) => {
        let userList = data.userList;
        let title = data.title;
        let mes = data.mes;

        if (Array.isArray(wayOption)) {
            let resultMessage = [];
            let resultCont = 0;
            wayOption.map((way) => {
                if (way == 'email') {
                    console.log('正在通过邮件发送信息')
                    byMail(userList, title, mes, (req) => {
                        resultCont++;
                        let state = req.status.trim() == '250 Ok: queued as';
                        reqMes(req, resultMessage, state, way, resultCont, wayOption.length, callback)
                    });
                }
                if (way == 'app') {
                    console.log('正在通过App发送提醒')
                    byApp(userList, mes, (req) => {
                        resultCont++;
                        let state = req == 'success';
                        reqMes(req, resultMessage, state, way, resultCont, wayOption.length, callback)
                    });
                }
            });
        }
    }

    /**
     * 根据状态返回消息
     */
    function reqMes(req, resultMessage, state, way, resultCont, len, callback) {
        if (state) {
            resultMessage.push({
                "way": way,
                "msg": "true",
                "req": req
            });
        } else {
            resultMessage.push({
                "way": way,
                "msg": "false",
                "req": req
            });
        }
        if (resultCont >= len) {
            callback && callback(resultMessage);
        }
    }

    // 通过邮件发信息
    let byMail = (userList, title, mes, callback) => {
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
        callback && callback('success');
    }
}