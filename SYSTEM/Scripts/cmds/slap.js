const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
	config: {
		name: "كف",
    aliases: ["صفع"],
		version: "1.1",
		author: "allou Mohamed",
		countDown: 5,
		role: 0,
		shortDescription: "صفع شخص معين وليس مربع",
		longDescription: "صفع صورة بات مان 🌝✅",
		category: "صور",
		guide: {
			en: "{pn}"
		}
	},

	langs: {
		vi: {
			noReply: "Bạn phải tag người bạn muốn tát"
		},
		ar: {
			noReply: "رد على من تريد صفعه 🌝"
		}
	},

	atCall: async function ({ event, message, usersData, args, getLang }) {
    
		const uid1 = event.senderID;
    if (event.type != "message_reply")
			return message.reply(getLang("noReply"));
		const uid2 = event.messageReply.senderID;
		
		const avatarURL1 = await usersData.getAvatarUrl(uid1);
		const avatarURL2 = await usersData.getAvatarUrl(uid2);
		const img = await new DIG.Batslap().getImage(avatarURL1, avatarURL2);
		const pathSave = `${__dirname}/tmp/${uid1}_${uid2}Batslap.png`;
		fs.writeFileSync(pathSave, Buffer.from(img));
		const content = args.join(' ').replace(Object.keys(event.mentions)[0], "");
		message.reply({
			body: `${(content || "إبلع يا حيوان 🌝")}`,
			attachment: fs.createReadStream(pathSave)
		}, () => fs.unlinkSync(pathSave));
	}
};