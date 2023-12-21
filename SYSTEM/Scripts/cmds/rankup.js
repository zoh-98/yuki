const deltaNext = 5;
const expToLevel = exp => Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNext)) / 2);

module.exports = {
	config: {
		name: "الرانك",
    aliases: ["rank", "المستوى"],
		version: "1.2",
		author: "Allou Mohamed",
		countDown: 5,
		role: 0,
		shortDescription: {
			en: "تشغيل و إيقاف إشعار المستوى"
		},
		category: "الرانك",
		guide: {
			en: "{pn} [on | off]"
		}
	},

	langs: {
		ar: {
			turnedOn: "تم تشغيل إشعار المستوى | ✅",
			turnedOff: "تم إيقاف إشعار المستوى | ✅",
			notiMessage: "🏆 | إرتفع الرانك الخاص بك إلى %1"
		}
	},

	atCall: async function ({ message, event, threadsData, args, getLang }) {
		if (!["on", "off"].includes(args[0]))
			return message.Guide();
		await threadsData.set(event.threadID, args[0] == "on", "settings.sendRankupMessage");
		return message.reply(args[0] == "on" ? getLang("turnedOn") : getLang("turnedOff"));
	},

	atChat: async function ({ threadsData, usersData, event, message, getLang }) {
		const threadData = await threadsData.get(event.threadID);
		const sendRankupMessage = threadData.settings.sendRankupMessage;
		if (!sendRankupMessage)
			return;
		const { exp } = await usersData.get(event.senderID);
		const currentLevel = expToLevel(exp);
		if (currentLevel > expToLevel(exp - 1)) {
			const forMessage = {
				body: getLang("notiMessage", currentLevel)
			};
			message.reply(forMessage);
		}
	}
};