const apiUrl = 'https://bard.proarcoder.repl.co';
const axios = require('axios');
const { getStreamFromURL } = global.utils;

module.exports = {
    config: {
       name: 'بارد',
       author: 'allou Mohamed',
       version: '1.0.0',
       role: 0,
       category: 'الذكاء',
       guide: '{pn} طلب',
       price: 0,
       description: 'ذكاء إسطناعي للبحث عن معلومات جوجل بارد',
       inbox: true
    },
    atCall: async function({ message, event, args, commandName }) {
    const UID = event.senderID;
    const query = args.join(' ');
    const prompt = encodeURIComponent(query);
    await BARD(prompt, UID, message, commandName, event);
  },
  atReply: async function({ message, event, Reply }) {
    if (event.senderID != Reply.author) return message.reply('🦊 who are you nega ?');
    await BARD(encodeURIComponent(event.body), event.senderID, message, Reply.commandName, event)
  }
};
  async function BARD(prompt, UID, message, commandName, event) {
    try {
      const res = await axios.get(apiUrl, {
    params: {
    query: prompt,
    UID: UID
    }
    });
      const { Bard } = res.data;
      let formSend = { body: Bard.message + `\n\n• ℝ𝕖𝕡𝕝𝕪 𝕓𝕪 "𝗰𝗹𝗲𝗮𝗿" 𝕋𝕠 𝕔𝕝𝕖𝕒𝕣 𝕐𝕠𝕦𝕣 𝕔𝕙𝕒𝕥 𝕨𝕥𝕙 𝕞𝕖
• ℝ𝕖𝕡𝕝𝕪 𝕓𝕪 𝗔𝗻𝘆 𝗽𝗿𝗼𝗺𝗽𝘁𝘀 𝕥𝕠 𝕔𝕙𝕒𝕥 𝕞𝕠𝕣𝕖` };
      if (Bard.imageUrls.length > 0) {
    const streams = [];
    for (let i = 0; i < Math.min(6, Bard.imageUrls.length); i++) {
    streams.push(await getStreamFromURL(Bard.imageUrls[i]));
    }
        formSend.attachment = streams;
      }

      message.reply(formSend, (err, info) => {
        global.YukiBot.atReply.set(info.messageID, {
          commandName,
          author: event.senderID
        })
      });
    } catch (error) {
      message.reply(error.message);
    }
  };