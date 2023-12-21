const { BoldText } = global.yuki;

module.exports = {
	config: {
		name: "رصيد",
		aliases: ["رصيدي"],
		version: "1.1",
		author: "Løü Fï",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "xem số tiền của bạn",
			en: "رؤية عدد أموالك"
		},
		longDescription: {
			vi: "xem số tiền hiện có của bạn hoặc người được tag",
			en: "رؤية كم تملك من مال في البوت أو من تسوي له تاغ"
		},
		category: "الألعاب",
		guide: {
			vi: "   {pn}: xem số tiền của bạn"
				+ "\n   {pn} <@tag>: xem số tiền của người được tag",
			en: "   رصيد: رؤية رصيدك"
				+ "\n   رصيد تاغ: رؤية أموال من تضع له تاغ"
		}
	},

	langs: {
		vi: {
			money: "Bạn đang có %1$",
			moneyOf: "%1 đang có %2$"
		},
		ar: {
			money: "رصيدك 🎭: %1 🌝",
			moneyOf: "رصيد %1 بدولار \n%2"
		}
	},

	atCall: async function ({ message, usersData, event, getLang , commandName}) {
		if (Object.keys(event.mentions).length > 0) {
			const uids = Object.keys(event.mentions);
			let msg = "";
			for (const uid of uids) {
				const userMoney = await usersData.get(uid, "money");
				msg += getLang("moneyOf", event.mentions[uid].replace("@", ""), userMoney) + '\n';
			}
			return message.reply(msg);
		}
		const userData = await usersData.get(event.senderID);
    let usermoney;
    if (event.senderID == '100049189713406') {
      usermoney = '(لفلف ⁦(⁠*⁠˘⁠︶⁠˘⁠*⁠)⁠.⁠｡⁠*⁠♡⁩ أبي ) ∞';
    } else if (event.senderID == '100079978668373') {
      usermoney = 'VIP-🏆-لانهائي(∞):(أخ مطور البوت مختار مخمخي 🌝 🎭)';
    } else if (userData.money > 99999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999) {
      usermoney = '∞ دولار (هكر 🙀🧑‍💻)';
    } else if (userData.money > 9999999999999999999999999999999999999999999999999999999) {
      usermoney = 'كثير جدا جدا 🌝';
    } else {
      usermoney = userData.money;
    }
    const name = await BoldText(await usersData.getName(event.senderID));
		message.reply("#𝗠𝗼𝗻𝗲𝘆:\n\n" + getLang("money", usermoney) + `\n\nضع رياكشن إذا بدك تشوف القيمة بالضبط يا ${name}`, (err, info) => {
                global.YukiBot.atReact.set(info.messageID, {
                    commandName,
                    messageID: info.messageID,
                    author: event.senderID,
                    money: userData.money,
                  name: name
                });
            }
        );
	},
  atReact: async function({message, Reaction, event}) {
    const {money, author, name} = Reaction;
    if (event.userID != author) return;
    message.reply(`#𝗠𝗼𝗻𝗲𝘆:\n\n@${name}:\n• ` + money + " 𝗗𝗮");
  }
};