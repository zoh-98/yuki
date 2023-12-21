module.exports = {
  config: {
    name: "حافظة",
    aliases: ["pp", "الحافظة"],
    version: "1.2",
    author: "allou Mohamed",
    description: "تخزين النصوص",
    countDown: 2,
    role: 0,
    category: "تخزين"
  },

  atCall: async function ({ args, event, usersData, message, commandName }) {
    const { threadID, senderID } = event;

    const userData = await usersData.get(senderID, "data.clipboard", []);

    const subcommand = args[0];

    if (!subcommand) {
      // Display the user's stored texts
      let msg = "📋 النصوص في حافظتك:\n";
      if (userData.length === 0) {
        msg += "   لا توجد أي نصوص في الحافظة الخاصة بك.";
      } else {
        userData.forEach((text, index) => {
          msg += `   ${index + 1}. ${text}\n`;
        });
      }

      message.reply(msg, (err, info) => {
        global.YukiBot.atReply.set(info.messageID, {
          commandName,
          author: senderID,
          userData,
          messageID: info.messageID,
        });
      });
    } else if (subcommand === "add" || subcommand === "-a" || subcommand === "اضف" || subcommand === "أضف") {
      // Add a new text to the clipboard
      const textToAdd = args.slice(1).join(" ");
      if (!textToAdd) {
        message.reply("من فضلك أدخل نص 😏📋.");
        return;
      }

      userData.push(textToAdd);
      await usersData.set(senderID, userData, "data.clipboard");

      message.reply("📋 تم حفظ النص في حافظتك.");
    } else if (subcommand === "delete" || subcommand === "-d" || subcommand === "مسح" || subcommand === "حذف") {
      // Delete a specific text from the clipboard
      const indexToDelete = parseInt(args[1]) - 1;
      if (isNaN(indexToDelete) || indexToDelete < 0 || indexToDelete >= userData.length) {
        message.reply("أدخل الرقم الصحيح الذي تريد حذفه 📋.");
        return;
      }

      userData.splice(indexToDelete, 1);
      await usersData.set(senderID, userData, "data.clipboard");

      message.reply(`🗑️ النص رقم ${indexToDelete + 1} تم حذفه من الحافظة.`);
    } else if (!isNaN(subcommand)) {
      // Retrieve a specific text from the clipboard
      const index = parseInt(subcommand) - 1;
      if (index < 0 || index >= userData.length) {
        message.reply("من فضلك أدخل رقم صحيح 📋.");
        return;
      }

      message.reply(`📋 النص:\n ${index + 1}: ${userData[index]}`, () => {
        message.unsend(Reply.messageID);
      });
    } else {
      message.reply("الاستخدام 📋:\nحافظة اضف <نص>\nحافظة حذف <نص>\nحافظة وحده كي يرسل لك الحافظة و رد برقم تريد أن يرسله لك 😏📋");
    }
  },

  atReply: async function ({ message, event, getLang, Reply }) {
    const { author, userData } = Reply;
    if (author !== event.senderID) return;

    const num = parseInt(event.body);
    if (!isNaN(num) && num >= 1 && num <= userData.length) {
      message.reply(`📋. ${num}: ${userData[num - 1]}`, () => {
        message.unsend(Reply.messageID);
      });
    }
  },
};
                       