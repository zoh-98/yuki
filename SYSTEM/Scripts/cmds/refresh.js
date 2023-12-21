module.exports = {
	config: {
		name: "تحديث",
		version: "1.1",
		author: "Allou Mohamed",
		countDown: 60,
		role: 0,
		shortDescription: "ينصح به عندما تغير الأدمن ✅",
		category: "المجموعة",
		guide: "تحديث المجموعة | المستخدم",
    usePrefix: true
	},


	atCall: async function ({ args, threadsData, message, event, usersData }) {
		if (args[0] == "المجموعة" || args[0] == "جروب") {
			const targetID = args[1] || event.threadID;
			try {
				await threadsData.refreshInfo(targetID);
				return message.reply(targetID == event.threadID ? "✅ | تم تحديث المعلومات بنجاح!" : `✅ | تحديث مجموعة ${threadID} بنجاح`);
			}
			catch (error) {
				return message.reply(targetID == event.threadID ? "❌ | حدث خطأ حاول لاحقا" : `❌ | حدث خطأ مع ${threadID}`);
			}
		}
		else if (args[0] == "المستخدم") {
			let targetID = event.senderID;
			if (args[1]) {
				if (Object.keys(event.mentions).length)
					targetID = Object.keys(event.mentions)[0];
				else
					targetID = args[1];
			}
			try {
				await usersData.refreshInfo(targetID);
				return message.reply(targetID == event.senderID ? "✅ | تم تحديث معلومات المستخدمين!" : `✅ | تحديث معلومات ${targetID} بنجاح`);
			}
			catch (error) {
				return message.reply(targetID == event.senderID ? "❌ | حدث خطأ حاول لاحقا" : `❌ | حدث خطأ مع ${targetID}`);
			}
		}
		else
			message.reply('المستخدم أو المجموعة ؟');
	}
};