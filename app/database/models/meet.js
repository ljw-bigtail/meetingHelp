/**
 * 用户表
 */
let mongoose = require('../db'),
	Schema = mongoose.Schema;

let _underscore = require('underscore');

let meetSchema = new Schema({
	"mName": {
		unique: true,
		type: String
	},
	"mDesc": {
		type: String,
	},
	"mFile": {
		type: [String],
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
	"mApplicant": {
		type: String,
	},
	"mRecorder": {
		type: String,
	},
	"mPeople": {
		type: [String],
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
	"mQRcode": {
		type: String,
		unique: true
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
	getMonthData: function (callback) {
		// console.log('----------------------')
		this.find().exec((err, meetList) => {
			if (err) {
				console.log(err);
			} else {
				let meetData = [];
				let meetMonthData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
				let now = new Date();
				let currentYear = now.getFullYear();
				meetList.map((mData) => {
					let thisDate = new Date(mData.mStartTime);
					let thisYear = thisDate.getFullYear();
					let thisMonth = thisDate.getMonth();
					if (currentYear == thisYear) {
						switch (thisMonth) {
							case 0:
								meetMonthData[0] += 1;
								break;
							case 1:
								meetMonthData[1] += 1;
								break;
							case 2:
								meetMonthData[2] += 1;
								break;
							case 3:
								meetMonthData[3] += 1;
								break;
							case 4:
								meetMonthData[4] += 1;
								break;
							case 5:
								meetMonthData[5] += 1;
								break;
							case 6:
								meetMonthData[6] += 1;
								break;
							case 7:
								meetMonthData[7] += 1;
								break;
							case 8:
								meetMonthData[8] += 1;
								break;
							case 9:
								meetMonthData[9] += 1;
								break;
							case 10:
								meetMonthData[10] += 1;
								break;
							case 11:
								meetMonthData[11] += 1;
								break;
						}
					}
				});
				callback(meetMonthData);
			}
		});
	},
	findMeetFromUser: function (val, callback) {
		this.find().exec((err, meetList) => {
			if (err) {
				console.log(err);
			} else {
				let meetData = [];
				meetList.map((data) => {
					data.mPeople.map((user) => {
						if (user == val) {
							meetData.push(data);
						}
					});
					if (data.mAdmin == val) {
						meetData.push(data);
					}
					if (data.mApplicant == val) {
						meetData.push(data);
					}
					if (data.mRecorder == val) {
						meetData.push(data);
					}
				});
				callback(meetData);
			}
		});
	},
	findMeetInToday: function (callback) {
		let now = new Date();
		let nowStr = now.getFullYear() + '-' + (now.getMonth() < 9 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1) + '-' + (now.getDate() < 10 ? '0' + now.getDate() : now.getDate());
		let reg = new RegExp(nowStr);
		console.log(reg)
		this.find({
			'mStartTime': reg
		}).sort({
			"_id": -1
		}).exec((err, meetList) => {
			if (err) {
				callback(err);
			} else {
				callback(meetList);
			}
		});
	},
	findMeetList: function (user, attr, val, callback) {
		if (attr && val) {
			this.find({
				[attr]: val
			}).sort({
				"_id": -1
			}).exec((err, meetList) => {
				if (err) {
					console.log(err);
				} else {
					if (user) {
						let meetData = [];
						meetList.map((data) => {
							let userData = data.mPeople.split(",");
							userData.map((_user) => {
								if (_user == user) {
									meetData.push(data);
								}
							});
						});
						callback(meetData);
					} else {
						callback(meetList);
					}
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
	findMeetByAttr: function (attr, val, callback) {
		this.findOne({
			[attr]: val,
		}).exec((err, meet) => {
			if (err) {
				console.log(err);
				callback(err);
			} else {
				callback(meet);
			}
		});
	},
	addMeet: function (meet, callback) {
		let newMeet = {
			"mName": meet.name || '',
			"mDesc": meet.detail || '',
			"mFile": meet.uploadImg || [''],
			"mStartTime": meet.start || '',
			"mEndTime": meet.end || '',
			"rName": meet.room || '',
			"mAdmin": meet.mAdmin || '',
			"mPeople": meet.joinList || [],
			"mQRcode": meet.mQRcode || '',
			"mJoin": meet.mJoin,
			"mNote": meet.mNote,
			'mApplicant': meet.mApplicant,
			'mRecorder': meet.mRecorder
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

				let newMeet = _underscore.extend(oldMeet, update);
				newMeet.meta.updateAt = Date.now();

				_this.update({
					'mName': mName
				}, newMeet, {
					upsert: true
				}, function (error, data) {
					if (error) {
						callback({
							'status': "faile",
							'mes': '保存失败。'
						});
					} else {
						callback({
							'status': "success",
							'mes': data
						});
					}
				});
			}
		});
	},
}

module.exports = mongoose.model('meet', meetSchema);