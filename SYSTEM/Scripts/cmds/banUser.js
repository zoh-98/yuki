const { getTime } = global.utils;

module.exports = {
	config: {
		name: "مستخدم",
		version: "1.3",
		author: "Allou Mohamed",
		countDown: 5,
		role: 2,
		shortDescription: "حضر من البوت",
		category: "المطور",
		guide: "بان | فك => معرف | سبب",
    usePrefix: true
	},

	langs: {
    ar: {
        noUserFound: "❌ لا يوجد مستخدم بالاسم الذي يطابق الكلمة الرئيسية: \"%1\" في بيانات البوت",
        userFound: "🔎 وجد %1 مستخدم بالاسم الذي يطابق الكلمة الرئيسية \"%2\" في بيانات البوت:\n%3",
        uidRequired: "Uid للمستخدم الذي سيتم حظره لا يمكن أن يكون فارغًا، يرجى إدخال Uid أو وسم أو الرد على رسالة من مستخدم باستخدام 'user ban <uid> <reason>'",
        reasonRequired: "لا يمكن ترك سبب حظر المستخدم فارغًا، يرجى إدخال Uid أو وسم أو الرد على رسالة من مستخدم باستخدام 'user ban <uid> <reason>'",
        userHasBanned: "تم حظر المستخدم بالرقم التعريفي [%1 | %2] من قبل:\n» السبب: %3\n» التاريخ: %4",
        userBanned: "تم حظر المستخدم بالرقم التعريفي [%1 | %2]:\n» السبب: %3\n» التاريخ: %4",
        uidRequiredUnban: "Uid للمستخدم الذي سيتم رفع حظره لا يمكن أن يكون فارغًا",
        userNotBanned: "المستخدم بالرقم التعريفي [%1 | %2] غير محظور",
        userUnbanned: "تم رفع حظر المستخدم بالرقم التعريفي [%1 | %2]"
    }
	},

	atCall: async function ({ args, usersData, message, event, prefix, getLang }) {
		const type = args[0];
		switch (type) {
			// find user
			case "بحث":
			case "-f":
			case "search":
			case "-s": {
				const allUser = await usersData.getAll();
				const keyWord = args.slice(1).join(" ");
				const result = allUser.filter(item => (item.name || "").toLowerCase().includes(keyWord.toLowerCase()));
				const msg = result.reduce((i, user) => i += `\n• الإسم: ${user.name}\n• المعرف: ${user.userID}`, "");
				message.reply(result.length == 0 ? getLang("noUserFound", keyWord) : getLang("userFound", result.length, keyWord, msg));
				break;
			}
			// ban user
			case "ban":
			case "بان": {
				let uid, reason;
				if (event.type == "message_reply") {
					uid = event.messageReply.senderID;
					reason = args.slice(1).join(" ");
				}
				else if (Object.keys(event.mentions).length > 0) {
					const { mentions } = event;
					uid = Object.keys(mentions)[0];
					reason = args.slice(1).join(" ").replace(mentions[uid], "");
				}
				else if (args[1]) {
					uid = args[1];
					reason = args.slice(2).join(" ");
				}
				else return message.SyntaxError();

				if (!uid)
					return message.reply(getLang("uidRequired"));
				if (!reason)
					return message.reply(getLang("reasonRequired", prefix));
				reason = reason.replace(/\s+/g, ' ');

				const userData = await usersData.get(uid);
				const name = userData.name;
				const status = userData.banned.status;

				if (status)
					return message.reply(getLang("userHasBanned", uid, name, userData.banned.reason, userData.banned.date));
				const time = getTime("DD/MM/YYYY HH:mm:ss");
				await usersData.set(uid, {
					banned: {
						status: true,
						reason,
						date: time
					}
				});
				message.reply(getLang("userBanned", uid, name, reason, time));
				break;
			}
			// unban user
			case "unban":
			case "فك": {
				let uid;
				if (event.type == "message_reply") {
					uid = event.messageReply.senderID;
				}
				else if (Object.keys(event.mentions).length > 0) {
					const { mentions } = event;
					uid = Object.keys(mentions)[0];
				}
				else if (args[1]) {
					uid = args[1];
				}
				else
					return message.SyntaxError();
				if (!uid)
					return message.reply(getLang("uidRequiredUnban"));
				const userData = await usersData.get(uid);
				const name = userData.name;
				const status = userData.banned.status;
				if (!status)
					return message.reply(getLang("userNotBanned", uid, name));
				await usersData.set(uid, {
					banned: {}
				});
				message.reply(getLang("userUnbanned", uid, name));
				break;
			}
			default:
				return message.reply('بان أو فك + إذا بان رد عشخص أو حط معرفه مع السبب');
		}
	}
};