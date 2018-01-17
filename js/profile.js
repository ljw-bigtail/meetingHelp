// 应用名称
const project_name = '会议助手';

// 服务器地址
const server_url = 'http://192.168.199.206:3000';

// 用户头像背景色数组
const user_avatar_data = ['#F76B8A', '#028090', '#02C39A', '#EC9454', '#849561'];

// 离开页面时需要展示的标题
const leave_title = 'i miss you';

// cookie存储时间，单位天
const save_day = 1;

// admin图标色值
// const chart_color = null;
const chart_color = '#E73E51';

// 一天内有会议的提醒背景色值
const tip_mes_image = 'radial-gradient(circle closest-corner at 92% 16%, rgb(243, 52, 52) 20%, rgba(255, 0, 0, 0) 40%, rgb(76, 79, 88) 95%)';

// 工作时间段
const work_time = [
    '08:00', '08:30',
    '09:00', '09:30',
    '10:00', '10:30',
    '11:00', '11:30',
    '12:00', '12:30',
    '13:00', '13:30',
    '14:00', '14:30',
    '15:00', '15:30',
    '16:00', '16:30',
    '17:00', '17:30',
    '18:00', '18:30',
    '19:00', '19:30',
    '20:00', '20:30',
    '21:00', '21:30'
];

// 会议室未来几小时的状态
const room_future_status = 3;

// 邮件提醒信息
const email_title = '会议签到提醒-来自会议助手';
const email_mes = '您的会议已经开始，请不要忘记参加并签到。';