const fs = require("fs-extra");

module.exports = {
	config: {
		name: "ريلوود",
		version: "1.0",
		author: "Allou Mohamed",
		countDown: 5,
		role: 2,
		shortDescription: "إعادة تشغيل البوت ✅",
		category: "المطور",
		guide: "   رييلوود: إعادة تشغييل",
    usePrefix: true
	},

	
	onLoad: function ({ api }) {
		const pathFile = `${__dirname}/tmp/restart.txt`;
		if (fs.existsSync(pathFile)) {
			const [tid, time] = fs.readFileSync(pathFile, "utf-8").split(" ");
			api.sendMessage(`✅ | تم إعادة تشغيل البوت 🌝\n⏰ | الزمن: ${(Date.now() - time) / 1000} ثانية`, tid);
			fs.unlinkSync(pathFile);
		}
	},

	atCall: async function ({ message, event }) {
		const pathFile = `${__dirname}/tmp/restart.txt`;
		fs.writeFileSync(pathFile, `${event.threadID} ${Date.now()}`);
		await message.reply("🔁 | جاري إعادة تشغيل يوكي");
		process.exit(2);
	}
};