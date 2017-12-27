var express = require('express');
var router = express.Router();

var fs = require('fs');
var express = require('express');
var multiparty = require('multiparty');

var User = require('../database/models/user');
var Department = require('../database/models/department');
var Meet = require('../database/models/meet');
var Note = require('../database/models/note');
var Room = require('../database/models/room');
var Status = require('../database/models/status');

//初始化数据
// User.create({
// 	"name": 'admin',
// 	"email": '747624075@qq.com',
// 	"phone": '17609234866',
// 	"password": '111111',
// 	"level": 0
// })
// Room.create({
// 	"rName": '会议室1',
// 	"rPlace": '1号',
// 	"rNum": 100,
// 	"rDevice": ['电脑', '投影仪']
// })
// Meet.create({
// 	"mName": '总结会',
// 	"mDesc": '总结一下按时打发阿萨德阿萨德',
// 	"mFile": '',
// 	"mStartTime": '2017/12/24 12:00:00',
// 	"mEndTime": '2017/12/24 14:00:00',
// 	"rName": '会议室1',
// 	"mAdmin": 'Wi7fF5',
// 	"mPeople": ["N5r8QC", "rAzTar"],
// 	"mNote": 0,
// 	"mJoin": 0
// })
// Department.create({
// 	"dName": '会议室1',
// 	"dFather": '-1'
// })
// Status.create({
// 	"name": 'N5r8QC',
// 	"mName": '总结会',
// 	"sStatus": 2,
// 	"sSign": 1,
// 	"sLeave": 0,
// })
// Note.create({
// 	"nTitle": '阿萨德阿萨的',
// 	"name": 'N5r8QC',
// 	"mName": '总结会',
// 	"nMes": '下#%*^SDVB按时打发阿萨1号SDVB按时打发阿萨1号SDVB按时打发阿萨1号:SDVB按时打发阿萨1号',
// })

//上传文件
router.post('/uploadImg', function (req, res) {
	var URL = 'D:/project/meetingHelp/uploads';
	//生成multiparty对象，并配置上传目标路径
	let form = new multiparty.Form({
		uploadDir: URL
	});
	//上传完成后处理
	form.parse(req, function (err, fields, files) {
		// console.log(err, fields, files);
		if (err) {
			console.log(err);
			return false;
		}
		//改写文件名称
		let inputFile = files.file[0];
		let uploadedPath = inputFile.path;
		let dstPath = URL + '/uploads_' + inputFile.originalFilename;
		fs.rename(uploadedPath, dstPath, (err) => {
			if (err) {
				console.log('rename error: ' + err);
			} else {
				// files.file.path = dstPath;
				// let data = files;
				res.send(200, {
					mes: '文件上传完成！',
					filePath: '/uploads_' + inputFile.originalFilename
				});
			}
		});

	});
});


// 获取账户列表
// 需要过滤数组部分值，暂未处理
router.post('/getUserList', function (req, res) {
	let attr = req.body.attr || null;
	let val = req.body.val || null;
	console.log(attr !== 'desc', attr !== 'dName', attr !== 'initiate')
	if (attr !== 'desc' && attr !== 'dName' && attr !== 'initiate' && attr !== null) {
		res.send(200, {
			mes: '仅支持通过 desc/dName/initiate 搜索。'
		});
		return false;
	}
	User.findUserList(attr, val, (userList) => {
		res.send(200, {
			'userList': userList
		});
	})
});

// 获取账户信息
router.post('/getUserByAttr', function (req, res) {
	if (!req.body.attr || !req.body.val) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	User.findUserByAttr(req.body.attr, req.body.val, (user) => {
		res.send(200, user);
	})
});

// 新建账户
router.post('/addUser', function (req, res) {
	if (!req.body.name || !req.body.email || !req.body.phone || !req.body.password) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	User.addUser(req.body, (mes) => {
		res.send(200, mes);
	})
});

