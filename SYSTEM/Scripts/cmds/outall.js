module.exports = {
  config: {
    name: 'مغادرةالكل',
    description: 'جعل البوت يغادر كل المجموعات',
    aliases: ["outall", "oa"],
    author: "allou Mohamed",
    category: 'المطور',
    role: 3
  },
  atCall: async function({ message, event, api, commandName, threadsData, args }) {
     if (args[0]) {
       try { 
         const Tid = args[0] || event.threadID;
api.removeUserFromGroup(global.YukiBot.UID, Tid);
         message.reply('✅ | Done ✓');
       } catch (error) {
         return message.reply('😠 | poteto 😔');
       }
       return;
     } else {
    const t = await api.getThreadList(100, null, []);
    const tt = [];
    for (const thread of t) {
      const threadInfo = await threadsData.get(thread.threadID);
      if (threadInfo && threadInfo.members && threadInfo.isGroup && threadInfo.threadID != event.threadID) {
        const botMember = threadInfo.members.find(member => member.userID === global.YukiBot.UID && member.inGroup === true);
        if (botMember) {
          tt.push(thread.threadID);
        }
        if (tt.length == 0) {
          message.reply('✅ | No other groups founded the bot is only in this group');
          return;
        }
      }
    }
    await message.reply('📝 | Found ' + tt.length + ' group\n✅ | Confirm out with reaction', (err, info) => {
      global.YukiBot.atReact.set(info.messageID, {
        commandName: 'مغادرةالكل',
        author: event.senderID,
        mid: info.messageID,
        tt: tt,
      });
    });
   }
  },
atReact: async function({ api, message, event, Reaction }) {
    async function removeUserFromGroup(userId, groupId) {
      let removedCount = 0;
      let errorCount = 0;
      try {
        await api.removeUserFromGroup(userId, groupId);
        removedCount++;
      } catch (error) {
        errorCount++;
      }
      return { removedCount, errorCount };
    }
    const { tt, author, mid, commandName } = Reaction;
    if (event.userID != author) return;
    message.reply('✅ | Start outing all groups...');
    const BOT = api.getCurrentUserID();
    let totalRemovedCount = 0;
    let totalErrorCount = 0;
    for (const group of tt) {
      const result = await removeUserFromGroup(BOT, group);
      totalRemovedCount += result.removedCount;
      totalErrorCount += result.errorCount;
    }
    api.sendMessage(`✅ | Successfully removed from ${totalRemovedCount} groups.`, author);
    api.sendMessage(`❎ | Errors occurred in ${totalErrorCount} groups.`, author);
  }
};
