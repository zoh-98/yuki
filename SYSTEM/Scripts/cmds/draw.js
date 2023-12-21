const axios = require('axios');

async function translate(text, sourceLang, targetLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await axios.get(url);
  const translation = res.data[0].map((item) => item[0]).join("");
  return translation;
}
module.exports = {
config: {
  name: "تخيلي",
  aliases: ["imagine", "تخيل"],
  version: "1.5",
  Author: "Shady Tarek",
  countDown: 10,
  role: 0,
  description: "",
  category: "الذكاء"
    },

atCall: async function ({ event, args, message:Message, commandName }) {
  try {
    const text = args.join(" ");
    if (!text) return Message.reply("⚠️ | اكتب شيئا.");

    let prompt;
    if (text.includes("-")) {
      const [promptText] = text.split("-").map((str) => str.trim());
      prompt = promptText;
    } else {
      prompt = text;
    }

    const translatedPrompt = await translate(prompt, 'ar', 'en');

    let modelNumber = 1;

    const modelIndex = args.findIndex(arg => arg === '-');
    if (modelIndex !== -1 && args.length > modelIndex + 1) {
      const modelArg = args[modelIndex + 1];
      const parsedModelNumber = parseInt(modelArg);
      if (!isNaN(parsedModelNumber) && parsedModelNumber >= 1 && parsedModelNumber <= 107) {
        modelNumber = parsedModelNumber;
      }
    }

    Message.reply("✅ | جاري إنشاء التخيل الخاص بك...", async (err, info) => {
      let ui = info.messageID;
      try {
        const response = await axios.get(`https://generate.amina-hina.repl.co/img?prompt=${encodeURIComponent(translatedPrompt)}&model=${modelNumber}`);
        const { framedUrl, imageUrls } = response.data.response;

        const msg1 = "✅ | تم إنشاء الصورة.\nقم بالرد برقم بين (1 ، 2 ، 3 ، 4) أو اكتب كلهم للحصول علي كل الصور\nللحصول على الصورة المقابلة بدقة عالية."


    

        Message.reply({
          body: `${msg1}`,
          attachment: await global.utils.getStreamFromURL(framedUrl)
        }, async (err, info) => {
          let id = info.messageID;
          global.YukiBot.atReply.set(id, {
            name: commandName,
            messageID: id,
            author: event.senderID,
            imageUrls
          });
        });
      } catch (error) {

       // Message.react("❌");
        Message.reply(error.stack);
      }
    });
  } catch (error) {

    Message.reply(error.stack);
  }
},
atReply: async function ({ event, Reply, Message }) {
  const reply = event.body;
  const { messageID, imageUrls } = Reply;

  try {
    if (reply.toLowerCase() === 'كلهم') {
    

      const imageAttachments = [];

      for (let i = 1; i <= 4; i++) {
        let msg = "✅ | ها هي الصور:\n";
        for (let j = 1; j <= 4; j++) {
          const img = imageUrls[`image${j}`];
          msg += `الصورة: [ ${j} ] ${img}\n`;

          imageAttachments.push(await global.utils.getStreamFromURL(img));
        }
        Message.send({
          body: msg,
          attachment: imageAttachments
        });
      }
    } else {
      const replyNumber = parseInt(reply);
      if (!isNaN(replyNumber) && replyNumber >= 1 && replyNumber <= 4) {
      
        const img = imageUrls[`image${replyNumber}`];
        const translatedImg = await translate(img, 'en', 'ar');
        await Message.reply({
          body: translatedImg,
          attachment: await global.utils.getStreamFromURL(img)
        });
      } else {
        Message.reply("⚠️ | رقم غير صالح.\nيرجى الرد برقم بين 1 و 4 أو كلهم لجميع الصور.");
      }
    }
  } catch (error) {

    Message.reply(error.stack);
  }
  Message.unsend(messageID);
}
}