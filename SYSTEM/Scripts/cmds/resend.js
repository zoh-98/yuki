/*global.resend = new Map();

const { getStreamFromUrl } = global.utils;*/

module.exports = {
  config: {
    name: 'فضح',
    aliases: ["auto-resend"],
    description: 'تشغيل إعادة الرسائل المحذوفة',
    category: 'تلقائي',
    guide: 'تشغيل أو إيقاف',
    author: 'Allou Mohamed',
    role: 1,
    countDown: 30
  },
  atCall: async function ({ args, threadsData, message, event }) {  
   if (!args[0]) return message.Guide();
    if (args[0] == "تشغيل" || args[0] == "on") {
      message.reply('✅ | تم تشغيل إعادة الرسائل المحذوفة:\n📝 | البوت إذا كان شغال سيعيد رسالة كل من يحذف');
      await threadsData.set(event.threadID, true, "settings.resend");
    }
    if (args[0] == "off" || args[0] == "إيقاف") {
      message.reply('⏸️ | تم إيقاف إعادة الرسائل المحذوفة');
      await threadsData.set(event.threadID, false, "settings.resend");
    }
  }/*,
  atChat: async function ({ message, event, usersData, threadsData }) {
    const resend_status = await threadsData.get(event.threadID, "settings.resend");
    if (!resend_status) return;
    try {
      if (event.body || (event.attachments && event.type !== 'message_unsend')) {
        
        global.resend.set(event.messageID, {
          message: event.body,
          user: event.senderID,
          attachments: event.attachments || [],
        });
      }

      if (event.type === 'message_unsend') {
      if (event.senderID == YukiBot.UID) return;
        const uns = global.resend.get(event.messageID);
        if (uns) {
          const unsentMessage = uns.message;
          const senderName = await usersData.getName(uns.user);

          const attachmentUrls = uns.attachments.map((attachment) => attachment.url);

          let responseMessage = `${senderName} قام بحذف `;

          if (unsentMessage) {
            responseMessage += `رسالة:\n${unsentMessage}\n`;
          }
          if (uns.attachments.length > 0) {
            responseMessage += ` ${uns.attachments.length} صور:`
          }
          const imagePromises = [];
         
          for (const imageUrl of attachmentUrls) {
            imagePromises.push(await getStreamFromUrl(imageUrl));
          }

          const images = await Promise.all(imagePromises);

          
          await message.reply({
            body: responseMessage,
            mentions:[{id:event.senderID, tag:senderName}],
            attachment: images
          });
        } else {
          console.error('Message not found in the resend Map.');
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  },*/
};
