module.exports = {
  config: {
    name: 'مسح',
    aliases: ['unsend'],
    author: 'allou Mohamed',
    version: '1.0.0',
    role: 1,
    category: 'البوت',
    guide: 'رد على رسالة البوت',
    description: 'مسح رسائل البوت',
    inbox: true
  },
  atCall: async function({ message, event }) {
    
    if (!event.messageReply || event.messageReply.senderID != global.YukiBot.UID) return message.reply('رد على رسالتي فقط ياغبي 🌝');
    message.unsend(event.messageReply.messageID);
  }
};
  