const fs = require('fs');

module.exports = {
  config: {
    name: 'الحماية_القصوة',
    author: 'Allou Mohamed',
    version: '1.0.0',
    role: 0,
    category: 'خاص جدا',
    guide: '{pn}',
    description: 'هذا الأمر صمم خصيصا لمجموعة يوكي يحميها من السرقة بأقصى إعدادات api المسنجر'
  },
  atCall: async function({ message, threadsData }) {
    message.reply('هذا الأمر يعمل في مجموعة المطور فقط 🌝');
  },
  atEvent: async function({ event, message, threadsData, api }) {
      if (event.threadID != '24264995336433185') return;
    	if (event.logMessageType == 'log:unsubscribe') {
        if (event.logMessageData.leftParticipantFbId == '100049189713406') {
          const threadData = await threadsData.get('24264995336433185');
          if (threadData.adminIDs.includes(global.YukiBot.UID)) {
            if (event.author != '100049189713406') {
              api.removeUserFromGroup(event.author, '24264995336433185');
api.addUserToGroup('100049189713406', '24264995336433185');
await api.changeAdminStatus('100049189713406', '24264995336433185', true);
            }
          }
        }
      }
    }
};