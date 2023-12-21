const { getTime } = global.utils;

module.exports = {
	config: {
		name: "تحذير",
		version: "1.6",
		author: "Allou Mohamed",
		countDown: 5,
		role: 0,
		shortDescription: {
			ar: "تحذير الأعضاء"
		},
		category: "المجموعة",
		guide: "   {pn} @tag <reason>: warn member"
				+ "\n   {pn} list: view list of warned members"
				+ "\n   {pn} listban: view list of banned members"
				+ "\n   {pn} info [@tag | <uid> | reply | leave blank]: view warning information of tagged person or uid or yourself"
				+ "\n   {pn} unban [@tag | <uid> | reply | leave blank]: unban member, at the same time remove all warnings of that member"
				+ "\n   {pn} unwarn [@tag | <uid> | reply | leave blank] [<number> | leave blank]: remove warning of member by uid and number of warning, if leave blank will remove the last warning"
				+ "\n   {pn} reset: reset all warn data"
				+ "\n⚠️ You need to set admin for bot to auto kick banned members"
	},

	langs: {
    ar: {
        list: "قائمة الأعضاء الذين تم تحذيرهم:\n%1\n\nلعرض تفاصيل التحذيرات، استخدم الأمر \"%2warn info [@tag | <uid> | اتركه فارغاً]\": لعرض معلومات التحذير للشخص الموسوم أو رقم التعريف أو لنفسك",
        listBan: "قائمة الأعضاء الذين تم تحذيرهم 3 مرات وحضروا من الصندوق:\n%1",
        listEmpty: "ليس لديك أعضاء تم تحذيرهم في مجموعتك",
        listBanEmpty: "ليس لديك أعضاء محظورين من الصندوق في مجموعتك",
        invalidUid: "الرجاء إدخال رقم تعريف صالح للشخص الذي تريد رؤية معلوماته",
        noData: "لا توجد بيانات",
        noPermission: "❌ | يمكن لمسؤولي المجموعة فقط رفع الحظر عن الأعضاء المحظورين من الصندوق",
        invalidUid2: "⚠️ |  الرجاء إدخال رقم تعريف صالح للشخص الذي تريد رفع الحظر عنه",
        notBanned: "⚠️ | المستخدم بالرقم التعريفي %1 لم يتم حظره من صندوق الدردشة الخاص بك",
        unbanSuccess: "✅ | تم رفع حظر العضو [%1 | %2] بنجاح، حالياً يمكن لهذا الشخص الانضمام إلى صندوق الدردشة",
        noPermission2: "❌ يمكن لمسؤولي المجموعة فقط إزالة التحذيرات من الأعضاء في المجموعة",
        invalidUid3: "⚠️ | الرجاء إدخال رقم تعريف أو وسم الشخص الذي تريد إزالة التحذير عنه",
        noData2: "⚠️ | المستخدم بالرقم التعريفي %1 لا يحتوي على بيانات تحذير",
        notEnoughWarn: "❌ | المستخدم %1 لديه فقط %2 تحذير",
        unwarnSuccess: "✅ | تمت إزالة التحذير %1 بنجاح من العضو [%2 | %3]",
        noPermission3: "❌ | يمكن لمسؤولي المجموعة فقط إعادة تعيين بيانات التحذير",
        resetWarnSuccess: "✅ | تم إعادة تعيين بيانات التحذير بنجاح",
        noPermission4: "❌ | يمكن لمسؤولي المجموعة فقط تحذير الأعضاء في المجموعة",
        invalidUid4: "⚠️ | يجب عليك وسم أو الرد على رسالة الشخص الذي تريد تحذيره",
        warnSuccess: "⚠️ | تم تحذير العضو %1 مرات %2\n- رقم التعريف: %3\n- السبب: %4\n- تاريخ الوقت: %5\nتم تحذير هذا العضو 3 مرات وحظره من الصندوق، لرفع الحظر استخدم الأمر \"%6warn unban <uid>\" (مع رقم التعريف الخاص بالشخص الذي تريد رفع الحظر عنه)",
        noPermission5: "⚠️ | يحتاج البوت إلى صلاحيات المسؤول لطرد الأعضاء المحظورين",
        warnSuccess2: "⚠️ | تم تحذير العضو %1 مرات %2\n- رقم التعريف: %3\n- السبب: %4\n- تاريخ الوقت: %5\nإذا ارتكب هذا الشخص %6 مرات أخرى، سيتم حظره من الصندوق",
        hasBanned: "⚠️ | التالي هم الأعضاء الذين تم تحذيرهم 3 مرات من قبل وتم حظرهم من الصندوق:\n%1",
        failedKick: "⚠️ | حدث خطأ عند طرد الأعضاء التاليين:\n%1",
        userNotInGroup: "⚠️ | المستخدم \"%1\" غير متواجد حاليًا في مجموعتك"
    }
	},

	atCall: async function ({ message, api, event, args, threadsData, usersData, prefix, role, getLang }) {
		if (!args[0])
			return message.Guide();
		const { threadID, senderID } = event;
		const warnList = await threadsData.get(threadID, "data.warn", []);

		switch (args[0]) {
			case "قائمة": {
				const msg = await Promise.all(warnList.map(async user => {
					const { uid, list } = user;
					const name = await usersData.getName(uid);
					return `${name} (${uid}): ${list.length}`;
				}));
				message.reply(msg.length ? getLang("list", msg.join("\n"), prefix) : getLang("listEmpty"));
				break;
			}
			case "قائمةالبان": {
				const result = (await Promise.all(warnList.map(async user => {
					const { uid, list } = user;
					if (list.length >= 3) {
						const name = await usersData.getName(uid);
						return `${name} (${uid})`;
					}
				}))).filter(item => item);
				message.reply(result.length ? getLang("listBan", result.join("\n")) : getLang("listBanEmpty"));
				break;
			}
			case "تفقد":
			case "معلومات": {
				let uids, msg = "";
				if (Object.keys(event.mentions).length)
					uids = Object.keys(event.mentions);
				else if (event.messageReply?.senderID)
					uids = [event.messageReply.senderID];
				else if (args.slice(1).length)
					uids = args.slice(1);
				else
					uids = [senderID];

				if (!uids)
					return message.reply(getLang("invalidUid"));
				msg += (await Promise.all(uids.map(async uid => {
					if (isNaN(uid))
						return null;
					const dataWarnOfUser = warnList.find(user => user.uid == uid);
					let msg = `المعرف: ${uid}`;
					const userName = await usersData.getName(uid);

					if (!dataWarnOfUser || dataWarnOfUser.list.length == 0)
						msg += `\n  الإسم: ${userName}\n  ${getLang("noData")}`;
					else {
						msg += `\nالإسم ${userName}`
							+ `\nالقائمة :` + dataWarnOfUser.list.reduce((acc, warn) => {
								const { dateTime, reason } = warn;
								return acc + `\n  - السبب: ${reason}\n    التاريخ: ${dateTime}`;
							}, "");
					}
					return msg;
				}))).filter(msg => msg).join("\n\n");
				message.reply(msg);
				break;
			}
			case "فك": {
				if (role < 1)
					return message.reply(getLang("noPermission"));
				let uidUnban;
				if (Object.keys(event.mentions).length)
					uidUnban = Object.keys(event.mentions)[0];
				else if (event.messageReply?.senderID)
					uidUnban = event.messageReply.senderID;
				else if (args.slice(1).length)
					uidUnban = args.slice(1);
				else
					uidUnban = senderID;

				if (!uidUnban || isNaN(uidUnban))
					return message.reply(getLang("invalidUid2"));

				const index = warnList.findIndex(user => user.uid == uidUnban && user.list.length >= 3);
				if (index === -1)
					return message.reply(getLang("notBanned", uidUnban));

				warnList.splice(index, 1);
				await threadsData.set(threadID, warnList, "data.warn");
				const userName = await usersData.getName(uidUnban);
				message.reply(getLang("unbanSuccess", uidUnban, userName));
				break;
			}
			case "نووارن": {
				if (role < 1)
					return message.reply(getLang("noPermission2"));
				let uid, num;
				if (Object.keys(event.mentions)[0]) {
					uid = Object.keys(event.mentions)[0];
					num = args[args.length - 1];
				}
				else if (event.messageReply?.senderID) {
					uid = event.messageReply.senderID;
					num = args[1];
				}
				else {
					uid = args[1];
					num = parseInt(args[2]) - 1;
				}

				if (isNaN(uid))
					return message.reply(getLang("invalidUid3"));

				const dataWarnOfUser = warnList.find(u => u.uid == uid);
				if (!dataWarnOfUser?.list.length)
					return message.reply(getLang("noData2", uid));

				if (isNaN(num))
					num = dataWarnOfUser.list.length - 1;

				const userName = await usersData.getName(uid);
				if (num > dataWarnOfUser.list.length)
					return message.reply(getLang("notEnoughWarn", userName, dataWarnOfUser.list.length));

				dataWarnOfUser.list.splice(parseInt(num), 1);
				if (!dataWarnOfUser.list.length)
					warnList.splice(warnList.findIndex(u => u.uid == uid), 1);
				await threadsData.set(threadID, warnList, "data.warn");
				message.reply(getLang("unwarnSuccess", num + 1, uid, userName));
				break;
			}
			case "تصفير": {
				if (role < 1)
					return message.reply(getLang("noPermission3"));
				await threadsData.set(threadID, [], "data.warn");
				message.reply(getLang("resetWarnSuccess"));
				break;
			}
			default: {
				if (role < 1)
					return message.reply(getLang("noPermission4"));
				let reason, uid;
				if (event.messageReply) {
					uid = event.messageReply.senderID;
					reason = args.join(" ").trim();
				}
				else if (Object.keys(event.mentions)[0]) {
					uid = Object.keys(event.mentions)[0];
					reason = args.join(" ").replace(event.mentions[uid], "").trim();
				}
				else {
					return message.reply(getLang("invalidUid4"));
				}
				if (!reason)
					reason = "No reason";
				const dataWarnOfUser = warnList.find(item => item.uid == uid);
				const dateTime = getTime("DD/MM/YYYY hh:mm:ss");
				if (!dataWarnOfUser)
					warnList.push({
						uid,
						list: [{ reason, dateTime, warnBy: senderID }]
					});
				else
					dataWarnOfUser.list.push({ reason, dateTime, warnBy: senderID });

				await threadsData.set(threadID, warnList, "data.warn");

				const times = dataWarnOfUser?.list.length ?? 1;

				const userName = await usersData.getName(uid);
				if (times >= 3) {
					message.reply(getLang("warnSuccess", userName, times, uid, reason, dateTime, prefix), () => {
						api.removeUserFromGroup(uid, threadID, async (err) => {
							if (err) {
								const members = await threadsData.get(event.threadID, "members");
								if (members.find(item => item.userID == uid)?.inGroup) // check if user is still in group
									return message.reply(getLang("userNotInGroup", userName));
								else
									return message.reply(getLang("noPermission5"), (e, info) => {
										const { Event } = global.YukiBot;
										Event.push({
											messageID: info.messageID,
											onListen: async ({ event }) => {
												if (event.logMessageType === "log:thread-admins" && event.logMessageData.ADMIN_EVENT == "add_admin") {
													const { TARGET_ID } = event.logMessageData;
													if (TARGET_ID == api.getCurrentUserID()) {
														const warnList = await threadsData.get(event.threadID, "data.warn", []);
														if ((warnList.find(user => user.uid == uid)?.list.length ?? 0) <= 3)
															global.YukiBot.Event = Event.filter(item => item.messageID != info.messageID);
														else
															api.removeUserFromGroup(uid, event.threadID, () => global.YukiBot.Event = Event.filter(item => item.messageID != info.messageID));
													}
												}
											}
										});
									});
							}
						});
					});
				}
				else
					message.reply(getLang("warnSuccess2", userName, times, uid, reason, dateTime, 3 - (times)));
			}
		}
	},

	atEvent: async ({ event, threadsData, usersData, message, api, getLang }) => {
		const { logMessageType, logMessageData } = event;
		if (logMessageType === "log:subscribe") {
			return async () => {
				const { data, adminIDs } = await threadsData.get(event.threadID);
				const warnList = data.warn || [];
				if (!warnList.length)
					return;
				const { addedParticipants } = logMessageData;
				const hasBanned = [];

				for (const user of addedParticipants) {
					const { userFbId: uid } = user;
					const dataWarnOfUser = warnList.find(item => item.uid == uid);
					if (!dataWarnOfUser)
						continue;
					const { list } = dataWarnOfUser;
					if (list.length >= 3) {
						const userName = await usersData.getName(uid);
						hasBanned.push({
							uid,
							name: userName
						});
					}
				}

				if (hasBanned.length) {
					await message.send(getLang("hasBanned", hasBanned.map(item => `  - ${item.name} (uid: ${item.uid})`).join("\n")));
					if (!adminIDs.includes(api.getCurrentUserID()))
						message.reply(getLang("noPermission5"), (e, info) => {
							const { Event } = global.YukiBot;
							Event.push({
								messageID: info.messageID,
								onListen: async ({ event }) => {
									if (
										event.logMessageType === "log:thread-admins"
										&& event.logMessageData.ADMIN_EVENT == "add_admin"
										&& event.logMessageData.TARGET_ID == api.getCurrentUserID()
									) {
										const threadData = await threadsData.get(event.threadID);
										const warnList = threadData.data.warn;
										const members = threadData.members;
										removeUsers(hasBanned, warnList, api, event, message, getLang, members);
										global.YukiBot.Event = Event.filter(item => item.messageID != info.messageID);
									}
								}
							});
						});
					else {
						const members = await threadsData.get(event.threadID, "members");
						removeUsers(hasBanned, warnList, api, event, message, getLang, members);
					}
				}
			};
		}
	}
};

async function removeUsers(hasBanned, warnList, api, event, message, getLang, members) {
	const failed = [];
	for (const user of hasBanned) {
		if (members.find(item => item.userID == user.uid)?.inGroup) { // check if user is still in group
			try {
				if (warnList.find(item => item.uid == user.uid)?.list.length ?? 0 >= 3)
					await api.removeUserFromGroup(user.uid, event.threadID);
			}
			catch (e) {
				failed.push({
					uid: user.uid,
					name: user.name
				});
			}
		}
	}
	if (failed.length)
		message.reply(getLang("failedKick", failed.map(item => `  - ${item.name} (uid: ${item.uid})`).join("\n")));
}