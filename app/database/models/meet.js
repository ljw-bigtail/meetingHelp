/**
 * 用户表
 */
let mongoose = require('../db'),
	Schema = mongoose.Schema;

let meetSchema = new Schema({
	"mName": {
		unique: true,
		type: String
	},
	"mDesc": {
		type: String,
	},
	"mFile": {
		type: String,
	},
	"mStartTime": {
		type: String,
	},
	"mEndTime": {
		type: String,
	},
	"rName": {
		type: String,
	},
	"mAdmin": {
		type: String,
	},
	"mPeople": {
		type: String,
	},
	// "mContainer": {
	//     type: String,
	// }, 暂不需要
	"mNote": {
		type: Number,
		default: 0
	},
	"mJoin": {
		type: Number,
		default: 0
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
meetSchema.pre('save', function (next) {
	//判断是否是新的数据对象，更新创建|更新数据的时间
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}

	next();
})


meetSchema.statics = {
	findUserFromMeet: function (val, callback) {
		this.find().exec((err, meetList) => {
			if (err) {
				console.log(err);
			} else {
				let meetData = [];
				meetList.map((data) => {
					let userData = data.mPeople.split(",");
					userData.map((user) => {
						if(user == val){
							meetData.push(data);
						}
					});
				});
				callback(meetData);
			}
		});
	},
	findMeetList: function (attr, val, callback) {
		// 先找用户相关的会议
		// 再找会议的公共纪要
		if (attr && val) {
			this.find({
				[attr]: val
			}).sort({
				"_id": -1
			}).exec((err, meetList) => {
				if (err) {
					console.log(err);
				} else {
					callback(meetList);
				}
			});
		} else {
			this.find().sort({
				"_id": -1
			}).exec((err, meetList) => {
				if (err) {
					console.log(err);
				} else {
					callback(meetList);
				}
			});
		}
	},
	findMeetByAttr: function (rName, callback) {
		this.findOne({
			'rName': rName
		}).exec((err, meet) => {
			if (err) {
				console.log(err);
			} else {
				callback(meet);
			}
		});
	},
	addMeet: function (meet, callback) {
		let newMeet = {
			"mName": meet.name || '',
			"mDesc": meet.detail || '',
			"mFile": meet.uploadImg || '',
			"mStartTime": meet.start || '',
			"mEndTime": meet.end || '',
			"rName": meet.room || '',
			"mAdmin": meet.sponsor || '',
			"mPeople": meet.joinList || '',
			"mNote": meet.canRead || '',
			"mJoin": meet.autoJoin || '',
		}

		this.create(newMeet, (err) => {
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
		});
	},
	delMeet: function (mName, callback) {
		this.remove({
			'mName': mName
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
	updateMeet: function (mName, update, callback) {
		var _this = this;
		this.findOne({
			'mName': mName
		}, function (err, oldMeet) {
			if (err) {
				callback({
					'status': "faile",
					'mes': err
				});
			} else {
				let canReset = false;
				for (let attr in update) {
					if (update[attr] == oldMeet[attr]) {
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

				let newUser = _underscore.extend(oldMeet, update);
				newUser.meta.updateAt = Date.now();

				_this.update({
					'mName': mName
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
						});
					}
				});
			}
		});
	},
}

module.exports = mongoose.model('meet', meetSchema);