// 删除账户
router.post('/delUser', function (req, res) {
	if (!req.body.name) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	User.delUser(req.body.name, (mes) => {
		res.send(200, mes);
	})
});

// 修改账户
router.post('/updateUser', function (req, res) {
	if (!req.body.name || !req.body.update) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	User.updateUser(req.body.name, req.body.update, (mes) => {
		res.send(200, mes);
	})
});

// 校验密码
router.post('/checkPassword', function (req, res) {
	if (req.body.type !== 'name' && req.body.type !== 'email') {
		res.send(200, {
			mes: '仅支持通过 name/email 登录。'
		});
		return false;
	}
	if (!req.body.val || !req.body.password) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	User.checkpassword(req.body.type, req.body.val, req.body.password, (mes) => {
		res.send(200, mes);
	})
});

//新增房间，管理员权限
router.post('/addRoom', function (req, res) {
	if (!req.body.name || !req.body.email || !req.body.phone || !req.body.password) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	Room.addRoom(req.body, (mes) => {
		res.send(200, mes);
	})
});

// 新建会议
router.post('/addMeet', function (req, res) {
	if (!req.body.name || !req.body.detail || !req.body.start || !req.body.end || !req.body.room || !req.body.sponsor || !req.body.joinList) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	Meet.addMeet(req.body, (mes) => {
		res.send(200, mes);
	})
});

// 获取会议室列表
// 需要过滤数组部分值，暂未处理
router.post('/getRoomList', function (req, res) {
	let attr = req.body.attr || null;
	let val = req.body.val || null;
	if (attr && attr !== 'rDevice') {
		res.send(200, {
			mes: '仅支持通过 rDevice 搜索。'
		});
		return false;
	}
	Room.findRoomList(attr, val, (roomList) => {
		res.send(200, {
			'roomList': roomList
		});
	})
});

// 获取会议室信息
router.post('/getRoomByAttr', function (req, res) {
	if (!req.body.attr || !req.body.val) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	Room.findRoomByAttr(req.body.attr, req.body.val, (user) => {
		res.send(200, user);
	})
});

// 获取会议室列表
router.post('/getwriteList', function (req, res) {
	let user = req.body.user || null;
	// 先找用户相关的会议
	Meet.findMeetFromUser(user, (meetList) => {
		// 用户参与的会议
		var condition = [];
		meetList.map((meetData)=>{
			condition.push({
				'mName': meetData.mName,
				'name': ''
			})
		});
		condition.push({
			'name': user
		});
		Note.findNoteByCondition(condition, (writeList) => {
			res.send(200, {
				'writeList': writeList
			});
		});
	});
});

// 获取纪要信息
router.post('/getNoteByAttr', function (req, res) {
	if (!req.body.attr || !req.body.val) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	Note.findNoteByAttr(req.body.attr, req.body.val, (note) => {
		res.send(200, note);
	})
});

// 新建纪要 
router.post('/addNote', function (req, res) {
	if (!req.body.nTitle || !req.body.nMes || !req.body.nTitle || !req.body.name) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	Note.addNote(req.body, (mes) => {
		res.send(200, mes);
	})
});

// 修改纪要
router.post('/updateNote', function (req, res) {
	if (!req.body.nTitle || !req.body.nMes || !req.body.nTitle) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	Note.updateNote(req.body.nTitle, req.body, (mes) => {
		res.send(200, mes);
	})
});

// 获取会议室列表
// 需要过滤数组部分值，暂未处理
router.post('/getMeetList', function (req, res) {
	let attr = req.body.attr || null;
	let val = req.body.val || null;
	let user = req.body.user || null;
	if (attr !== null && attr !== 'mAdmin') {
		res.send(200, {
			mes: '仅支持通过 mAdmin 搜索。'
		});
		return false;
	}
	Meet.findMeetList(user, attr, val, (meetList) => {
		res.send(200, {
			'meetList': meetList
		});
	})
});


module.exports = router;