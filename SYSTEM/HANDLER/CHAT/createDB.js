const { db, utils, YukiBot } = global;
const { config } = YukiBot;
const { creatingThreadData, creatingUserData } = global.DBYUKI.database;

module.exports = async function (usersData, threadsData, event) {
	const { threadID, isGroup } = event;
	const senderID = event.senderID || event.author || event.userID;

	// ———————————— CHECK THREAD DATA ———————————— //
	if (threadID && isGroup) {
		try {
			if (global.temp.createThreadDataError.includes(threadID))
				return;

			const findInCreatingThreadData = creatingThreadData.find(t => t.threadID == threadID);
			if (!findInCreatingThreadData) {
				if (global.db.allThreadData.some(t => t.threadID == threadID))
					return;

				const threadData = await threadsData.create(threadID);
				global.YukiBot.logger(`New Thread: ${threadID} | ${threadData.threadName} | ${config.database.type}`, "DB");
			}
			else {
				await findInCreatingThreadData.promise;
			}
		}
		catch (err) {
			if (err.name != "DATA_ALREADY_EXISTS") {
				global.temp.createThreadDataError.push(threadID);
				//global.YukiBot.logger();
			}
		}
	}


	// ————————————— CHECK USER DATA ————————————— //
	if (senderID) {
		try {
			const findInCreatingUserData = creatingUserData.find(u => u.userID == senderID);
			if (!findInCreatingUserData) {
				if (db.allUserData.some(u => u.userID == senderID))
					return;

				const userData = await usersData.create(senderID);
				global.YukiBot.logger(`New User: ${senderID} | ${userData.name} | ${config.database.type}`, "DB");
			}
			else {
				await findInCreatingUserData.promise;
			}
		}
		catch (err) {
			if (err.name != "DATA_ALREADY_EXISTS") {
        return;
      }  
		}
	}
};