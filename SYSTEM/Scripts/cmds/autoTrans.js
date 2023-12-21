const axios = require('axios');

module.exports = {
    config: {
       name: 'ترجمة تلقائية',
       author: 'Allou Mohamed',
       version: '1.0.0',
       role: 1,
       category: 'Ai',
       guide: '{pn} معرفه أو رد عليه وضع اللغة مثلا\n{pn} 1010101119191 ar: سيترجم للعربية',
       price: 0,
       reward: 0,
       description: 'ترجمة تلقائية.',
       inbox: true
    },
    atCall: async function({ message, usersData, event, args }) {
    let potato;
    let lang;
      
      if (event.type == "message_reply") {
        poteto = event.messageReply.senderID;
        lang = args[0] || 'ar';
      } else {
        poteto = event.senderID;
        lang = args[0] || 'ar';
      } 
      const name = await usersData.getName(poteto);
      if (args[0] == 'إيقاف') {
        await usersData.set(poteto, {
          data: {
            autoTrans: {
            unabled: false,
            lang: lang
          }
        }
        });
        message.reply(`❎ | تم إيقاف الترجمة التلقائية ل${name}.`);
        return;
      } else { 
      await usersData.set(poteto, {
        data: {
          autoTrans: {
          unabled: true,
          lang: lang
        }
      }
      });
      message.reply(`✅ | تم تشغيل الترجمة التلقائية ل${name} على اللغة: ${lang}.`);
        return;
      }
  },
    atChat: async function({ event, message, usersData }) {
    const poteto = await usersData.get(event.senderID);
      if (!poteto.data.autoTrans) return;
      if (poteto.data.autoTrans.unabled == true) {
        const messageTotrans = event.body;
        const lang = poteto.data.autoTrans.lang;
        /* @Trans */
        const trans = await translate(messageTotrans, lang);
        const { text } = trans;
        message.reply(text);
      }
  }
};

async function translate(text, langCode) {
	const res = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${langCode}&dt=t&q=${encodeURIComponent(text)}`);
	return {
		text: res.data[0].map(item => item[0]).join(''),
		lang: res.data[2]
	};
}