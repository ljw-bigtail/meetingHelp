# 会议助手 1.0

为了方便大家对相关会议进行记录与操作等。

1.1 在做优化性的功能，最重要的是后续整理代码。

## 功能

- 上传文件
- 二维码签到
- 多选、单选、抽屉、开关等按钮
- ···

### 用户功能

1. 新建会议
2. 会议室查看
3. 扫码签到
4. 会议纪要查看、编辑
5. 会议详情查看
6. 签到
7. 请假
8. 参会统计
9. 个人设置
10. 登录、注销
11. 搜索
12. ······

### 会议管理员功能

1. 邮件提醒签到
2. 公共会议纪要编辑
3. 取消会议
4. ······

### 管理员功能

1. 会议室管理、会议室信息修改
2. 会议管理
3. 公共会议纪要管理
4. 月度会议趋势图
5. 新建用户
6. ······

## 文件说明

| 文件名 | 文件说明 |
|---|--- |
| profile.js | 方便管理项目相关信息与项目中可能会使用的部分数据 |
| uploads | 后台生成的文件储存位置 |
| BACKUP | 数据库备份 |
| app | 后台程序位置 |
| message.js | 可复用的消息使用中心 |
| err.js | 可复用的页面错误信息提示 |

## 待增加的功能

1. 部门表（department）相关还未确定
2. 增加定时发送邮件接口
3. llqrcode.js不知道这个是什么原理，没找到教程

## 需要修改的BUG

1. addmeet数据有误时不会回滚（后台）