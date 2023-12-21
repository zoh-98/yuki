module.exports = {
  config: {
    name: "سكوت",
    aliases: ["as"],
    version: "1.1",
    author: "Loufi | Allou Mohamed",
    countDown: 5,
    role: 0,
    shortDescription: {
      ar: "سكوت 🌝"
    },
    longDescription: {
      en: ""
    },
    category: "الخدمات",
    guide: {
      en: "{pn}"
    }
  },

  atCall: async function ({api,  message, event, args, threadsData, role }) {
    if (role < 1) return message.reply('فقط الأدمن يقدر يشغله يا غبي 🌝');
    let {adminIDs} = await threadsData.get(event.threadID);
    const BOTID = api.getCurrentUserID();
    if (!adminIDs.includes(BOTID)) return message.reply('قم بجعل البوت أدمن لتستعمل هذا الأمر ⚠️');
    
    if (!args[0]) {
      await threadsData.set(event.threadID, true, "settings.shutUp");
      message.reply('⚠️ تحذير: ⚠️\n• قام الأدمن بتفعيل وضع السكوت لذا لا ترسل أي رسالة و إلى ستطرد من المجموعة\n ⚠️ 𝘄𝗮𝗿𝗻 ⚠️');
    } else if (args[0] === "إيقاف") {
      await threadsData.set(event.threadID, false, "settings.shutUp");
      message.reply('لقد تم إيقاف وضع السكوت و الكل يمكنه الكلام 🤍');
    }
  },

  atChat: async function ({ event, usersData, message, threadsData, api }) {
    let {adminIDs} = await threadsData.get(event.threadID);
    const name = await usersData.getName(event.senderID);
    
    if (
      event.body &&
      (await threadsData.get(event.threadID, "settings.shutUp")) === true &&
      event.senderID !== api.getCurrentUserID() && !adminIDs.includes(event.senderID)
    ) {
      api.removeUserFromGroup(event.senderID, event.threadID).then(() => {
        message.reply(`⚠️ ${name}:\n تم طردك لأنك تكلمت في وضع السكوت .`);
      });
    }
  }
};
      