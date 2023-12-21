module.exports = {
  config: {
    name: 'إشعار',
    aliases: ['notification', 'noti'],
    author: 'Allou Mohamed',
    version: '1.0.0',
    role: 2,
    category: 'المطور',
    guide: '{pn} الرسالة',
    description: 'إرسال إشعار لكل المجموعات 🌝',
  },
  langs: {
    ar: {
      Noti: '📝 | رسالة من المطور:\n\n- %1\n\n📲 | رد على هذه الرسالة ليصل ردك له',
      Done: '✅ | وصلت الرسالة إلى %1 مجموعة\n📲 | البوت في إنتظار الرد',
      NeedNoti: '❎ | أدخل الرسالة !',
      FeedBack: '📲 |\n\n- %2\n\n🗿 | رد عليك %1'
    },
    en: {
      Noti: '📝 | Noti from BOT owner:\n\n-%1\n\n📲 | Reply By your FeedBack',
      Done: '✅ | Sended To %1 gc.',
      NeedNoti: '❎ | Enter the content !',
      FeedBack: '📲 |\n\n- %2\n\n🗿 | From %1'
    }
  },
  
  atCall: async function({ message, event, api, commandName, threadsData, args, getLang }) {
    const allThreadsNewArray = [];
    let sended = 0;
    if (!args[0]) return message.reply(getLang('NeedNoti'));
    
    const allThreads = await threadsData.getAll();
    for (let thread of allThreads) {
      allThreadsNewArray.push(thread.threadID);
    }
    for (const group of allThreadsNewArray) {
      const threadInfo = await threadsData.get(group);
      if (threadInfo && threadInfo.members && threadInfo.isGroup && threadInfo.threadID !== event.threadID) {
        const botMember = threadInfo.members.find((member) => member.userID === global.YukiBot.UID && member.inGroup === true);
        if (botMember) {
          try { 
    api.sendMessage(getLang('Noti', args.join(' ')), group, (err, info) => {
      global.YukiBot.atReply.set(info.messageID, {
        commandName,
        author: event.senderID,
        mod: event.messageID,
        gc: event.threadID
      })
    });
          sended++
          } catch (e) {}
        }
      }
    }
    message.reply(getLang('Done', sended));
  },
  atReply: async function({ Reply, api, event, args, usersData, getLang }) {
    const { author, commandName, mod, gc } = Reply;
    const Name = await usersData.getName(event.senderID);
    api.sendMessage(getLang('FeedBack', Name ,args.join(' ')), gc, (err, info) => {
      global.YukiBot.atReply.set(info.messageID, {
        commandName,
        author: event.senderID,
        gc: event.threadID,
        mod: event.messageID
      }, mod)
    });
  },
};
