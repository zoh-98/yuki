const axios = require('axios');
const google = require("googlethis");
const cloudscraper = require("cloudscraper");

module.exports = {
  config: {
    name: "صور",
    aliases: ["imagesearch"],
    version: "1.0.0",
    role: 0,
    author: "Allou Mohamed",
    description: "بحث عن صور",
    category: "الصور",
    usages: "{pn} ",
    countDown: 60,
  },

  atCall: async ({ message, event, args, commandName }) => {
    try { 
    var query = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");

    message.reply(`🔎 بحث عن  ${query}...`);

    let result = await google.image(query, { safe: false });
    if (result.length === 0) {
      message.reply(`⚠️ | ما في نتائج برو 🌝.`);
      return;
    }

    let streams = [];
    let counter = 0;


    for (let image of result) {

      if (counter >= 6)
        break;


      let url = image.url;
      if (!url.endsWith(".jpg") && !url.endsWith(".png"))
        continue;

      let hasError = false;
      let stream = await global.utils.getStreamFromUrl(url).catch((error) => {
        hasError = true;
      });

      if (hasError)
        continue;

      streams.push({ url, stream });

      counter += 1;
    }


    let currentIndex = 0;
    let msg = {
      body: `النتائج 🌝\nالرابط: ${streams[currentIndex].url}\nرد بكلمة التالي لعرض التالي`,
      attachment: streams[currentIndex].stream
    };

    message.reply(msg, (err, info) => {
      global.YukiBot.atReact.set(info.messageID, {
        commandName,
        streams,
        currentIndex
      });
    });
    } catch (e) {};
  },
  atReact: async function ({ message, event, Reaction, args }) {
    try { 
    const { streams, currentIndex, mid, commandName } = Reaction;
     const nextIndex = currentIndex + 1;
    if (currentIndex < streams.length - 1) {
      const nextMsg = {
        body: `الرابط: ${streams[nextIndex].url}\n📝 | ضع رياكشن للتالي`,
        attachment: streams[nextIndex].stream
      };
      message.reply(nextMsg, (err, info) => {
      global.YukiBot.atReact.set(info.messageID, {
        commandName,
        streams,
        currentIndex: nextIndex
      });
      });
      }
    else if (currentIndex === streams.length - 1) {
      message.reply('✅ | تم');
      global.YukiBot.atReact.delete(Reaction.mid);
    }
  }catch (e) {};
  } 
};
