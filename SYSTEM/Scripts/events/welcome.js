const { getTime, getStreamFromURL } = global.utils;
if (!global.temp.welcomeEvent)
	global.temp.welcomeEvent = {};

module.exports = {
	config: {
		name: "welcome",
		version: "1.5",
		author: "Allou Mohamed",
		category: "events"
	},

	langs: {
  ar: {
		session1: "صباح",
		session2: "مساء",
		session3: "مساء",
		session4: "مساء",
		welcomeMessage: "🤖 تم توصيل الروبوت بنجاح\n 🙆 المطور: facebook.com/proArCoder\n📝 بوت قيد التطوير لذا اي مشكل قل للمطور يصلحه\n🌸🌝 يوما سعيدا لكم",
		multiple1: " ",
		multiple2: "م",
		defaultWelcomeMessage: ` أعضاء جدد 🌝: {userName} 🫂\n🔰 نورت{multiple} عائلة: {boxName} 🌃\n🙆 {session} الخير 🌝`
}
	},

	onRun: async function({ threadsData, message, event, api, getLang }) {
			return async function () {
        
		if (event.logMessageType != "log:subscribe") return;
				const hours = getTime("HH");
				const { threadID } = event;
				const { nickNameBot } = global.YukiBot.config;
				const prefix = global.utils.getPrefix(threadID);
				const dataAddedParticipants = event.logMessageData.addedParticipants;
				// if new member is bot
				if (dataAddedParticipants.some((item) => item.userFbId == api.getCurrentUserID())) {
					if (nickNameBot)
						api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
					return message.send({body: getLang("welcomeMessage", prefix), attachment: await getStreamFromURL ('https://i.ibb.co/sb7fBMY/368517504-168260926291434-2554379017632772114-n-jpg-stp-dst-jpg-p480x480-nc-cat-107-ccb-1-7-nc-sid-a.jpg')});
				}
				// if new member:
				if (!global.temp.welcomeEvent[threadID])
					global.temp.welcomeEvent[threadID] = {
						joinTimeout: null,
						dataAddedParticipants: []
					};

				global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...dataAddedParticipants);
				clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

				global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async function () {
					const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
					const threadData = await threadsData.get(threadID);
					const dataBanned = threadData.data.banned_ban || [];
					if (threadData.settings.sendWelcomeMessage == false)
						return;
					const threadName = threadData.threadName;
					const userName = [],
						mentions = [];
					let multiple = false;

					if (dataAddedParticipants.length > 1)
						multiple = true;

					for (const user of dataAddedParticipants) {
						if (dataBanned.some((item) => item.id == user.userFbId))
							continue;
						userName.push(user.fullName);
						mentions.push({
							tag: user.fullName,
							id: user.userFbId
						});
					}
					// {userName}:   name of new member
					// {multiple}:
					// {boxName}:    name of group
					// {threadName}: name of group
					// {session}:    session of day
					if (userName.length == 0) return;
					let { welcomeMessage = getLang("defaultWelcomeMessage") } =
						threadData.data;
					const form = {
						mentions: welcomeMessage.match(/\{userNameTag\}/g) ? mentions : null
					};
					welcomeMessage = welcomeMessage
						.replace(/\{userName\}|\{userNameTag\}/g, userName.join(", "))
						.replace(/\{boxName\}|\{threadName\}/g, threadName)
						.replace(
							/\{multiple\}/g,
							multiple ? getLang("multiple2") : getLang("multiple1")
						)
						.replace(
							/\{session\}/g,
							hours <= 10
								? getLang("session1")
								: hours <= 12
									? getLang("session2")
									: hours <= 18
										? getLang("session3")
										: getLang("session4")
						);

					form.body = welcomeMessage;

					/*if (threadData.data.welcomeAttachment) {
						const files = threadData.data.welcomeAttachment;
						const attachments = files.reduce((acc, file) => {
							acc.push(drive.getFile(file, "stream"));
							return acc;
						}, []);
						form.attachment = (await Promise.allSettled(attachments))
							.filter(({ status }) => status == "fulfilled")
							.map(({ value }) => value);
					}*/
					message.send(form);
					delete global.temp.welcomeEvent[threadID];
				}, 1500);
			};
	}
};
    