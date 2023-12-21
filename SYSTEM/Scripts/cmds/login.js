const fs = require('fs-extra');

module.exports = {
  config: {
    name: "تسجيل",
    version: "1.0",
    author: "allou Mohamed",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "",
      en: "إنشاء حساب يوكي إفتراضي (قيد التطوير)"
    },
    longDescription: {
      vi: "",
      en: "إنشاء حساب يوكي إفتراضي (قيد التطوير)"
    },
    category: "الحساب"
  },

  atCall: async function ({ message, event, usersData, threadsData, commandName, args }) {

    if (!args[0]) {

      const signed = await usersData.get(event.senderID, "data.isSignedUp");

    if (signed == true) return message.reply('لديك حساب بالفعل');

    message.reply(
      {
        body: "هل تريد بدأ التسجيل ؟\nرد بنعم 🌝",
      },
      (err, info) => {
        global.YukiBot.atReply.set(info.messageID, {
          commandName,
          messageID: info.messageID,
          author: event.senderID,
          step: 1
        });
      }
    );
    }

    if (args[0] == "معلومات") {
        const signed = await usersData.get(event.senderID, "data.isSignedUp");
      if (signed != true) return message.reply('سجل أولا 🌝');



        message.reply(
            {
                body: "الرجاء إدخال كلمة السر لعرض معلوماتك 🌝",
            },
            (err, info) => {
                global.YukiBot.atReply.set(info.messageID, {
                    commandName,
                    messageID: info.messageID,
                    author: event.senderID,
                    step: 2
                });
            }
        );
    }
    if (args[0] == "إعدادات") {

      const signed = await usersData.get(event.senderID, "data.isSignedUp");
      if (signed != true) return message.reply('سجل أولا 🌝');

      message.reply(
            {
                body: "1: نسيت كلمة السر\n2:تغيير الإسم\n3: إضافة الرصيد",
            },
            (err, info) => {
                global.YukiBot.atReply.set(info.messageID, {
                    commandName,
                    messageID: info.messageID,
                    author: event.senderID,
                    step: 3
                });
            }
        );

    }
  },

  atReply: async function ({ message, event, Reply, usersData, threadsData, args, role }) {
    const { type, author, commandName, step } = Reply;
    if (event.senderID != author) return;

if (step == 1) {
      message.reply(
        {
          body: `أنشأ كلمة سر لحسابك 🙆‍♂️ ورد بها على هذه الرسالة 🌝🔁 حطها أكبر من 8 رموز ‼️`,
        },
        (err, info) => {
          global.YukiBot.atReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
            type: "SignUp"
          });
        }
      );
    }
    if (type === "SignUp") {
      const password = event.body; 
      if (password.length < 8) {
        return message.reply('حط كلمة سر أكبر من 8 حروف أو أرقام');
      }

      const target = event.senderID;




      message.reply('لقد سجلت بنجاح في يوكي 🫂🌝\nأكتب تسجيل معلومات لعرض معلومات الحساب 🙆‍♂️🤍');
      await usersData.set(target, true, "data.isSignedUp");
      await usersData.set(target, password, "data.password");
    }

    if (step == 2) {
        const password = event.body;
        const usps = await usersData.get(event.senderID, "data.password");

        if (usps !== password) {
            return message.reply('كلمة السر غير صحيحة');
        }

          const target = event.senderID;


      const Name = await usersData.get(target, "data.username") || await usersData.getName(target);
      let money = await usersData.get(target, "money");

      if (money > 99999999999999) {
        money = "∞∞∞∞";
      }

      const exp = await usersData.get(target, "exp");
      const quizexp = await usersData.get(target, "data.Qexp") || 0;
      const rcount = await usersData.get(target, "data.rcount") || 0;

      const members = await threadsData.get(event.threadID, "members");
      const findMember = members.find((user) => user.userID === target);
      const count = findMember.count;


        message.reply(`===sign in info===\nالإسم: ${Name}•\nالرصيد: ${money}•\nعدد الرياكشنات: ${rcount}•\nعدد النقاط: ${exp} نقطة و ${quizexp} في لعبة شخصية\n•معرفك: ${target}•\nعدد رسائلك في هذه المجموعة ${count} رسالة•`);
          }
    if (step == 3) {

      if (event.body == "1") {
        message.reply(
            {
                body: "لإعادة كلمة السر من فصلك أدخل معرف حسابك 🌝",
            },
            (err, info) => {
                global.YukiBot.atReply.set(info.messageID, {
                    commandName,
                    messageID: info.messageID,
                    author: event.senderID,
                    action: "remakepass"
                });
            }
        );
      }
      if (event.body == "2") {
        message.reply(
            {
                body: "لتغيير الإسم الذي يظهر في الآيدي رد بإسم جديد 🌝",
            },
            (err, info) => {
                global.YukiBot.atReply.set(info.messageID, {
                    commandName,
                    messageID: info.messageID,
                    author: event.senderID,
                    action: "remakename"
                });
            }
        );
      }
      if (event.body == "3") {
        if (role != 2) return message.reply('روح المطبخ عدل رصيدك هناك 🙂😹');
        message.reply(
            {
                body: "أدخل الرصيد الذي تريد إضافته لك يا حب 😢🤍",
            },
            (err, info) => {
                global.YukiBot.atReply.set(info.messageID, {
                    commandName,
                    messageID: info.messageID,
                    author: event.senderID,
                    action: "addmoney"
                });
            }
        );
      }
    }
    if (Reply.action == "remakepass") {
      if (event.body != Reply.author) return message.reply('معرفك غير صحيح 🙀');

      message.reply(
            {
                body: "الرجاء إدخال كلمة السر الجديدة",
            },
            (err, info) => {
                global.YukiBot.atReply.set(info.messageID, {
                    commandName,
                    messageID: info.messageID,
                    author: event.senderID,
                    action: "changepass"
                });
            }
        );
    }
    if (Reply.action == "changepass") {
      await usersData.set(event.senderID, event.body, "data.password");
      message.reply('تم تغيير كلمة سر حسابك بنجاح 🌝🙀');
    }

    if (Reply.action == "remakename") {
      message.reply(
            {
                body: "رد بكلمة السر لحفظ التغييرات 🙀🤍",
            },
            (err, info) => {
                global.YukiBot.atReply.set(info.messageID, {
                    commandName,
                    messageID: info.messageID,
                    author: event.senderID,
                    action: "savename",
                    name: event.body
                });
            }
        );
    }
    if (Reply.action == "savename") {
      const usps = await usersData.get(event.senderID, "data.password");

        if (usps !== event.body) {
            return message.reply('كلمة السر غير صحيحة');
        }

      await usersData.set(event.senderID, Reply.name, "data.username");
      message.reply(`تم تغيير إسمك إلى: ${Reply.name} ✓`)
  }

    if (Reply.action == "addmoney") {
      const amount = parseInt(event.body);
      if (isNaN(amount) || amount < 0)  return message.reply('._. حط مبلغ بجد');

      await usersData.addMoney(event.senderID, amount);
      message.reply(`تم إضافة ${amount} لك 🙀🤍`);
    }
  }
};
