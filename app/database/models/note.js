/**
 * 用户表
 */
let mongoose = require('../db'),
	Schema = mongoose.Schema;

let _underscore = require('underscore');

let noteSchema = new Schema({
	"nTitle": {
		unique: true,
		type: String
	},
	"name": {
		type: String
	},
	"mName": {
		type: String
	},
	"nMes": {
		type: String
	},
	"isPush": {
		type: Boolean
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
noteSchema.pre('save', function (next) {
	//判断是否是新的数据对象，更新创建|更新数据的时间
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now()
	} else {
		this.meta.updateAt = Date.now()
	}

	next();
})


noteSchema.statics = {
	findNoteByCondition: function (condition, callback) {
		this.find({
			$or: condition
		}).sort({
			"_id": -1
		}).exec((err, note) => {
			if (err) {
				console.log(err);
			} else {
				callback(note);
			}
		});
	},
	findNoteList: function (name, callback) {
		// console.log("查询："+name)
		this.find({
			'name': name
		}).sort({
			"_id": -1
		}).exec((err, noteList) => {
			if (err) {
				console.log(err);
			} else {
				callback(noteList);
			}
		});
	},
	findNoteByAttr: function (option, callback) {
		this.findOne(option).exec((err, note) => {
			if (err) {
				console.log(err);
			} else {
				callback(note);
			}
		});
	},
	addNote: function (note, callback) {
		let newNote = {
			"nTitle": note.nTitle || '',
			"name": note.name || '',
			"mName": note.mName || '',
			"nMes": note.nMes || '',
			"isPush": note.isPush || '',
		}
		this.create(newNote, (err) => {
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
	delNote: function (option, callback) {
		this.remove(option, function (err) {
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
	updateNote: function (nTitle, update, callback) {
		var _this = this;
		this.findOne({
			'nTitle': nTitle,
		}, function (err, oldNote) {
			if (err) {
				callback({
					'status': "faile",
					'mes': err
				});
			} else {
				let canReset = false;
				for (let attr in update) {
					if (update[attr] == oldNote[attr]) {
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

				let newNote = _underscore.extend(oldNote, update);
				newNote.meta.updateAt = Date.now();

				_this.update({
					'nTitle': nTitle,
				}, newNote, {
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

module.exports = mongoose.model('note', noteSchema);