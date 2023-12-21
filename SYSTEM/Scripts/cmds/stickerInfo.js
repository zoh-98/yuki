module.exports = {
  config: {
    name: 'ملصق',
    aliases: ['stickerID', 'stickerUID'],
    author: 'Allou Mohamed',
    version: '1.0.0',
    role: 2,
    category: 'المطور',
    guide: '{pn}',
    description: 'الحصول على معرف الملصقات 🌝'
  },
  langs: {
    ar: {
      only_sticker: 'رد فقط على ملصق',
      info: 'ID: %1\nCaption: %2'
    }
  },
  atCall: async function({ message, event, getLang }) {
    if (!event.messageReply || event.messageReply.attachments[0].type != 'sticker') return message.reply(getLang('only_sticker'));
    const { ID, caption } = event.messageReply.attachments[0];
    message.reply(getLang('info', ID, caption));
  }
};