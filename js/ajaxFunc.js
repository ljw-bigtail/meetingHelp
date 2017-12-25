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
    //上传会议附件图片
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
    //获取人员信息
    getUserList: function (callback) {
        fetch(Url + "/api/getUserList", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    //获取会议室信息
    getRoomList: function (callback) {
        fetch(Url + "/api/getRoomList", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    //新建会议信息
    addMeet: function (meetData, callback) {
        fetch(Url + "/api/addMeet", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(meetData)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    //新建会议信息
    findRoom: function (meetData, callback) {
        fetch(Url + "/api/getRoomByAttr", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(meetData)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    
}