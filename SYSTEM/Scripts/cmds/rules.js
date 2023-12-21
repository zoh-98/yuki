const { getPrefix } = global.utils;

module.exports = {
	config: {
		name: "قوانين",
    aliases: ["قواعد", "شروط", "rules"],
		version: "1.4",
		author: "Allou Mohamed",
		countDown: 5,
		role: 0,
		shortDescription: {
			vi: "Quy tắc của nhóm",
			ar: "قوانين المجموعة"
		},
		category: "المجموعة",
		guide: "   قواعد [أضف | -a] <القانون>: إضافة قانون جديد"
				+ "\n   قواعد: رؤية قواعد المجموعة"
				+ "\n   قواعد [عدل | -e] <رقم> <إستبدل القانون>: تعديل القانون برقم."
				+ "\n   قواعد [غيرمكان | -m] <2> <1> تغيير القاعدة 1 بمكان القاعدة رقم 2 <1> و <2>."
				+ "\n   قواعد [احذف | -d] <رقم>: حذف قانون رقم."
				+ "\n   قواعد [احذففف | -r]: حذف كل القوانين ."
				+ "\n"
				+ "\n   مثال:"
				+ "\n    قواعد اضف ممنوع سب البوت"
				+ "\n    قواعد غيرمكان 1 3"
				+ "\n    قواعد احذف 5"
				+ "\n    قواعد احذففف"
	},

	langs: {
		ar: {
			yourRules: "•-•-===قوانين المجموعة===-•-•\n%1\nمن يخالف ثلاث مرات بان نهائي❌",
			noRules: "لا تملكون قواعد أكتب قواعد أضف [القاعدة]",
			noPermissionAdd: "فقط الأدمن يضيف قواعد للمجموعة. أنت روح ضيف في المطبخ 😂",
			noContent: "أدخل القاعدة لو سمحت",
			success: "تم إضافة قانون جديد ✅",
			noPermissionEdit: "أنت لست أدمن 🌝💔😬❌",
			invalidNumber: "أدخل رقم القاعدة التي تريد تعديلها",
			rulesNotExist: "القاعدة رقم %1 غير موجودة هنا روح ضيف لك وحدة بهذا الرقم في المطبخ 😂❌",
			numberRules: "المجموعة مافيها هذا القانون ال**** المزيف بليز لا تطردوني 🌝",
			noContentEdit: "أدخل القانون الذي تعدل به هذا القانون : %1",
			successEdit: "تعديل القاعدة رقم %1 إلى: %2",
			noPermissionMove: "عالمطبخ ياحبيبي سوي أي شي بقوانينه هناك 🙂✅ أنت مش أدمن هنا",
			invalidNumberMove: "أدخل قانونين تريد تغيير تبديل أماكنهما",
			rulesNotExistMove2: "من وين جبت هذه الأرقام 🐸 طيبة قلب سانجي ؟",
			successMove: "تم تغيير أماكن القوانين %1 و %2",
			noPermissionDelete: "قوانيننا لا يحذفها الأعضاء ❌",
			invalidNumberDelete: "أدخل رقم القاعدة التي تريد حذفها ✅",
			rulesNotExistDelete: "القاعدة رقم %1 ليست موجودة 🙂😬",
			successDelete: "حذف القانون رقم %1 للمجموعة, الذي يقول: %2",
			noPermissionRemove: "من أنت لتحذف القوانين كلها بدك طرد يا عضو 😬❌",
			confirmRemove: "⚠️ نظرا للجفاف العاطفي سوي قلب لهذه الرسالة كي أحذف كل القواعد 🥹🥹",
			successRemove: "تم وشكرا على القلب حبي ⁦(っ˘з(˘⌣˘ )⁩",
			invalidNumberView: "أدخل رقم القاعدة التي تريد رؤيتها ✅"
		}
	},

	atCall: async function ({ role, args, message, event, threadsData, getLang, commandName }) {
		const { threadID, senderID } = event;

		const type = args[0];
		const rulesOfThread = await threadsData.get(threadID, "data.rules", []);
		const totalRules = rulesOfThread.length;

		if (!type) {
			let i = 1;
			const msg = rulesOfThread.reduce((text, rules) => text += `${i++}. ${rules}\n`, "");
			message.reply(msg ? getLang("yourRules", msg) : getLang("noRules", getPrefix(threadID)), (err, info) => {
				global.YukiBot.atReply.set(info.messageID, {
					commandName: commandName,
					author: senderID,
					rulesOfThread,
					messageID: info.messageID
				});
			});
		}
		else if (["اضف", "-a"].includes(type)) {
			if (role < 1)
				return message.reply(getLang("noPermissionAdd"));
			if (!args[1])
				return message.reply(getLang("noContent"));
			rulesOfThread.push(args.slice(1).join(" "));
			try {
				await threadsData.set(threadID, rulesOfThread, "data.rules");
				message.reply(getLang("success"));
			}
			catch (err) {
				message.err(err);
			}
		}
		else if (["عدل", "-e"].includes(type)) {
			if (role < 1)
				return message.reply(getLang("noPermissionEdit"));
			const stt = parseInt(args[1]);
			if (stt === NaN)
				return message.reply(getLang("invalidNumber"));
			if (!rulesOfThread[stt - 1])
				return message.reply(`${getLang("rulesNotExist", stt)}, ${totalRules == 0 ? getLang("noRules") : getLang("numberRules", totalRules)}`);
			if (!args[2])
				return message.reply(getLang("noContentEdit", stt));
			const newContent = args.slice(2).join(" ");
			rulesOfThread[stt - 1] = newContent;
			try {
				await threadsData.set(threadID, rulesOfThread, "data.rules");
				message.reply(getLang("successEdit", stt, newContent));
			}
			catch (err) {
				message.err(err);
			}
		}
		else if (["غيرمكان", "-m"].includes(type)) {
			if (role < 1)
				return message.reply(getLang("noPermissionMove"));
			const stt1 = parseInt(args[1]);
			const stt2 = parseInt(args[2]);
			if (isNaN(stt1) || isNaN(stt2))
				return message.reply(getLang("invalidNumberMove"));
			if (!rulesOfThread[stt1 - 1] || !rulesOfThread[stt2 - 1]) {
				let msg = !rulesOfThread[stt1 - 1] ?
					!rulesOfThread[stt2 - 1] ?
						message.reply(getLang("rulesNotExistMove2", stt1, stt2)) :
						message.reply(getLang("rulesNotExistMove", stt1)) :
					message.reply(getLang("rulesNotExistMove", stt2));
				msg += `, ${totalRules == 0 ? getLang("noRules") : getLang("numberRules", totalRules)}`;
				return message.reply(msg);
			}
			// swap
			[rulesOfThread[stt1 - 1], rulesOfThread[stt2 - 1]] = [rulesOfThread[stt2 - 1], rulesOfThread[stt1 - 1]];
			try {
				await threadsData.set(threadID, rulesOfThread, "data.rules");
				message.reply(getLang("successMove"));
			}
			catch (err) {
				message.err(err);
			}
		}
		else if (["احذف", "del", "-d"].includes(type)) {
			if (role < 1)
				return message.reply(getLang("noPermissionDelete"));
			if (!args[1] || isNaN(args[1]))
				return message.reply(getLang("invalidNumberDelete"));
			const rulesDel = rulesOfThread[parseInt(args[1]) - 1];
			if (!rulesDel)
				return message.reply(`${getLang("rulesNotExistDelete", args[1])}, ${totalRules == 0 ? getLang("noRules") : getLang("numberRules", totalRules)}`);
			rulesOfThread.splice(parseInt(args[1]) - 1, 1);
			await threadsData.set(threadID, rulesOfThread, "data.rules");
			message.reply(getLang("successDelete", args[1], rulesDel));
		}
		else if (["احذففف", "reset", "-r", "-rm"].includes(type)) {
			if (role < 1)
				return message.reply(getLang("noPermissionRemove"));
			message.reply(getLang("confirmRemove"), (err, info) => {
				global.YukiBot.atReact.set(info.messageID, {
					commandName: "قوانين",
					messageID: info.messageID,
					author: senderID
				});
			});
		}
		else if (!isNaN(type)) {
			let msg = "";
			for (const stt of args) {
				const rules = rulesOfThread[parseInt(stt) - 1];
				if (rules)
					msg += `${stt}. ${rules}\n`;
			}
			if (msg == "")
				return message.reply(`${getLang("rulesNotExist", type)}, ${totalRules == 0 ? getLang("noRules") : getLang("numberRules", totalRules)}`);
			message.reply(msg);
		}
		else {
			message.SyntaxError();
		}
	},

	atReply: async function ({ message, event, getLang, Reply }) {
		const { author, rulesOfThread } = Reply;
		if (author != event.senderID)
			return;
		const num = parseInt(event.body || "");
		if (isNaN(num) || num < 1)
			return message.reply(getLang("invalidNumberView"));
		const totalRules = rulesOfThread.length;
		if (num > totalRules)
			return message.reply(`${getLang("rulesNotExist", num)}, ${totalRules == 0 ? getLang("noRules") : getLang("numberRules", totalRules)}`);
		message.reply(`${num}. ${rulesOfThread[num - 1]}`, () => message.unsend(Reply.messageID));
	},

	atReact: async ({ threadsData, message, Reaction, event, getLang }) => {
		const { author } = Reaction;
		const { threadID, userID } = event;
		if (author != userID)
			return;
		await threadsData.set(threadID, [], "data.rules");
		message.reply(getLang("successRemove"));
	}
};
      