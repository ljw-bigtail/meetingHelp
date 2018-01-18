const express = require('express');
const router = express.Router();

const fs = require('fs');
const multiparty = require('multiparty');
const qr_image = require('qr-image');
const nodeMailer = require('nodemailer')

let User = require('../database/models/user');
let Department = require('../database/models/department');
let Meet = require('../database/models/meet');
let Note = require('../database/models/note');
let Room = require('../database/models/room');
let Status = require('../database/models/status');

const URL = 'D:/project/meetingHelp';


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
// 	"mJoin": 0,
// 	"mQRcode":'./'
// })
// Department.create({
// 	"dName": '会议室1',
// 	"dFather": '-1'
// })
// Status.create({
// 	"name": "6ECSwj",
// 	"mName": "123",
// 	"sMes": "",
// 	"sLeave": 0,
// 	"sSign": 1,
// 	"sStatus": 2
// })
// Note.create({
// 	"nTitle": '阿萨德阿萨的',
// 	"name": 'N5r8QC',
// 	"mName": '总结会',
// 	"nMes": '下#%*^SDVB按时打发阿萨1号SDVB按时打发阿萨1号SDVB按时打发阿萨1号:SDVB按时打发阿萨1号',
// })

//上传文件
router.post('/uploadImg', function (req, res) {
	//生成multiparty对象，并配置上传目标路径
	let form = new multiparty.Form({
		uploadDir: URL + '/uploads'
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
		let dstPath = URL + '/uploads/uploads_' + inputFile.originalFilename;
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

// 校验二维码
router.post('/checkQR', function (req, res) {
	// 拿到解析后得到的数据，在表中搜索，找到对应的状态并修改

});



// 获取账户列表
// 需要过滤数组部分值，暂未处理
router.post('/getUserList', function (req, res) {
	let attr = req.body.attr || null;
	let val = req.body.val || null;
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
	if (!req.body.rName || !req.body.rPlace || !req.body.rNum || !req.body.rDevice) {
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
	// 是否成功保存
	let sure = 0;
	// 创建二维码
	var saveData = {
		'mName': req.body.name,
		'mStartTime': req.body.start,
		'mEndTime': req.body.end,
		'mPeople': req.body.joinList.split(',')
	}
	let qr_png = qr_image.image(encodeURI(JSON.stringify(saveData)), {
		type: 'png',
		size: 6
	});
	let qr_png_url = URL + '/uploads/qr_code/uploads_' + req.body.name + '.png';
	let qr_pipe = qr_png.pipe(fs.createWriteStream(qr_png_url));
	qr_pipe.on('error', function (err) {
		res.send(200, {
			'mes': err
		});
		return false;
	})
	qr_pipe.on('finish', function () {
		// 合并新参数、，创建会议
		var meetData = req.body;
		Object.assign(meetData, {
			'mQRcode': qr_png_url
		});
		Meet.addMeet(meetData, (mes) => {
			console.log(mes)
			if (mes.status == "faile") {
				res.send(200, mes);
				return false;
			}
			// 创建参会人员状态
			req.body.joinList.split(',').map((join) => {
				Status.addStatus({
					'name': join,
					'mName': req.body.name
				}, (req) => {
					if ('status' == 'faile') {
						sure += 1;
					}
				});
			});
			if (sure == 0) {
				res.send(200, {
					'status': 'success',
					'qrCode': '/uploads/qr_code/uploads_' + req.body.name + '.png'
				});
			} else {
				res.send(200, {
					'status': 'false'
				})
			}
		});
	});
});

// 删除会议
router.post('/delMeet', function (req, res) {
	if (!req.body.mName) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	let isDel = false;
	// 删除会议
	Meet.delMeet(req.body.mName, (mes) => {
		if (mes.status == 'success') {
			isDel = true;
		} else {
			isDel = false;
		}
	})
	// 删除相关状态
	Status.delStatus({
		'mName': req.body.mName
	}, (_mes) => {
		if (_mes.status == 'success') {
			isDel = true;
		} else {
			isDel = false;
		}
	})
	// 删除二维码
	fs.unlink(URL + '/uploads/qr_code/uploads_' + req.body.mName + '.png', (err) => {
		if (err) {
			isDel = false;
		} else {
			isDel = true;
		}
		if (isDel) {
			res.send(200, {
				mes: '删除成功。'
			});
		} else {
			res.send(200, {
				mes: '删除失败。'
			});
		}
	});
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
		meetList.map((meetData) => {
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

// 获取纪要信息列表
router.post('/findNoteList', function (req, res) {
	Note.findNoteList(req.body.name, (note) => {
		if (note == null) {
			res.send(200, {
				'mes': null
			});
		} else {
			res.send(200, note);
		}
	})
});

// 获取纪要信息
router.post('/getNoteByAttr', function (req, res) {
	if (!req.body.option) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	Note.findNoteByAttr(req.body.option, (note) => {
		if (note == null) {
			res.send(200, {
				'mes': null
			});
		} else {
			res.send(200, note);
		}
	})
});

// 新建纪要 
router.post('/addNote', function (req, res) {
	if (!req.body.nTitle || !req.body.nMes || !req.body.nTitle) {
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
	// if (attr || val) {
	// 	res.send(200, {
	// 		mes: '参数不正确。'
	// 	});
	// 	return false;
	// }
	Meet.findMeetList(user, attr, val, (meetList) => {
		res.send(200, {
			'meetList': meetList
		});
	})
});


// 获取会议详情
router.post('/getMeetByAttr', function (req, res) {
	if (!req.body.attr || !req.body.val) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	Meet.findMeetByAttr(req.body.attr, req.body.val, (meet) => {
		res.send(200, meet);
	})
});

//更新纪要信息
router.post('/updateNote', function (req, res) {
	if (!req.body.nTitle || !req.body.nMes || !req.body.mName) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	Note.updateNote(req.body, (mes) => {
		res.send(200, mes);
	})
});

//更新会议信息
router.post('/updateMeet', function (req, res) {
	if (!req.body.option || !req.body.mName) {
		res.send(200, {
			'status': "faile",
			'mes': '参数错误。'
		});
		return false;
	}
	Meet.updateMeet(req.body.mName, req.body.option, (mes) => {
		res.send(200, mes);
	})
});

// 新建状态
router.post('/addStatus', function (req, res) {
	if (!req.body.name || !req.body.mName) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	Status.addStatus(req.body, (mes) => {
		res.send(200, mes);
	})
});

// 修改状态
router.post('/updateStatus', function (req, res) {
	if (!req.body.option || !req.body.option.name || !req.body.option.mName) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	Status.updateStatus(req.body.option, (mes) => {
		res.send(200, mes);
	})
});

// 查看用户+会议的状态
router.post('/getStatusByOption', function (req, res) {
	if (!req.body.option) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	Status.findStatusOne(req.body.option, (mes) => {
		res.send(200, mes);
	})
});

// 查找符合条件的用户状态列表
router.post('/getStatusList', function (req, res) {
	let attr = req.body.attr || null;
	let val = req.body.val || null;
	if (attr !== null && attr !== 'mName') {
		res.send(200, {
			mes: '仅支持通过 mName 搜索。'
		});
		return false;
	}
	Status.findStatusList(attr, val, (statusList) => {
		res.send(200, {
			'statusList': statusList
		});
	})
});

// 批量发送邮件
router.post('/sendMail', function (req, res) {
	let email = req.body.email || null;
	let title = req.body.title || null;
	let mes = req.body.mes || null;
	if (email == null || title == null || mes == null) {
		res.send(200, {
			mes: '请输入收件人邮箱、邮件标题、邮件内容。'
		});
		return false;
	}
	User.findUserByAttr('name', 'admin', (data) => {
		let transporter = nodeMailer.createTransport({
			service: 'qq',
			port: 465,
			secureConnection: true,
			auth: {
				user: data.email,
				pass: data.desc,
			}
		});
		let mailOptions = {
			from: data.email,
			to: email,
			subject: title,
			text: mes,
		};
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
				res.send(200, {
					status: error.response
				});
			} else {
				res.send(200, {
					status: info.response
				});
			}
		});
	})
});

// 获取本年月度数据
router.post('/getMonthData', function (req, res) {
	let username = req.body.username || null;
	if (username == null) {
		res.send(200, {
			mes: '请发送用户信息。'
		});
		return false;
	}
	User.findUserByAttr('name', req.body.username, (req) => {
		console.log(req)
		if (req.level !== 0) {
			res.send(200, {
				mes: '该账户没有权限。'
			});
			return false;
		}
		Meet.getMonthData((meetData) => {
			res.send(200, {
				'meetData': meetData
			});
		})
	});
});

// 修改会议室
router.post('/updateRoom', function (req, res) {
	if (!req.body.rName || !req.body.update) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	Room.updateRoom(req.body.rName, req.body.update, (mes) => {
		res.send(200, mes);
	})
});

// 删除笔记
router.post('/delNote', function (req, res) {
	if (!req.body.option) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	Note.delNote(req.body.option, (mes) => {
		res.send(200, mes);
	})
});

// 删除会议室
router.post('/delRoom', function (req, res) {
	if (!req.body.rName) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	if (req.body.level != 0) {
		res.send(200, {
			mes: '权限不够。'
		});
		return false;
	}
	Room.delRoom(req.body.rName, (mes) => {
		res.send(200, mes);
	})
});

// 把房间未来状态一起返回
router.post('/getRoomAndState', function (req, res) {
	if (!req.body.userLevel) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	let now = new Date();
	let future = new Date();
	future.setHours(now.getHours() + req.body.time);
	let resList = [];
	Room.findRoomList(null, null, (roomList) => {
		roomList.map((room) => {
			let futureNum = 0;
			// 获取会议室中的会议
			Meet.findMeetList(null, 'mRoom', room.rName, (meetList) => {
				meetList.map((meet) => {
					let myDate = new Date(meet.mStartTime);
					if (now < myDate && myDate < future) {
						futureNum++;
					}
				});
			});
			resList.push({
				'rName': room.rName,
				'rPlace': room.rPlace,
				'rNum': room.rNum,
				'rDevice': room.rDevice,
				'rStatus': room.rStatus,
				'future': futureNum,
			});
		});
		res.send(200, {
			'roomList': resList
		});
	});
});

// 计算会议室在某天的占用率
router.post('/getRoomGap', function (req, res) {
	if (!req.body.date) {
		res.send(200, {
			mes: '参数错误。'
		});
		return false;
	}
	let date = new Date(req.body.date);
	let roomMeet = [];
	let reqData = [];
	// 获取会议室中的会议，计算出一个房间对应的utilization值，根据时间来计算
	Meet.findMeetList(null, null, null, (meetList) => {
		// 根据会议室
		meetList.map((meet, index) => {
			// 先根据rName返回二维数组
			if (isIn(meet.rName, roomMeet) > -1) {
				roomMeet[isIn(meet.rName, roomMeet)].push({
					rName: meet.rName,
					meet: meet
				});
			} else {
				roomMeet.push([{
					rName: meet.rName,
					meet: meet
				}]);
			}
		});

		// 根据筛选出来的会议室--会议数组，根据时间判断对应的index中有多长时间
		for (let i = 0; i < roomMeet.length; i++) {
			reqData.push({
				'rName': roomMeet[i][0].rName,
				'utilization': '',
			})
			for (let j = 0; j < roomMeet[i].length; j++) {
				let start = new Date(roomMeet[i][j].meet.mStartTime);
				let end = new Date(roomMeet[i][j].meet.mEndTime);
				if (start.getFullYear() == date.getFullYear() && start.getMonth() == date.getMonth() && start.getDate() == date.getDate()) {
					reqData[i].utilization += roomMeet[i][j].meet.mStartTime + '&';
					reqData[i].utilization += roomMeet[i][j].meet.mEndTime + '&';
				}
			}
		}
		res.send(200, {
			'reqData': reqData
		});
	});

	function isIn(rName, list) {
		var state = -1;
		list.map((data, index) => {
			if (rName == data[0].rName) {
				state = index;
			}
		});
		return state;
	}
});

module.exports = router;