# 会议助手

为了方便大家对相关会议进行记录与操作等。

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

······

### 会议管理员功能

1. 邮件提醒签到
2. 公共会议纪要编辑
3. 取消会议

······

### 管理员功能

1. 会议室管理、会议室信息修改
2. 会议管理
3. 公共会议纪要管理
4. 月度会议趋势图

······

## 文件说明

| 文件名 | 文件说明 |
|---|--- |
| profile.js | 方便管理项目相关信息与项目中可能会使用的部分数据 |
| uploads | 后台生成的文件储存位置 |
| BACKUP | 数据库备份 |
| app | 后台程序位置 |

## 待增加的功能

1. 部门表（department）相关还未确定

2. 新增会议时需要时间约束，按小时、会议室分开会议室占用状态，点击翻页（下一周），点击空白格可以选取对应时间，点击有色格展示占用人信息（杨璐在做）

> 不等2了，这边先设定好格式即可：2018-01-10&10
> &后面的10作为第十个半点即为 13:00~13:30

3. 还需要计算会议室预定信息，后台暂未提供对应的信息和接口（ing）

## 需要修改的BUG

1. 优化接口返回的值（ing···）
2. 上传的文件不确定路径是否正确填写在保存按钮里的值（待测试）

3. llqrcode.js不知道这个是什么原理，没找到教程
