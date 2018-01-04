/**
 * 用户表
 */
let mongoose = require('../db'),
	Schema = mongoose.Schema;

let _underscore = require('underscore');

let roomSchema = new Schema({
	"rName": {
		unique: true,
		type: String
	},
	"rPlace": {
		type: String,
	},
	"rNum": {
		type: Number,
	},
	"rDevice": {
		type: String,
	},
	"rStatus": {
		default: 1,
		type: Number,
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
roomSchema.pre('save', function (next) {
	//判断是否是新的数据对象，更新创建|更新数据的时间
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}

	next();
})

roomSchema.statics = {
	findRoomList: function (attr, val, callback) {
		if (attr && val) {
			this.find({
				[attr]: val
			}).sort({
				"_id": -1
			}).exec((err, roomList) => {
				if (err) {
					console.log(err);
				} else {
					callback(roomList);
				}
			});
		} else {
			this.find().sort({
				"_id": -1
			}).exec((err, roomList) => {
				if (err) {
					console.log(err);
				} else {
					callback(roomList);
				}
			});
		}
	},
	findRoomByAttr: function (attr, val, callback) {
		this.findOne({
			[attr]: val
		}).exec((err, room) => {
			if (err) {
				console.log(err);
			} else {
				callback(room);
			}
		});
	},
	addRoom: function (room, callback) {
		let newRoom = {
			"rName": room.rName || '',
			"rPlace": room.rPlace || '',
			"rNum": room.rNum || '',
			"rDevice": room.rDevice || '',
		}

		this.create(newRoom, (err) => {
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
	delRoom: function (rName, callback) {
		this.remove({
			'rName': rName
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
	updateRoom: function (rName, update, callback) {
		var _this = this;
		this.findOne({
			'rName': rName
		}, function (err, oldRoom) {
			if (err) {
				callback({
					'status': "faile",
					'mes': err
				});
			} else {
				let canReset = false;
				for (let attr in update) {
					if (update[attr] == oldRoom[attr]) {
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

				let newUser = _underscore.extend(oldRoom, update);
				newUser.meta.updateAt = Date.now();

				_this.update({
					'rName': rName
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

module.exports = mongoose.model('room', roomSchema);