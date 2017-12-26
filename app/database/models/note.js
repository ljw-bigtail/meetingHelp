/**
 * 用户表
 */
let mongoose = require('../db'),
    Schema = mongoose.Schema; 
    
let noteSchema = new Schema({
    "nTitle": {
        unique: true,
        type: String
    },
    "name": {
        unique: true,
        type: String
    },
    "mName": {
        unique: true,
        type: String,
    },
    "nMes": {
        unique: true,
        type: String
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
    }
    else {
        this.meta.updateAt = Date.now()
    }

    next();
})


noteSchema.statics = {
    findNoteList: function (attr, val, callback) {
        if(attr && val){
            this.find({
                [attr]: val
            }).sort({
                "_id": -1
            }).exec((err, noteList) => {
                if (err) {
                    console.log(err);
                } else {
                    callback(noteList);
                }
            });
        }else{
            this.find().sort({
                "_id": -1
            }).exec((err, noteList) => {
                if (err) {
                    console.log(err);
                } else {
                    callback(noteList);
                }
            });
        }
	},
	findNoteByAttr: function (attr, val, callback) {
		this.findOne({
            [attr]: val
		}).exec((err, note) => {
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
	delNote: function (mName, callback) {
		this.remove({
			'nTitle': nTitle,
			'name': name,
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
	updateNote: function (mName, update, callback) {
		var _this = this;
		this.findOne({
            'nTitle': nTitle,
			'name': name,
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

				let newUser = _underscore.extend(oldNote, update);
				newUser.meta.updateAt = Date.now();

				_this.update({
                    'nTitle': nTitle,
                    'name': name,
                }, newUser, { upsert: true }, function (error) {
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