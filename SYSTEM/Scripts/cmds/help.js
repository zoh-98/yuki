const { getPrefix } = global.utils;
const { commands } = global.YukiBot;
const doNotDelete = "يوكي بوت 1.0.0";

function compareCommands(command1, command2) {
  const name1 = command1.config.name.toLowerCase();
  const name2 = command2.config.name.toLowerCase();

  return name1.localeCompare(name2, ["ar", "en"], { sensitivity: "base" });
}

module.exports = {
  config: {
    name: "الأوامر",
    aliases: ["help", "الاوامر", "اوامر", "مساعدة", "أوامر"],
    version: "1.17",
    author: "Allou Mohamed",
    role: 0,
    shortDescription: "عرض أوامر البوت",
    category: "المعلومات",
  },
  langs: {
    ar: {
      help: "📝 | أوامر البوت مع الوصف\n──────────────────\n%1\n──────────────────\n• عدد الأوامر: %2\n• الصفحة: %3\n• %4"
    }
  },
  atCall: async function ({ message, args, event, getLang }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);

    const pageSize = 30;
    const pageNumber = args[0] ? parseInt(args[0]) : 1; 
    if (isNaN(pageNumber)) {
      const categoryFilter = args[0];

      const commandsInCategory = Array.from(commands.values())
        .filter(command => command.config.category.toLowerCase() === categoryFilter)
        .sort(compareCommands)
        .map((command) => {
          let description = command.config.description || (typeof command.config.shortDescription === 'string' ? command.config.shortDescription : '');

          if (typeof command.config.shortDescription === 'object' && command.config.shortDescription.ar) {
            description = command.config.shortDescription.ar;
          }
          if (typeof command.config.shortDescription === 'object' && command.config.shortDescription.en) {
            description = command.config.shortDescription.en;
          }

          return `${prefix}${command.config.name} - ${description}`;
        })
        .join("\n");

      if (commandsInCategory) {
        message.reply(`──────────────────\n              🔱  ${categoryFilter} 🔱\n──────────────────\n${commandsInCategory}\n──────────────────\n              🔱 ${categoryFilter} 🔱\n──────────────────`);
        return;
      } else {
        message.reply(`لا توجد أوامر ${args[0]} جرب أوامر الألعاب 🌝`);
        return;
      }
    };

    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = pageNumber * pageSize;

    const totalCommands = commands.size;

    if (startIndex >= totalCommands || startIndex < 0) {
      message.reply("الصفحة غير موجودة 🐢🤍.");
      return;
    }

    const sortedCommands = Array.from(commands.values())
      .sort(compareCommands)
      .slice(startIndex, endIndex)
      .map((command, index) => {
        const commandNumber = startIndex + index + 1; 
        let description = command.config.description || (typeof command.config.shortDescription === 'string' ? command.config.shortDescription : '');
        
        if (typeof command.config.shortDescription === 'object' && command.config.shortDescription.ar) {
          description = command.config.shortDescription.ar;
        }
        if (typeof command.config.shortDescription === 'object' && command.config.shortDescription.en) {
          description = command.config.shortDescription.en;
        }

        return `${commandNumber} | ${prefix}${command.config.name} - ${description}`;
      })
      .join("\n");

    message.reply(getLang('help', sortedCommands, totalCommands, pageNumber, doNotDelete));
  },
};
