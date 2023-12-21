module.exports = {
  config: {
    name: 'حراسة',
    aliases: ['antirobbery'],
    author: 'Allou Mohamed',
    version: '1.0.0',
    role: 1,
    category: 'الحماية',
    guide: '{pn} تشغيل أو إيقاف',
    description: 'يمنع البوت سرقة المجموعة إذا كان أدمن'
  },
  atCall: async function({ threadsData, message, args, event }) {
    if (args[0] == 'on' || args[0] == 'تشغيل') {
     await threadsData.set(event.threadID, true, 'data.antirobbery');
      message.reply('تم تشغيل الحماية بنجاح');
    } else if (args[0] == 'off' || args[0] == 'إيقاف') {
      await threadsData.set(event.threadID, false, 'data.antirobbery');
      message.reply('تم إيقاف الحماية بنجاح');

    } else {
      message.reply('يرجى تحديد (on / off) (تشغيل / إيقاف)');
    }
  },
  atEvent: async function({ threadsData, event, message, api }) {
    const threadData = await threadsData.get(event.threadID);
    const { adminIDs } = threadData;
    if (!adminIDs.includes(global.YukiBot.UID)) return;
    const threadID = event.threadID;
    const antirobbery = await threadsData.get(threadID, 'data.antirobbery');
    if (antirobbery != true || event.logMessageType != 'log:thread-admins' || event.author == global.YukiBot.UID) return;
    
    if (event.logMessageData.ADMIN_EVENT == 'remove_admin') {
   return async function () { 
      const thief = event.author;
      const goodp = event.logMessageData.TARGET_ID;
      try {
api.changeAdminStatus(threadID, goodp, true);
api.changeAdminStatus(threadID, thief, false);
        message.reply('غبي ما يعرف أن الجروب في وضع حماية من السرقة هه 🌝');
      } catch (error) {
        message.reply(error.stack);
      }
     } 
    }
    if (event.logMessageData.ADMIN_EVENT == 'add_admin') {
    return async function () { 
      const thief = event.author;
      const uid1 = event.author;
      const uid2 = event.logMessageData.TARGET_ID;
      try {
api.changeAdminStatus(threadID, uid1, false);
api.changeAdminStatus(threadID, uid2, false);
        message.reply('إحتمال ضفته تسوو علينا إنقلاب سوو شلتك أنت و هو آسف حماية شغالة 🌝');
      } catch (error) {
        message.reply(error.stack);
      }
    }
    }
  }
};