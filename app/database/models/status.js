/**
 * 用户表
 */
let mongoose = require('../db'),
    Schema = mongoose.Schema;

let _underscore = require('underscore');

let statusSchema = new Schema({
    "name": {
        type: String
    },
    "mName": {
        type: String,
    },
    "sStatus": {
        default: 2,
        type: Number
    },
    "sSign": {
        default: 1,
        type: Number
    },
    "sLeave": {
        default: 0,
        type: Number,
    },
    "sMes": {
        default: '',
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
statusSchema.pre('save', function (next) {
    //判断是否是新的数据对象，更新创建|更新数据的时间
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        this.meta.updateAt = Date.now()
    }

    next();
})


statusSchema.statics = {
    findStatusList: function (attr, val, callback) {
        if (attr && val) {
            this.find({
                [attr]: val
            }).sort({
                "_id": -1
            }).exec((err, statusList) => {
                if (err) {
                    console.log(err);
                } else {
                    callback(statusList);
                }
            });
        } else {
            this.find().sort({
                "_id": -1
            }).exec((err, statusList) => {
                if (err) {
                    console.log(err);
                } else {
                    callback(statusList);
                }
            });
        }
    },
    findStatusOne: function (option, callback) {
        this.findOne(option).exec((err, status) => {
            if (err) {
                console.log(err);
                callback({
                    'status': "faile",
                    'mes': err
                });
            } else {
                callback(status);
            }
        });
    },
    addStatus: function (option, callback) {
        let newStatus = {
            "name": option.name || '',
            "mName": option.mName || '',
            "sStatus": option.sStatus,
            "sSign": option.sSign,
            "sLeave": option.sLeave,
            "sMes": option.sMes || '',
        }
        this.create(newStatus, (err) => {
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
    delStatus: function (option, callback) {
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
    updateStatus: function (update, callback) {
        var _this = this;
        this.findOne({
            'name': update.name,
            'mName': update.mName
        }, function (err, oldStatus) {
            if (err) {
                callback({
                    'status': "faile",
                    'mes': err
                });
            } else {
                let canReset = false;
                for (let attr in update) {
                    if (update[attr] == oldStatus[attr]) {
                        canReset = false;
                    } else {
                        canReset = true;
                        break;
                    }
                }

                if (!canReset) {
                    callback({
                        'status': "faile",
                        'mes': "状态未更新。"
                    });
                    return false;
                }

                let newUser = _underscore.extend(oldStatus, update);
                newUser.meta.updateAt = Date.now();

                _this.update({
                    'name': update.name,
                    'mName': update.mName
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

module.exports = mongoose.model('status', statusSchema);