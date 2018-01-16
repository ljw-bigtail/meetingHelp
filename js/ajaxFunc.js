let ajaxTool = {
    // 校验账户
    checkUser: function (req, callback) {
        fetch(server_url + "/api/checkPassword", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
            })
            .then(response => response.json())
            .then(data => {
                callback(data);
            })
            .catch(e => console.log("sendAjax报错信息：", e))
    },
    //更新用户具体信息
    updateUser: function (req, callback) {
        fetch(server_url + "/api/updateUser", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    //上传会议附件图片
    uploadImg: function (reqFile, callback) {
        // 模拟form表单上传时的数据结构
        let imgData = new FormData();
        imgData.append('file', reqFile.files[0]);

        fetch(server_url + "/api/uploadImg", {
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
        fetch(server_url + "/api/getUserList", {
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
        fetch(server_url + "/api/getRoomList", {
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
        fetch(server_url + "/api/addMeet", {
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
    //查询会议室信息
    findRoom: function (roomData, callback) {
        fetch(server_url + "/api/getRoomByAttr", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(roomData)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    //获取纪要列表
    getwriteList: function (user, callback) {
        fetch(server_url + "/api/getwriteList", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    //查询纪要信息
    findNote: function (noteOption, callback) {
        fetch(server_url + "/api/getNoteByAttr", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(noteOption)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    //更新纪要信息
    updateNote: function (req, callback) {
        fetch(server_url + "/api/updateNote", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    //获取会议列表
    findNoteList: function (req, callback) {
        fetch(server_url + "/api/findNoteList", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    //获取会议列表
    getMeetList: function (req, callback) {
        fetch(server_url + "/api/getMeetList", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    //查询会议信息
    findMeet: function (meetData, callback) {
        fetch(server_url + "/api/getMeetByAttr", {
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
    //查询用户信息
    findUser: function (user, callback) {
        fetch(server_url + "/api/getUserByAttr", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    //新建纪要信息
    addNote: function (noteData, callback) {
        fetch(server_url + "/api/addNote", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(noteData)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    //新建状态信息
    addStatus: function (statusData, callback) {
        fetch(server_url + "/api/addStatus", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(statusData)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    //更新状态信息
    updateStatus: function (req, callback) {
        fetch(server_url + "/api/updateStatus", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    //更新状态信息
    getStatusByOption: function (req, callback) {
        fetch(server_url + "/api/getStatusByOption", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    //根据条件查找对应人员的状态列表
    getStatusList: function (req, callback) {
        fetch(server_url + "/api/getStatusList", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    // 发送邮件
    sendMail: function (req, callback) {
        fetch(server_url + "/api/sendMail", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    // 校验二维码
    checkQR: function (req, callback) {
        fetch(server_url + "/api/checkQR", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    getMonthData: function (req, callback) {
        fetch(server_url + "/api/getMonthData", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    //更新会议室具体信息
    updateRoom: function (req, callback) {
        fetch(server_url + "/api/updateRoom", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    // 新建会议室
    addRoom: function (req, callback) {
        fetch(server_url + "/api/addRoom", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    // 删除note
    delNote: function (req, callback) {
        fetch(server_url + "/api/delNote", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    // 删除会议室
    delRoom: function (req, callback) {
        fetch(server_url + "/api/delRoom", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    // 取消会议
    delMeet: function (req, callback) {
        fetch(server_url + "/api/delMeet", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    // 获取会议室未来状态
    getRoomAndState: function (option, callback) {
        fetch(server_url + "/api/getRoomAndState", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(option)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
    // 获取会议室在某天的占用率
    getRoomGap: function (option, callback) {
        fetch(server_url + "/api/getRoomGap", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(option)
            })
            .then(response => response.json())
            .then(data => {
                callback(data)
            })
            .catch(e => console.log("报错信息：", e))
    },
}