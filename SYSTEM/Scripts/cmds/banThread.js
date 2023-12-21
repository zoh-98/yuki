const { getTime } = global.utils;

module.exports = {
	config: {
		name: "مجموعة",
		version: "1.4",
		author: "Allou Mohamed",
		countDown: 5,
		role: 0,
		shortDescription: "إدارة المجموعات",
		category: "المطور",
		guide: "بان | فك => معرف",
    usePrefix: true
	},

	langs: {
		ar: {
			noPermission: "ليس لديك إذن لاستخدام هذه الميزة",
			found: "🔎 تم العثور على %1 مجموعة تطابق الكلمة الرئيسية \"%2\" في بيانات الروبوت:\n%3",
			notFound: "❌ لم يتم العثور على أي مجموعة تطابق الكلمة الرئيسية: \"%1\" في بيانات الروبوت",
			hasBanned: "تم حظر المجموعة بالمعرف [%1 | %2] من قبل:\n» السبب: %3\n» الوقت: %4",
			banned: "تم حظر المجموعة بالمعرف [%1 | %2] باستخدام الروبوت.\n» السبب: %3\n» الوقت: %4",
			notBanned: "المجموعة بالمعرف [%1 | %2] غير محظورة باستخدام الروبوت",
			unbanned: "تم إلغاء حظر المجموعة بالمعرف [%1 | %2] باستخدام الروبوت",
			missingReason: "لا يمكن أن يكون سبب الحظر فارغًا",
			info: "» معرف المجموعة: %1\n» الاسم: %2\n» تاريخ إنشاء البيانات: %3\n» إجمالي الأعضاء: %4\n» الذكور: %5 أعضاء\n» الإناث: %6 أعضاء\n» إجمالي الرسائل: %7%8"
        }
  },

	atCall: async function ({ args, threadsData, message, role, event, getLang }) {
		const type = args[0];

		switch (type) {
			// find thread
			case "بحث":
			case "ايجاد":
			case "-f":
			case "-s": {
				if (role < 2)
					return message.reply(getLang("noPermission"));
				let allThread = await threadsData.getAll();
				let keyword = args.slice(1).join(" ");
				if (['-j', '-join'].includes(args[1])) {
					allThread = allThread.filter(thread => thread.members.some(member => member.userID == global.GoatBot.botID && member.inGroup));
					keyword = args.slice(2).join(" ");
				}
				const result = allThread.filter(item => item.threadID.length > 15 && (item.threadName || "").toLowerCase().includes(keyword.toLowerCase()));
				const resultText = result.reduce((i, thread) => i += `\n• الإسم: ${thread.threadName}\n• المعرف: ${thread.threadID}`, "");
				let msg = "";
				if (result.length > 0)
					msg += getLang("found", result.length, keyword, resultText);
				else
					msg += getLang("notFound", keyword);
				message.reply(msg);
				break;
			}
			// ban thread
			case "بان":
			case "حضر": {
				if (role < 2)
					return message.reply(getLang("noPermission"));
				let tid, reason;
				if (!isNaN(args[1])) {
					tid = args[1];
					reason = args.slice(2).join(" ");
				}
				else {
					tid = event.threadID;
					reason = args.slice(1).join(" ");
				}
				if (!tid)
					return message.SyntaxError();
				if (!reason)
					return message.reply(getLang("missingReason"));
				reason = reason.replace(/\s+/g, ' ');
				const threadData = await threadsData.get(tid);
				const name = threadData.threadName;
				const status = threadData.banned.status;

				if (status)
					return message.reply(getLang("hasBanned", tid, name, threadData.banned.reason, threadData.banned.date));
				const time = getTime("DD/MM/YYYY HH:mm:ss");
				await threadsData.set(tid, {
					banned: {
						status: true,
						reason,
						date: time
					}
				});
				return message.reply(getLang("banned", tid, name, reason, time));
			}
			// unban thread
			case "فك":
			case "-u": {
				if (role < 2)
					return message.reply(getLang("noPermission"));
				let tid;
				if (!isNaN(args[1]))
					tid = args[1];
				else
					tid = event.threadID;
				if (!tid)
					return message.SyntaxError();

				const threadData = await threadsData.get(tid);
				const name = threadData.threadName;
				const status = threadData.banned.status;

				if (!status)
					return message.reply(getLang("notBanned", tid, name));
				await threadsData.set(tid, {
					banned: {}
				});
				return message.reply(getLang("unbanned", tid, name));
			}
			// info thread
			case "معلومات":
			case "-i": {
				let tid;
				if (!isNaN(args[1]))
					tid = args[1];
				else
					tid = event.threadID;
				if (!tid)
					return message.SyntaxError();
				const threadData = await threadsData.get(tid);
				const createdDate = getTime(threadData.createdAt, "DD/MM/YYYY HH:mm:ss");
				const valuesMember = Object.values(threadData.members).filter(item => item.inGroup);
				const totalBoy = valuesMember.filter(item => item.gender == "MALE").length;
				const totalGirl = valuesMember.filter(item => item.gender == "FEMALE").length;
				const totalMessage = valuesMember.reduce((i, item) => i += item.count, 0);
				const infoBanned = threadData.banned.status ?
					`\n- محظورة: ${threadData.banned.status}`
					+ `\n- السبب: ${threadData.banned.reason}`
					+ `\n- الوقت: ${threadData.banned.date}` :
					"";
				const msg = getLang("info", threadData.threadID, threadData.threadName, createdDate, valuesMember.length, totalBoy, totalGirl, totalMessage, infoBanned);
				return message.reply(msg);
			}
			default:
				return message.reply('مثال: مجموعة بان سبام\nمجموعة بان 2000038 سبام');
		}
	}
};