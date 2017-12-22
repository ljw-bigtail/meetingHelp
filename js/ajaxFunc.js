const Url = 'http://192.168.199.206:3000';

let ajaxTool = {
    // 校验账户
    checkUser: function (res, callback) {
        fetch(Url + "/api/checkPassword", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(res)
            })
            .then(response => response.json())
            .then(data => {
                callback(data);
            })
            .catch(e => console.log("sendAjax报错信息：", e))
    },
    //更新用户具体信息
    updateUser: function (res, callback) {
        fetch(Url + "/api/updateUser", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(res)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    //更新用户具体信息
    uploadImg: function (resFile, callback) {
        // 模拟form表单上传时的数据结构
        let imgData = new FormData();
        imgData.append('file', resFile.files[0]);
        
        fetch(Url + "/api/uploadImg", {
                method: "POST",
                body: imgData
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
}