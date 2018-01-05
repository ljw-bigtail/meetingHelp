# 会议助手

这个是为了实现一个WebAPP，主要想实现的是方便用户对相关会议进行方便记录与管理。
 
## 功能

1. profile，方便管理项目相关信息与项目中可能会使用的部分数据

### 管理员

1. 会议室设定，暂时还没有
2. 账号分配，暂时还没有
3. 月度会议趋势图

······

### 会议管理员

1. 邮件提醒未签到的去签到

······

### 用户

1. 新建会议
2. 会议室状态
3. 会议纪要
4. 我相关的
5. 信息设置
6. 请假、确认参加
7. 新增上传二维码页面，后台增加生成二维码功能

······

## 待增加的功能

1. 新增会议时需要时间约束，按小时、会议室分开会议室占用状态，点击翻页（下一周），点击空白格可以选取对应时间，点击有色格展示占用人信息（杨璐在做）
2. newMeeting页面需要增加修改功能（修改会议状态信息）（由于1，等待）
3. 会议室预定状态暂未实现（由于1，等待）
4. 还需要计算会议室预定信息，后台暂未提供对应的信息和接口（由于1，等待）

5. 部门表（department）相关还未确定

6. initiate字段的功能
7. 管理员统计数据：根据月查看本年开的会议量（done）

## 需要修改的BUG

1. llqrcode.js不知道这个是什么原理，没找到教程
2. 新建meet后生成的二维码不确定是否成功添加（待测试）
3. 上传的文件不确定路径是否正确填写在保存按钮里的值（待测试）
4. 优化接口返回的值（ing···）
5. 撤回会议功能（删除会议、删除二维码，删除用户状态，修改会议室状态，删除会相关纪要）(next)