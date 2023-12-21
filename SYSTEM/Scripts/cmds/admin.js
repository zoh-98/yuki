const { config } = global.YukiBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "أدمن",
		version: "1.5",
		author: "Allou Mohamed",
		countDown: 5,
		role: 2,
		shortDescription: {
			en: "إضافة أدمن للبوت أو حذفه"
		},
		category: "المجموعة",
		guide: '   {pn} [add | -a] <uid | @tag>: Add admin role for user'
				+ '\n	  {pn} [remove | -r] <uid | @tag>: Remove admin role of user'
				+ '\n	  {pn} [list | -l]: List all admins',
      ar:  '   {pn} [add | أضف] <uid | @tag>: Add admin role for user'
				+ '\n	  {pn} [remove | -r] <uid | @tag>: Remove admin role of user'
				+ '\n	  {pn} [list | -l]: List all admins'
	},

	langs: {
    ar: {
			added: "✅ | تم جعل هاؤلاء أدمن:\n%2",
			alreadyAdmin: "\n⚠️ | %1 لديه منصب الأدمن :\n%2",
			missingIdAdd: "⚠️ | أدخل معرفه أو سوي تاغ.",
			removed: "✅ | تم حذف منصب الأدمن من %1 هذا :\n%2",
			notAdmin: "⚠️ | %1 مستخدم لا يملك أدمن :\n%2",
			missingIdRemove: "⚠️ | أدخل معرف من تريد حذفه ",
			listAdmin: "👑 | قائمة الأدمن:\n%1"
		}
	},

	atCall: async function ({ message, args, usersData, event, getLang }) {
		switch (args[0]) {
			case "أضف":
			case "-a": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);
					else if (event.messageReply)
						uids.push(event.messageReply.senderID);
					else
						uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.owners.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}

					config.owners.push(...notAdminIds);
					const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.YukiBot.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(notAdminIds.length > 0 ? getLang("added", notAdminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (adminIds.length > 0 ? getLang("alreadyAdmin", adminIds.length, adminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdAdd"));
			}
			case "حذف":
			case "-r": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions)[0];
					else
						uids = args.filter(arg => !isNaN(arg));
					const notAdminIds = [];
					const adminIds = [];
					for (const uid of uids) {
						if (config.owners.includes(uid))
							adminIds.push(uid);
						else
							notAdminIds.push(uid);
					}
					for (const uid of adminIds)
						config.owners.splice(config.owners.indexOf(uid), 1);
					const getNames = await Promise.all(adminIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
					writeFileSync(global.YukiBot.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(adminIds.length > 0 ? getLang("removed", adminIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (notAdminIds.length > 0 ? getLang("notAdmin", notAdminIds.length, notAdminIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				}
				else
					return message.reply(getLang("missingIdRemove"));
			}
			case "قائمة":
			case "-l": {
				const getNames = await Promise.all(config.owners.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
				return message.reply(getLang("listAdmin", getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")));
			}
			default:
				return message.Guide();
		}
	}
};