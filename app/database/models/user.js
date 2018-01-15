/**
 * 用户表
 */
let mongoose = require('../db'),
	Schema = mongoose.Schema;

let _underscore = require('underscore');

let bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

let userSchema = new Schema({
	"name": {
		unique: true,
		type: String
	},
	"password": {
		type: String,
		default: "111111"
	},
	"email": {
		unique: true,
		type: String,
	},
	"phone": {
		unique: true,
		type: String,
	},
	"desc": {
		type: String,
		default: ""
	},
	"level": {
		type: Number,
		default: "1"
	},
	"dName": {
		type: String,
		default: ""
	},
	"initiate": {
		type: Number,
		default: "1"
	},
	"meta": {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
});

//每次创建都会调用这个方法
userSchema.pre('save', function (next) {
	var user = this;

	//判断是否是新的数据对象，更新创建|更新数据的时间
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}

	//加盐
	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
		if (err) {
			return next(err);
		}
		bcrypt.hash(user.password, salt, function (err, hash) {
			if (err) {
				return next(err);
			}
			user.password = hash;
			next();
		})
	})
})


userSchema.statics = {
	findUserList: function (attr, val, callback) {
		if (attr && val) {
			this.find({
				[attr]: val,
				"level": 1
			}).sort({
				"_id": -1
			}).exec((err, userList) => {
				if (err) {
					console.log(err);
				} else {
					callback(userList);
				}
			});
		} else {
			this.find({
				"level": 1
			}).sort({
				"_id": -1
			}).exec((err, userList) => {
				if (err) {
					console.log(err);
				} else {
					callback(userList);
				}
			});
		}
	},
	findUserByAttr: function (attr, val, callback) {
		this.findOne({
			[attr]: val
		}).exec((err, user) => {
			if (err) {
				console.log(err);
				callback('faile');				
			} else {
				// callback(user);
				callback({
					'name':user.name,
					'email':user.email,
					'phone':user.phone,
					'desc':user.desc,
					'dName':user.dName,
					'level':user.level,
				});
			}
		});
	},
	addUser: function (user, callback) {
		let newUser = {
			"name": user.name || '',
			"email": user.email || '',
			"phone": user.phone || '',
			"password": user.password || '',
			"desc": user.desc || '',
			"dName": user.dName || '',
		}

		this.create(newUser, (err) => {
			if (err) {
				callback({
					'status': "faile",
					'mes': err
				});
			} else {
				callback({
					'status': "success",
				});
			}
		})
	},
	delUser: function (name, callback) {
		this.remove({
			'name': name
		}, function (err) {
			if (err) {
				callback({
					'status': "faile",
					'mes': err
				});
			} else {
				callback({
					'status': "success",
				});
			}
		})
	},
	updateUser: function (name, update, callback) {
		var _this = this;
		this.findOne({
			'name': name
		}, function (err, oldUser) {
			if (err) {
				callback({
					'status': "faile",
					'mes': err
				});
			} else {
				let canReset = false;
				for (let attr in update) {
					if (update[attr] == oldUser[attr]) {
						canReset = false;
					} else {
						canReset = true;
						break;
					}
				}

				if (!canReset) {
					callback({
						'status': "faile",
						'mes': "信息重复。"
					});
					return false;
				}

				let newUser = _underscore.extend(oldUser, update);
				newUser.meta.updateAt = Date.now();

				_this.update({
					'name': name
				}, newUser, {
					upsert: true
				}, function (error) {
					if (err) {
						callback({
							'status': "faile",
							'mes': err
						});
					} else {
						callback({
							'status': "success",
							'userMes': newUser
						});
					}
				});
			}
		});
	},
	checkpassword: function (attr, val, password, callback) {
		var _this = this;
		this.findOne({
			[attr]: val
		}, function (err, oldUser) {
			if (err) {
				callback({
					'status': "faile",
					'mes': err
				});
			} else {
				if (oldUser == null) {
					callback({
						'status': "faile",
						'mes': '账号错误'
					});
				} else {
					bcrypt.compare(password, oldUser.password, function (err, isMatch) {
						if (err) {
							callback({
								'status': "faile",
								'mes': '校验失败'
							});
						} else {
							if (isMatch) {
								callback({
									'status': "success",
									'mes': '密码正确',
									'userMes': {
										'dName': oldUser.dName,
										'desc': oldUser.desc,
										'email': oldUser.email,
										'initiate': oldUser.initiate,
										'level': oldUser.level,
										'name': oldUser.name,
										'phone': oldUser.phone
									}
								});
							} else {
								callback({
									'status': "faile",
									'mes': '密码错误'
								});
							}
						}
					})
				}
			}
		})
	}
}

module.exports = mongoose.model('user', userSchema);