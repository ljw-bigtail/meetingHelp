/**
 * 用户表
 */
let mongoose = require('../db'),
    Schema = mongoose.Schema;

let departmentSchema = new Schema({
    "dName": {
        unique: true,
        type: String
    },
    "dFather": {
        type: String,
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
departmentSchema.pre('save', function (next) {
    //判断是否是新的数据对象，更新创建|更新数据的时间
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else {
        this.meta.updateAt = Date.now()
    }

    next();
})


departmentSchema.statics = {
    findDepList: function (attr, val, callback) {
        if(attr && val){
            this.find({
                [attr]: val
            }).sort({
                "_id": -1
            }).exec((err, depList) => {
                if (err) {
                    console.log(err);
                } else {
                    callback(depList);
                }
            });
        }else{
            this.find().sort({
                "_id": -1
            }).exec((err, depList) => {
                if (err) {
                    console.log(err);
                } else {
                    callback(depList);
                }
            });
        }
	},
	findDepByAttr: function (dName, callback) {
		this.findOne({
			'dName': dName
		}).exec((err, dep) => {
			if (err) {
				console.log(err);
			} else {
				callback(dep);
			}
		});
	},
	addDep: function (dep, callback) {
		let newDep = {
			"dName": dep.dName || '',
			"dFather": dep.dFather || '',
		}
    
		this.create(newDep, (err) => {
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
	delDep: function (mName, callback) {
		this.remove({
			'dName': dName
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
	updateDep: function (mName, update, callback) {
		var _this = this;
		this.findOne({ 'dName': dName }, function (err, oldDep) {
			if (err) {
				callback({
					'status': "faile",
					'mes': err
				});
			} else {
				let canReset = false;
				for (let attr in update) {
					if (update[attr] == oldDep[attr]) {
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

				let newUser = _underscore.extend(oldDep, update);
				newUser.meta.updateAt = Date.now();

				_this.update({ 'dName': dName }, newUser, { upsert: true }, function (error) {
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

module.exports = mongoose.model('department', departmentSchema);