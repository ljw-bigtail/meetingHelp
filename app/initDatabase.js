let User = require('./database/models/user');

//初始化数据
User.findUserByAttr("name", 'admin', (data) => {
    if (data.name != 'admin') {
        console.log('数据库初始化中。')
        User.create({
            "name": 'admin',
            "email": '747624075@qq.com',
            "phone": '17609234866',
            "password": '111111',
            "level": 0
        });
    }else{
        console.log('数据库已经初始化。')        
    }
});