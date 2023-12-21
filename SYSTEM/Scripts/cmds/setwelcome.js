const { drive, getStreamFromURL, getExtFromUrl, getTime } = global.utils;

module.exports = {
	config: {
		name: "ترحيب",
		aliases: ["setwc", "setwelcome"],
		version: "1.5",
		author: "ALLOU MOHAMED",
		countDown: 5,
		role: 1,
		shortDescription: {
			en: "تعديل الكلام الذي يقوله البوت للجدد"
		},
		category: "تخصيص",
		guide: {
			en: "   {pn} نص [<النص> | عام]: تعديل نص الترحيب أو جعله كنظام البوت"
					+ "\n  + {userName}"
					+ "\n  + {userNameTag}"
					+ "\n  + {boxName}"
					+ "\n  + {multiple}"
					+ "\n  + {session}"
					+ "\n\n   مثال:"
					+ "\n    {pn} نص مرحبا {userName}, نرحب بك في {boxName} 🤍"
		}
	},

	langs: {
		ar: {
			turnedOn: "تم تشغيل الترحيب 🤍",
			turnedOff: "تم إيقاف الترحيب 🥶",
			missingContent: "أدخل نص الترحيب 🌝🌸",
			edited: "تم وضع الترحيب: %1 🌸🌝",
			reseted: "تم ✓🌝🌸",
			noFile: "مافي مرفقات للحذف 🌝",
			resetedFile: "تم 🌝✓"
		}
	},

	atCall: async function ({ args, threadsData, message, event, commandName, getLang }) {
		const { threadID, senderID, body } = event;
		const { data, settings } = await threadsData.get(threadID);

		switch (args[0]) {
			case "نص": {
				if (!args[1])
					return message.reply(getLang("missingContent"));
				else if (args[1] == "عام")
					delete data.welcomeMessage;
				else
					data.welcomeMessage = body.slice(body.indexOf(args[0]) + args[0].length).trim();
				await threadsData.set(threadID, {
					data
				});
				message.reply(data.welcomeMessage ? getLang("edited", data.welcomeMessage) : getLang("reseted"));
				break;
			}
			
			case "on":
			case "off": {
				settings.sendWelcomeMessage = args[0] == "on";
				await threadsData.set(threadID, { settings });
				message.reply(settings.sendWelcomeMessage ? getLang("turnedOn") : getLang("turnedOff"));
				break;
			}
			default:
				message.Guide();
				break;
		}
	}
};