const axios = require("axios");
const apiUrl = 'https://yuki-ai-sim-vr.ma-pro.repl.co';

module.exports = {
  config: { 
    name: "يوكي",
    version: "1.1.0",
    role: 0,
    author: "Lou Fi",
    shortDescription: "دردشة مع بوت",
    category: "الذكاء",
    guide: "{pn} كلام",
    countDown: 2,
  },
  
  atCall: async function({ message, event, args, prefix, threadsData, role }) {
    const { messageID, threadID, senderID } = event;
    if (args[0] == "تشغيل") {
      if (role < 1) return message.reply('🈯 | فقط الأدمن يقدر');
      await threadsData.set(event.threadID, true, "data.yukichatbot");
      message.reply("🈯 | تم تشغيل الرد التلقائي 🌝");
      return;
    }
      if (args[0] == "إيقاف") {
        await threadsData.set(event.threadID, false, "data.yukichatbot");
        message.reply('🈯 | تم إيقاف التكلم مع يوكي 🌝');
        return;
      }
    const content = args.join(" ");
    if (!args[0]) return message.reply(`أكتب 🙂😹:\n${prefix}دخول 🌝\nإذا كنت تريد دخول مجموعتي الخاصة .-.🤍`);
    
    if (content.includes("=>")) {
      const [word, response] = content.split("=>").map(item => item.trim());
      if (!word || !response) {
        return message.reply("Please use the correct format to teach Yuki: يوكي word => response");
      }
      await teachYuki(word, response);
      return message.reply("تم تعليم يوكي بنجاح! 📚");
    }

    message.reply(`${await chatwithYuki(content)} 🌝`);
  },
    atChat: async({ threadsData, message, event }) => {
      if (["=>"].includes(event.body)) return;
      const chatBot = await threadsData.get(event.threadID, "data.yukichatbot");
      if (chatBot) {
        await message.reply(`${await chatwithYuki(event.body)}`);
      }
    }
};

async function chatwithYuki(word) {
  const response = await axios.get(`${apiUrl}/yuki`, {
    params: { word: word }
  });
  return response.data.response;
}

async function teachYuki(word, response) {
  try {
    const apiResponse = await axios.get(`${apiUrl}/teach`, {
      params: {
        word: word,
        responsesToAdd: response
      }
    });
    return apiResponse.data.response;
  } catch (error) {
    console.error('Error while calling the API:', error.message);
    throw error;
  }
}


  