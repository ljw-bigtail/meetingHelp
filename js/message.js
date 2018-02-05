function Message(dom, time) {
    // 发送消息提示
    this.sendMail = (email, title, mes) => {
        ajaxTool.sendMail({
            email: email,
            title: title,
            mes: mes
        }, (req) => {
            if (req.status.trim() == '250 Ok: queued as') {
                err.errMesShow('正在通过邮件提醒参会人员。');
                return false;
            }
            err.errMesShow(req.status);
        });
    }
}