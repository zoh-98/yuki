const { getPrefix } = global.utils;
const { commands } = global.YukiBot;
const doNotDelete = "Yuki Bot V1.0.0";


module.exports = {
  config: {
    name: "شرح",
    aliases: ["helpinfo"],
    version: "1.17",
    author: "Allou Mohamed",
    role: 0,
    shortDescription: "شرح الأوامر",
    category: "المعلومات",
  },

  atCall: async function ({ message, args, event }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);

    if (args.length === 1) {
      const commandName = args[0].toLowerCase();

      const command = YukiBot.commands.get(commandName) || YukiBot.commands.get(YukiBot.aliases.get(commandName));

      if (command) {
        const { name, version, author, description, shortDescription, category, guide, role, countDown, reward, price, inbox } = command.config;

        let configInfo = `📝 | شرح أمر "${commandName}" 🌝:\n`;

        if (name) {
          configInfo += `• الإسم: ${name}\n`;
        }
        if (version) {
          configInfo += `• الإصدار: ${version}\n`;
        }
        if (author) {
          configInfo += `• المبرمج: ${author}\n`;
        }
        if (description || shortDescription) {
          //
let description = command.config.description || (typeof command.config.shortDescription === 'string' ? command.config.shortDescription : '');
        
        if (typeof command.config.shortDescription === 'object' && command.config.shortDescription.ar) {
          description = command.config.shortDescription.ar;
        }
        if (typeof command.config.shortDescription === 'object' && command.config.shortDescription.en) {
          description = command.config.shortDescription.en;
        }
          //
          configInfo += `• الوصف: ${description}\n`;
          
        }
        if (category) {
          configInfo += `• الفئة: ${category}\n`;
        }
        if (guide) {
          const guideCmd = command.config.guide['en'] || command.config.guide['ar'] || command.config.guide || command.config.usage;
          configInfo += `• أكتب: ${guideCmd.replace(/\{prefix\}|\{p\}/g, prefix)
				.replace(/\{name\}|\{n\}/g, command.config.name)
				.replace(/\{pn\}/g, prefix + command.config.name)}\n`;
        }
        if (typeof role != 'undefined') {
          configInfo += `• الصلاحية: ${role}\n`;
        }
        if (typeof countDown != 'undefined') {
          configInfo += `• الإنتظار: ${countDown} ثوان\n`;
        }
        if (typeof reward != 'undefined') {
          configInfo += `• المكافأة: ${reward} دينار\n`;
        }
        if (typeof price != 'undefined') {
          configInfo += `• السعر: ${price}\n`;
        }
        if (typeof inbox != 'undefined') {
          let pm;
          if (inbox == true) pm = "";
          if (inbox == false) pm = "لا";
          configInfo += `• الأمر ${pm} يعمل في الخاص\n`;
        }

        message.reply(configInfo);
        return;
      } else {
        message.reply("أمر مش موجود.");
        return;
      }
    }
  }
};
