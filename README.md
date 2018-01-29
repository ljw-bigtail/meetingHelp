# 会议助手 1.0

为了方便大家对相关会议进行记录与操作等。
1.0 算是ok了，然后规划规划后续需要添加的功能。

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

## 待增加的功能

1. 部门表（department）相关还未确定

1.	*使用者的权限划分：新增两个角色，需要修改数据库  done* ，重新划分各自功能
2.	增加定时发送邮件接口
3.	催促签到界面需要增加多选、默认全选、全选与取消全选按钮
4.	*新加成功根据不同的角色(角色可选done)* 发送不同的邮件，其中需要签到的需要发送相关链接（点击查看，或者确认参加）
5.	拆分参会人员状态统计：反馈（已反馈、未反馈）、请假（待审批、已通过、回绝）、签到（已签到、未签到）
6.	修改允许签到的角色权限
7.	提醒方法可以配置（在配置js中实现）
8.	会议纪要拆分（会议纪要（公共）、会议笔记（个人））
9.	修改会议纪要编辑方式，增加保存（需要修改数据库）、发布功能
10.	页面内查询：模糊查询（重新划分需要筛选的关键字）

## 需要修改的BUG

1. 上传的文件不确定路径是否正确填写在保存按钮里的值（待测试）
2. llqrcode.js不知道这个是什么原理，没找到教程
3. addmeet数据有误时不会回滚（后台）
4. 不连续的判断状态有问题：已选择、现在选择的需要分开判断
5. 选人列表分组Bug *done*