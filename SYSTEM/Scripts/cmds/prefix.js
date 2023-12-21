const fs = require("fs-extra");
const { utils } = global;

module.exports = {
  config: {
    name: "رمز",
    aliases: ["brefix"],
    version: "1.3",
    author: "Allou Mohamed",
    countDown: 5,
    role: 0,
    shortDescription: "تغيير رمز البوت",
    category: "الكونفيغ",
    guide: "",
    usePrefix: true
  },
  
  atCall: async function ({ message, role, args, event, threadsData }) {
    
    if (!args[0]) return;

    const newPrefix = args[0];
    const setGlobal = args[1] === "-g";

    if (args[0] === 'حذف' || args[0] === 'reset') {
      await threadsData.set(event.threadID, null, "data.prefix");
      return message.reply('✅ | The prefix has been set to global');
    }

    const prefixType = setGlobal ? 'global' : 'group';
    const confirmationMessage = setGlobal ? 'React to change the global prefix' : 'React to confirm the prefix change';

    const formSet = {
      commandName: 'رمز',
      author: event.senderID,
      newPrefix,
      setGlobal,
      messageID: null
    };

    return message.reply(confirmationMessage, (err, info) => {
      formSet.messageID = info.messageID;
      YukiBot.atReact.set(info.messageID, formSet);
    });
  },

  atReact: async function ({ message, threadsData, event, Reaction }) {
    const { author, newPrefix, setGlobal, messageID } = Reaction;

    if (event.userID !== author) {
      return;
    }

    if (setGlobal) {
      global.YukiBot.config.prefix = newPrefix;
      fs.writeFileSync(YukiBot.dirconfig, JSON.stringify(YukiBot.config, null, 2));
      YukiBot.atReact.delete(messageID);
//YukiBot.config = require(YukiBot.dirconfig);
      return message.reply(`✅ | The new global prefix is: ${newPrefix}`);
    } else {
      await threadsData.set(event.threadID, newPrefix, "data.prefix");
    YukiBot.atReact.delete(messageID);

      return message.reply(`✅ | The group prefix is now: ${newPrefix}`);
    }
  },

  atChat: async function ({ event, message, getLang }) {
    if (!global.prefix) global.prefix = [];
    if (global.prefix.includes(event.senderID)) return;
    const body = event.body;
    if (!body) return;
    const prefix = utils.getPrefix(event.threadID);
    if(prefix.includes(body)) return;
    if (body == "brefix" || body == "Brefix") {
      message.reply(`🌐 | Bot Prefix: ${YukiBot.config.prefix}\n🛸 | Group Prefix: ${utils.getPrefix(event.threadID)}\n🌚 | Remember it well because I only say it once.`);
      
global.prefix.push(event.senderID);
      return;
    }
  }
};
        