const { getStreamFromURL } = global.utils;

module.exports = {
	config: {
		name: "آيدي",
		version: "1.2",
		author: "Løü Fï | allou Mohamed",
		countDown: 5,
		role: 0,
		shortDescription: "آيدي .-.",
		category: "الألعاب",
		guide: {
			vi: "   {pn}: dùng để xem số lượng tin nhắn của bạn"
				+ "\n   {pn} @tag: dùng để xem số lượng tin nhắn của những người được tag"
				+ "\n   {pn} all: dùng để xem số lượng tin nhắn của tất cả thành viên",
			en: "   {pn}: آيديك"
				+ "\n   {pn} @تاغ: بالتاغ"
				+ "\n   {pn} الكل: رؤية مجموع رسائل الكل .-."
		}
	},

	langs: {
		vi: {
			count: "Số tin nhắn của các thành viên:",
			endMessage: "Những người không có tên trong danh sách là chưa gửi tin nhắn nào.",
			page: "Trang [%1/%2]",
			reply: "Phản hồi tin nhắn này kèm số trang để xem tiếp",
			result: "%1 hạng %2 với %3 tin nhắn",
			yourResult: "Bạn đứng hạng %1 và đã gửi %2 tin nhắn trong nhóm này",
			invalidPage: "Số trang không hợp lệ"
		},
		ar: {
			count: "عدد رسائله .-.:",
			endMessage: "من لا يوجد إسمه أطرد جده .-..",
			page: "الصفحة [%1/%2]",
			reply: "رد على هذه الرسالة برقم صفحة لرؤية المزيد .-.",
			result: "%1 ترتيبه %2 لأن عدد رسائله %3 رسالة.",
			yourResult: "You are ranked %1 and have sent %2 messages in this group",
			invalidPage: "صفحة مش موجود ترا 🌝"
		}
	},

	atCall: async function ({ args, threadsData, message, event, api, commandName, getLang, usersData }) {

//////
    let deltaNext = 5;
const expToLevel = (exp, deltaNextLevel = deltaNext) => Math.floor((1 + Math.sqrt(1 + 8 * exp / deltaNextLevel)) / 2);

const exp = await usersData.get(event.senderID, "exp");
const levelUser = expToLevel(exp, deltaNext);

/////
    const userMoney = await usersData.get(event.senderID, "money");
    const userExp = await usersData.get(event.senderID, "exp");
    
    const userName = await usersData.get(event.senderID, "data.username") || await usersData.getName(event.senderID);
       
    const rrrrr = await usersData.get(event.senderID, "data.reactions") || 0;



    const avatarUrl = await usersData.getAvatarUrl(event.senderID);
    let profilePic = await getStreamFromURL(avatarUrl);
    let rank;
  if (userExp >= 80000) {
    rank = "1 | جراند ماستر 🥇";
  } else if (userExp >= 70000) {
    rank = "2 | ماستر 🥈";
  } else if (userExp >= 60000) {
    rank = "3 | جنرال 🏅";
  } else if (userExp >= 50000) {
    rank = "4 | عقيد 🎖️";
  } else if (userExp >= 40000) {
    rank = "5 | أسطورة التفاعل";
  } else if (userExp >= 30000) {
    rank = "6 | ملك";
  } else if (userExp >= 20000) {
    rank = "7 | وزير";
  } else if (userExp >= 10000) {
    rank = "8 | راديوا";
  } else if (userExp >= 5000) {
    rank = "9 | متفاعل قوي";
  } else if (userExp >= 1000) {
    rank = "10 | متفاعل";
  } else if (userExp >= 1) {
    rank = "11 | مبتدأ";
  } else {
    rank = "12 | صنم 🗿";
  }
    
		const { threadID, senderID } = event;
		const threadData = await threadsData.get(threadID);
		const { members } = threadData;
		const usersInGroup = (await api.getThreadInfo(threadID)).participantIDs;
		let arraySort = [];
		for (const user of members) {
			if (!usersInGroup.includes(user.userID))
				continue;
			const charac = "️️️️️️️️️️️️️️️️️"; // This character is banned from facebook chat (it is not an empty string)
			arraySort.push({
				name: user.name.includes(charac) ? `•المعرف: ${user.userID}` : user.name,
				count: user.count,
				uid: user.userID
			});
		}
		let stt = 1;
		arraySort.sort((a, b) => b.count - a.count);
		arraySort.map(item => item.stt = stt++);

		if (args[0]) {
			if (args[0].toLowerCase() == "الكل") {
				let msg = getLang("count");
				const endMessage = getLang("endMessage");
				for (const item of arraySort) {
					if (item.count > 0)
						msg += `\n${item.stt}/ ${item.name}: ${item.count}`;
				}

				if ((msg + endMessage).length > 19999) {
					msg = "";
					let page = parseInt(args[1]);
					if (isNaN(page))
						page = 1;
					const splitPage = global.utils.splitPage(arraySort, 50);
					arraySort = splitPage.allPage[page - 1];
					for (const item of arraySort) {
						if (item.count > 0)
							msg += `\n${item.stt}/ ${item.name}: ${item.count}`;
					}
					msg += getLang("page", page, splitPage.totalPage)
						+ `\n${getLang("reply")}`
						+ `\n\n${endMessage}`;

					return message.reply(msg, (err, info) => {
						if (err)
							return message.err(err);
						global.YukiBot.atReply.set(info.messageID, {
							commandName,
							messageID: info.messageID,
							splitPage,
							author: senderID
						});
					});
				}
				message.reply(msg);
			}
			else if (event.mentions) {
				let msg = "";
				for (const id in event.mentions) {
					const findUser = arraySort.find(item => item.uid == id);
					msg += `\n${getLang("result", findUser.name, findUser.stt, findUser.count)}`;
				}
				message.reply(msg);
			}
		}
		else {
			const findUser = arraySort.find(item => item.uid == senderID) || {};
			return message.reply({body: "•الإسم 👤:" + "【" + userName + "】" + "\n" + "•الرصيد 💸:" + "【" + userMoney + " 𝗗𝗮 】" + "\n" + "•عدد الرسائل 💌:" + "【" + findUser.count + "】" + "\n" + "•ترتيبك 👥:" + "【" + findUser.stt + "】" + "\n" + "•الرتبة: 🏆" + "【" + rank + "】\n" + "•عدد نقاط المستوى: 🎭" + "【" + userExp + " 𝗘𝘅𝗽 】\n" + "•مستواك حسب نقاطك: ⚔️" + "【" + levelUser + "】" + "\n" + "•عدد الرياكشنات 👾:" + "【" + rrrrr + "】", attachment : profilePic });
		}
	},

	atReply: ({ message, event, Reply, commandName, getLang }) => {
		const { senderID, body } = event;
		const { author, splitPage } = Reply;
		if (author != senderID)
			return;
		const page = parseInt(body);
		if (isNaN(page) || page < 1 || page > splitPage.totalPage)
			return message.reply(getLang("invalidPage"));
		let msg = getLang("count");
		const endMessage = getLang("endMessage");
		const arraySort = splitPage.allPage[page - 1];
		for (const item of arraySort) {
			if (item.count > 0)
				msg += `\n${item.stt}/ ${item.name}: ${item.count}`;
		}
		msg += getLang("page", page, splitPage.totalPage)
			+ "\n" + getLang("reply")
			+ "\n\n" + endMessage;
		message.reply(msg, (err, info) => {
			if (err)
				return message.err(err);
			message.unsend(Reply.messageID);
			global.GoatBot.onReply.set(info.messageID, {
				commandName,
				messageID: info.messageID,
				splitPage,
				author: senderID
			});
		});
	},

	atChat: async ({ usersData, threadsData, event }) => {
		const { senderID, threadID } = event;
		const members = await threadsData.get(threadID, "members");
		const findMember = members.find(user => user.userID == senderID);
		if (!findMember) {
			members.push({
				userID: senderID,
				name: await usersData.getName(senderID),
				nickname: null,
				inGroup: true,
				count: 1
			});
		}
		else
			findMember.count += 1;
		await threadsData.set(threadID, members, "members");
    
	}
};
      