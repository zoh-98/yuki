const { existsSync, writeJsonSync, readJSONSync } = require("fs-extra");
const moment = require("moment-timezone");
const path = require("path");
const _ = require("lodash");
const { CustomError } = global.utils;
const optionsWriteJSON = {
	spaces: 2,
	EOL: "\n"
};

const messageQueue = global.utils.createQueue(async (task, callback) => {
	try {
		const result = await task();
		callback(null, result);
	}
	catch (err) {
		callback(err);
	}
});

const { creatingThreadData } = global.DBYUKI.database;

module.exports = async function (databaseType, threadModel, api, fakeGraphql) {
	let Threads = [];
	const pathThreadsData = path.join(__dirname, "..", "data/threadsData.json");

	switch (databaseType) {
		case "mongodb": {
			// delete keys '_id' and '__v' in all threads
			Threads = (await threadModel.find({}).lean()).map(thread => _.omit(thread, ["_id", "__v"]));
			break;
		}
		case "sqlite": {
			Threads = (await threadModel.findAll()).map(thread => thread.get({ plain: true }));
			break;
		}
		case "json": {
			if (!existsSync(pathThreadsData))
				writeJsonSync(pathThreadsData, [], optionsWriteJSON);
			Threads = readJSONSync(pathThreadsData);
			break;
		}
	}

	global.db.allThreadData = Threads;

	async function save(threadID, threadData, mode, path) {
		try {
			let index = _.findIndex(global.db.allThreadData, { threadID });
			if (index === -1 && mode === "update") {
				try {
					await create_(threadID);
					index = _.findIndex(global.db.allThreadData, { threadID });
				}
				catch (err) {
					throw new CustomError({
						name: "THREAD_NOT_EXIST",
						message: `Can't find thread with threadID: ${threadID} in database`
					});
				}
			}

			switch (mode) {
				case "create": {
					switch (databaseType) {
						case "mongodb":
						case "sqlite": {
							let dataCreated = await threadModel.create(threadData);
							dataCreated = databaseType == "mongodb" ?
								_.omit(dataCreated._doc, ["_id", "__v"]) :
								dataCreated.get({ plain: true });
							global.db.allThreadData.push(dataCreated);
							return _.cloneDeep(dataCreated);
						}
						case "json": {
							const timeCreate = moment.tz().format();
							threadData.createdAt = timeCreate;
							threadData.updatedAt = timeCreate;
							global.db.allThreadData.push(threadData);
							writeJsonSync(pathThreadsData, global.db.allThreadData, optionsWriteJSON);
							return _.cloneDeep(threadData);
						}
						default: {
							break;
						}
					}
					break;
				}
				case "update": {
					const oldThreadData = global.db.allThreadData[index];
					const dataWillChange = {};

					if (Array.isArray(path) && Array.isArray(threadData)) {
						path.forEach((p, index) => {
							const key = p.split(".")[0];
							dataWillChange[key] = oldThreadData[key];
							_.set(dataWillChange, p, threadData[index]);
						});
					}
					else
						if (path && typeof path === "string" || Array.isArray(path)) {
							const key = Array.isArray(path) ? path[0] : path.split(".")[0];
							dataWillChange[key] = oldThreadData[key];
							_.set(dataWillChange, path, threadData);
						}
						else
							for (const key in threadData)
								dataWillChange[key] = threadData[key];

					switch (databaseType) {
						case "mongodb": {
							let dataUpdated = await threadModel.findOneAndUpdate({ threadID }, dataWillChange, { returnDocument: 'after' });
							dataUpdated = _.omit(dataUpdated._doc, ["_id", "__v"]);
							global.db.allThreadData[index] = dataUpdated;
							return _.cloneDeep(dataUpdated);
						}
						case "sqlite": {
							const thread = await threadModel.findOne({ where: { threadID } });
							const dataUpdated = (await thread.update(dataWillChange)).get({ plain: true });
							global.db.allThreadData[index] = dataUpdated;
							return _.cloneDeep(dataUpdated);
						}
						case "json": {
							dataWillChange.updatedAt = moment.tz().format();
							global.db.allThreadData[index] = {
								...oldThreadData,
								...dataWillChange
							};
							writeJsonSync(pathThreadsData, global.db.allThreadData, optionsWriteJSON);
							return _.cloneDeep(global.db.allThreadData[index]);
						}
						default:
							break;
					}
					break;
				}
				case "delete": {
					if (index != -1) {
						global.db.allThreadData.splice(index, 1);
						switch (databaseType) {
							case "mongodb":
								await threadModel.deleteOne({ threadID });
								break;
							case "sqlite":
								await threadModel.destroy({ where: { threadID } });
								break;
							case "json":
								writeJsonSync(pathThreadsData, global.db.allThreadData, optionsWriteJSON);
								break;
							default:
								break;
						}
					}
					break;
				}
				default: {
					break;
				}
			}
			return null;
		}
		catch (err) {
			throw err;
		}
	}

	async function create_(threadID, threadInfo) {
		return new Promise(async function (resolve, reject) {
			const findInCreatingData = creatingThreadData.find(t => t.threadID == threadID);
			if (findInCreatingData)
				return resolve(findInCreatingData.promise);

			const queue = new Promise(async function (resolve_, reject_) {
				try {
					if (global.db.allThreadData.some(t => t.threadID == threadID)) {
						throw new CustomError({
							name: "DATA_ALREADY_EXISTS",
							message: `Thread with id "${threadID}" already exists in the data`
						});
					}
					if (isNaN(threadID)) {
						throw new CustomError({
							name: "INVALID_THREAD_ID",
							message: `The first argument (threadID) must be a number, not a ${typeof threadID}`
						});
					}
					threadInfo = threadInfo || await api.getThreadInfo(threadID) || {
              "threadID": "6540332652744904",
              "threadName": "لا تملك إسما 🌝",
              "participantIDs": [
                "588469075",
                "61550850831204",
                "100000563665041",
                "100049189713406",
                "100080263513055",
                "100089742813437"
              ],
              "userInfo": [
                {
                  "id": "588469075",
                  "name": "Allou  Mohamed",
                  "firstName": "Allou",
                  "vanity": "wwww2001019",
                  "url": "https://www.facebook.com/wwww2001019",
                  "thumbSrc": "https://scontent-ord5-1.xx.fbcdn.net/v/t39.30808-1/393415261_10160842301064076_825720200586057512_n.jpg?stp=cp0_dst-jpg_p60x60&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeExTI27eXc36CLRFg6vv5YC1kc7jzjy2JfWRzuPOPLYl9diuYJrg3xNshFBWlYtT50-cDfVkZ8yiWsPFHSPAA4U&_nc_ohc=vQqY8Y2tVFIAX_ehzt7&_nc_ht=scontent-ord5-1.xx&cb_e2o_trans=q&oh=00_AfB3YLblFa4rshMLg1zhIuqTGP2qiPeyTBgArilBAUiH6Q&oe=655CF278",
                  "profileUrl": "https://scontent-ord5-1.xx.fbcdn.net/v/t39.30808-1/393415261_10160842301064076_825720200586057512_n.jpg?stp=cp0_dst-jpg_p60x60&_nc_cat=111&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeExTI27eXc36CLRFg6vv5YC1kc7jzjy2JfWRzuPOPLYl9diuYJrg3xNshFBWlYtT50-cDfVkZ8yiWsPFHSPAA4U&_nc_ohc=vQqY8Y2tVFIAX_ehzt7&_nc_ht=scontent-ord5-1.xx&cb_e2o_trans=q&oh=00_AfB3YLblFa4rshMLg1zhIuqTGP2qiPeyTBgArilBAUiH6Q&oe=655CF278",
                  "gender": "MALE",
                  "type": "User",
                  "isFriend": false,
                  "isBirthday": false
                },
                {
                  "id": "61550850831204",
                  "name": "محمد علو",
                  "firstName": "محمد",
                  "vanity": "YukiBotAi",
                  "url": "https://www.facebook.com/YukiBotAi",
                  "thumbSrc": "https://scontent-ord5-2.xx.fbcdn.net/v/t39.30808-1/394330139_122131937636028361_3642989317116413825_n.jpg?stp=c0.0.60.60a_cp0_dst-jpg_p60x60&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGBL6gET502MnnuPCNjb9xZganxQGUzGS-BqfFAZTMZL63k0G4-DlTFHwMg1wNzmHxptE-Ym09KgOuAyVsIC2Ja&_nc_ohc=vZ6TBNXJcpcAX_iUwyO&_nc_ht=scontent-ord5-2.xx&cb_e2o_trans=q&oh=00_AfDsyDFAnMSaj_xp24Dx4tgobxph--ul-PCYLDCBURoIEw&oe=655DFD7C",
                  "profileUrl": "https://scontent-ord5-2.xx.fbcdn.net/v/t39.30808-1/394330139_122131937636028361_3642989317116413825_n.jpg?stp=c0.0.60.60a_cp0_dst-jpg_p60x60&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGBL6gET502MnnuPCNjb9xZganxQGUzGS-BqfFAZTMZL63k0G4-DlTFHwMg1wNzmHxptE-Ym09KgOuAyVsIC2Ja&_nc_ohc=vZ6TBNXJcpcAX_iUwyO&_nc_ht=scontent-ord5-2.xx&cb_e2o_trans=q&oh=00_AfDsyDFAnMSaj_xp24Dx4tgobxph--ul-PCYLDCBURoIEw&oe=655DFD7C",
                  "gender": "MALE",
                  "type": "User",
                  "isFriend": false,
                  "isBirthday": false
                },
                {
                  "id": "100000563665041",
                  "name": "Shady Tarek",
                  "firstName": "Shady",
                  "vanity": "",
                  "url": "https://www.facebook.com/profile.php?id=100000563665041",
                  "thumbSrc": "https://scontent-ord5-2.xx.fbcdn.net/v/t39.30808-1/375209725_7214000985295285_2533440531047544944_n.jpg?stp=cp0_dst-jpg_p60x60&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGMntm7NWszVvJCgywjJvbo_YYYewfYuWH9hhh7B9i5YXUsViHmVvfebqRhnKiln4etDhmkaTiahOxpCZ831MRk&_nc_ohc=qymSdURxgLEAX-uc11C&_nc_ht=scontent-ord5-2.xx&cb_e2o_trans=q&oh=00_AfCphcUzoHwycVyY8HkbEu1JAfjLtByXGiFW8tw3-tNV4w&oe=655E0364",
                  "profileUrl": "https://scontent-ord5-2.xx.fbcdn.net/v/t39.30808-1/375209725_7214000985295285_2533440531047544944_n.jpg?stp=cp0_dst-jpg_p60x60&_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGMntm7NWszVvJCgywjJvbo_YYYewfYuWH9hhh7B9i5YXUsViHmVvfebqRhnKiln4etDhmkaTiahOxpCZ831MRk&_nc_ohc=qymSdURxgLEAX-uc11C&_nc_ht=scontent-ord5-2.xx&cb_e2o_trans=q&oh=00_AfCphcUzoHwycVyY8HkbEu1JAfjLtByXGiFW8tw3-tNV4w&oe=655E0364",
                  "gender": "MALE",
                  "type": "User",
                  "isFriend": false,
                  "isBirthday": false
                },
                {
                  "id": "100049189713406",
                  "name": "jarif chan 🌝",
                  "firstName": "Mohamed",
                  "vanity": "proarcoder",
                  "url": "https://www.facebook.com/proarcoder",
                  "thumbSrc": "https://scontent-ord5-1.xx.fbcdn.net/v/t39.30808-1/316170784_678891957093789_3129603856056533897_n.jpg?stp=c1.0.60.60a_cp0_dst-jpg_p60x60&_nc_cat=106&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHEy7msjLi9SGsxnKJckKqc5d4iSPxMcqnl3iJI_ExyqSGEgcpUElgCWtvNfEYz720jXde_FYX9ZfLFzA52yoMW&_nc_ohc=laWkGY1WDtIAX-DN0QI&_nc_ht=scontent-ord5-1.xx&cb_e2o_trans=q&oh=00_AfBZHpt4mYJag1G3sHhul-pUEyHx4N07YDCnjOGa57P-mQ&oe=655E3A49",
                  "profileUrl": "https://scontent-ord5-1.xx.fbcdn.net/v/t39.30808-1/316170784_678891957093789_3129603856056533897_n.jpg?stp=c1.0.60.60a_cp0_dst-jpg_p60x60&_nc_cat=106&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHEy7msjLi9SGsxnKJckKqc5d4iSPxMcqnl3iJI_ExyqSGEgcpUElgCWtvNfEYz720jXde_FYX9ZfLFzA52yoMW&_nc_ohc=laWkGY1WDtIAX-DN0QI&_nc_ht=scontent-ord5-1.xx&cb_e2o_trans=q&oh=00_AfBZHpt4mYJag1G3sHhul-pUEyHx4N07YDCnjOGa57P-mQ&oe=655E3A49",
                  "gender": "MALE",
                  "type": "User",
                  "isFriend": true,
                  "isBirthday": false
                },
                {
                  "id": "100080263513055",
                  "name": "Shady Tarek",
                  "firstName": "Shady",
                  "vanity": "",
                  "url": "https://www.facebook.com/profile.php?id=100080263513055",
                  "thumbSrc": "https://scontent-ord5-2.xx.fbcdn.net/v/t39.30808-1/307912383_162263443125772_8834693979657551722_n.jpg?stp=cp0_dst-jpg_p60x60&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHROz5WBWldAWKpXuHUOu5HDsQfDzJsSk4OxB8PMmxKTl6fqnKVsS7e4VUiZZXe9rKxK0vDMi9Of2Gknqwjxhde&_nc_ohc=_AODhi99kQcAX-EM7Xx&_nc_ht=scontent-ord5-2.xx&cb_e2o_trans=q&oh=00_AfAj6Spt6-cCoESqINhGPn6Vf3UUJgg5O_2Z5-XbEoztGg&oe=655DC06D",
                  "profileUrl": "https://scontent-ord5-2.xx.fbcdn.net/v/t39.30808-1/307912383_162263443125772_8834693979657551722_n.jpg?stp=cp0_dst-jpg_p60x60&_nc_cat=102&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeHROz5WBWldAWKpXuHUOu5HDsQfDzJsSk4OxB8PMmxKTl6fqnKVsS7e4VUiZZXe9rKxK0vDMi9Of2Gknqwjxhde&_nc_ohc=_AODhi99kQcAX-EM7Xx&_nc_ht=scontent-ord5-2.xx&cb_e2o_trans=q&oh=00_AfAj6Spt6-cCoESqINhGPn6Vf3UUJgg5O_2Z5-XbEoztGg&oe=655DC06D",
                  "gender": "MALE",
                  "type": "User",
                  "isFriend": false,
                  "isBirthday": false
                },
                {
                  "id": "100089742813437",
                  "name": "هيٰنا ﹾ٭ۦٰٰٰ",
                  "firstName": "هيٰنا",
                  "vanity": "",
                  "url": "https://www.facebook.com/profile.php?id=100089742813437",
                  "thumbSrc": "https://scontent-ord5-2.xx.fbcdn.net/v/t39.30808-1/399212476_286923960975696_1161026470516754459_n.jpg?stp=cp0_dst-jpg_p60x60&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGHhmbTUQQcu6O4J4L9CxyHb6fPHoujBOxvp88ei6ME7OtUttmdT7PZwlNTTyOYIBwyrKIkqjRgr-pbLFgS6vXR&_nc_ohc=-mkm21VMKqoAX_HmIuH&_nc_ht=scontent-ord5-2.xx&cb_e2o_trans=q&oh=00_AfA6sEcjZhEA1CB-mnYv9Dz3iBTEib9M_9m14c1Vx_Uwrw&oe=655CFC96",
                  "profileUrl": "https://scontent-ord5-2.xx.fbcdn.net/v/t39.30808-1/399212476_286923960975696_1161026470516754459_n.jpg?stp=cp0_dst-jpg_p60x60&_nc_cat=100&ccb=1-7&_nc_sid=5f2048&_nc_eui2=AeGHhmbTUQQcu6O4J4L9CxyHb6fPHoujBOxvp88ei6ME7OtUttmdT7PZwlNTTyOYIBwyrKIkqjRgr-pbLFgS6vXR&_nc_ohc=-mkm21VMKqoAX_HmIuH&_nc_ht=scontent-ord5-2.xx&cb_e2o_trans=q&oh=00_AfA6sEcjZhEA1CB-mnYv9Dz3iBTEib9M_9m14c1Vx_Uwrw&oe=655CFC96",
                  "gender": "FEMALE",
                  "type": "User",
                  "isFriend": false,
                  "isBirthday": false
                }
              ],
              "unreadCount": 1,
              "messageCount": 878,
              "timestamp": "1700326238877",
              "muteUntil": null,
              "isGroup": true,
              "isSubscribed": true,
              "isArchived": false,
              "folder": "INBOX",
              "cannotReplyReason": null,
              "eventReminders": [],
              "emoji": null,
              "color": null,
              "threadTheme": null,
              "nicknames": {
                "100089742813437": "Yuki Bot",
                "61550850831204": "Yuki Bot"
              },
              "adminIDs": [
                {
                  "id": "100000563665041"
                },
                {
                  "id": "100049189713406"
                }
              ],
              "approvalMode": false,
              "approvalQueue": [],
              "reactionsMuteMode": "reactions_not_muted",
              "mentionsMuteMode": "mentions_not_muted",
              "isPinProtected": false,
              "relatedPageThread": null,
              "name": "Pro Coders Hehe",
              "snippet": "eval try { out(await api.getThreadInfo(event.threadID));\n} catch (e) {\nout(e)\n}",
              "snippetSender": "100000563665041",
              "snippetAttachments": [],
              "serverTimestamp": "1700326238877",
              "imageSrc": "https://scontent-ord5-1.xx.fbcdn.net/v/t1.15752-9/371546916_2699984100142229_3979387031837492887_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=a695e8&_nc_eui2=AeHYqXCss8VVUJrxrf-nLaKVfnm4ujdi_Dl-ebi6N2L8OUL43OQYNS2IfpADKJYO3rGjabgI1JvLo8gdFoFXnsrt&_nc_ohc=Lg5og_z1xWMAX9kKg5n&_nc_ht=scontent-ord5-1.xx&cb_e2o_trans=q&oh=03_AdS3MgA3LZq4WIi0LrFGuxSfYYtWpbFkcqcfAMp-WIYOlA&oe=658059AF",
              "isCanonicalUser": false,
              "isCanonical": false,
              "recipientsLoadable": true,
              "hasEmailParticipant": false,
              "readOnly": false,
              "canReply": true,
              "lastMessageType": "message",
              "lastReadTimestamp": "1700326211757",
              "threadType": 2,
              "inviteLink": {
                "enable": false,
                "link": ""
              }
            };
					const { threadName, userInfo, adminIDs } = threadInfo;
					const newAdminsIDs = adminIDs.reduce(function (_, b) {
						_.push(b.id);
						return _;
					}, []);

					const newMembers = userInfo.reduce(function (arr, user) {
						const userID = user.id;
						arr.push({
							userID,
							name: user.name,
							gender: user.gender,
							nickname: threadInfo.nicknames[userID] || null,
							inGroup: true,
							count: 0,
							permissionConfigDashboard: false
						});
						return arr;
					}, []);

					let threadData = {
						threadID,
						threadName,
						threadThemeID: threadInfo.threadTheme?.id || null,
						emoji: threadInfo.emoji,
						adminIDs: newAdminsIDs,
						imageSrc: threadInfo.imageSrc,
						approvalMode: threadInfo.approvalMode,
						members: newMembers,
						banned: {},
						settings: {
							sendWelcomeMessage: true,
							sendLeaveMessage: true,
							sendRankupMessage: false,
							customCommand: true
						},
						data: {},
						isGroup: threadInfo.threadType == 2
					};
					threadData = await save(threadID, threadData, "create");
					resolve_(_.cloneDeep(threadData));
				}
				catch (err) {
					reject_(err);
				}
				creatingThreadData.splice(creatingThreadData.findIndex(t => t.threadID == threadID), 1);
			});
			creatingThreadData.push({
				threadID,
				promise: queue
			});
			return resolve(queue);
		});
	}

	async function create(threadID, threadInfo) {
		return new Promise(async function (resolve, reject) {
			messageQueue.push(async function () {
				try {
					return resolve(await create_(threadID, threadInfo));
				}
				catch (err) {
					return reject(err);
				}
			});
		});
	}

	async function refreshInfo(threadID, newThreadInfo) {
		return new Promise(async function (resolve, reject) {
			messageQueue.push(async function () {
				try {
					if (isNaN(threadID)) {
						reject(new CustomError({
							name: "INVALID_THREAD_ID",
							message: `The first argument (threadID) must be a number, not a ${typeof threadID}`
						}));
					}
					const threadInfo = await get_(threadID);
					newThreadInfo = newThreadInfo || await api.getThreadInfo(threadID);
					const { userInfo, adminIDs, nicknames } = newThreadInfo;
					let oldMembers = threadInfo.members;
					const newMembers = [];
					for (const user of userInfo) {
						const userID = user.id;
						const indexUser = _.findIndex(oldMembers, { userID });
						const oldDataUser = oldMembers[indexUser] || {};
						const data = {
							userID,
							...oldDataUser,
							name: user.name,
							gender: user.gender,
							nickname: nicknames[userID] || null,
							inGroup: true,
							count: oldDataUser.count || 0,
							permissionConfigDashboard: oldDataUser.permissionConfigDashboard || false
						};
						indexUser != -1 ? oldMembers[indexUser] = data : oldMembers.push(data);
						newMembers.push(oldMembers.splice(indexUser != -1 ? indexUser : oldMembers.length - 1, 1)[0]);
					}
					oldMembers = oldMembers.map(user => {
						user.inGroup = false;
						return user;
					});
					const newAdminsIDs = adminIDs.reduce(function (acc, cur) {
						acc.push(cur.id);
						return acc;
					}, []);
					let threadData = {
						...threadInfo,
						threadName: newThreadInfo.threadName,
						threadThemeID: newThreadInfo.threadTheme?.id || null,
						emoji: newThreadInfo.emoji,
						adminIDs: newAdminsIDs,
						imageSrc: newThreadInfo.imageSrc,
						members: [
							...oldMembers,
							...newMembers
						]
					};

					threadData = await save(threadID, threadData, "update");
					return resolve(_.cloneDeep(threadData));
				}
				catch (err) {
					return reject(err);
				}
			});
		});
	}

	function getAll(path, defaultValue, query) {
		return new Promise(async function (resolve, reject) {
			messageQueue.push(async function () {
				try {
					let dataReturn = _.cloneDeep(global.db.allThreadData);

					if (query)
						if (typeof query !== "string")
							throw new Error(`The third argument (query) must be a string, not a ${typeof query}`);
						else
							dataReturn = dataReturn.map(tData => fakeGraphql(query, tData));

					if (path)
						if (!["string", "object"].includes(typeof path))
							throw new Error(`The first argument (path) must be a string or an object, not a ${typeof path}`);
						else
							if (typeof path === "string")
								return resolve(dataReturn.map(tData => _.get(tData, path, defaultValue)));
							else
								return resolve(dataReturn.map(tData => _.times(path.length, i => _.get(tData, path[i], defaultValue[i]))));

					return resolve(dataReturn);
				}
				catch (err) {
					reject(err);
				}
			});
		});
	}

	async function get_(threadID, path, defaultValue, query) {
		return new Promise(async function (resolve, reject) {
			try {
				if (isNaN(threadID)) {
					throw new CustomError({
						name: "INVALID_THREAD_ID",
						message: `The first argument (threadID) must be a number, not a ${typeof threadID}`
					});
				}
				let threadData;

				const index = global.db.allThreadData.findIndex(t => t.threadID == threadID);
				if (index === -1)
					threadData = await create_(threadID);
				else
					threadData = global.db.allThreadData[index];

				if (query)
					if (typeof query != "string")
						throw new Error(`The fourth argument (query) must be a string, not a ${typeof query}`);
					else
						threadData = fakeGraphql(query, threadData);

				if (path)
					if (!["string", "object"].includes(typeof path))
						throw new Error(`The second argument (path) must be a string or an object, not a ${typeof path}`);
					else
						if (typeof path === "string")
							return resolve(_.cloneDeep(_.get(threadData, path, defaultValue)));
						else
							return resolve(_.cloneDeep(_.times(path.length, i => _.get(threadData, path[i], defaultValue[i]))));

				return resolve(_.cloneDeep(threadData));
			}
			catch (err) {
				reject(err);
			}
		});
	}

	async function get(threadID, path, defaultValue, query) {
		return new Promise(async function (resolve, reject) {
			messageQueue.push(async function () {
				try {
					return resolve(await get_(threadID, path, defaultValue, query));
				}
				catch (err) {
					reject(err);
				}
			});
		});
	}

	async function set(threadID, updateData, path, query) {
		return new Promise(async function (resolve, reject) {
			messageQueue.push(async function () {
				try {
					if (isNaN(threadID)) {
						throw new CustomError({
							name: "INVALID_THREAD_ID",
							message: `The first argument (threadID) must be a number, not a ${typeof threadID}`
						});
					}
					if (!path && (typeof updateData != "object" || Array.isArray(updateData)))
						throw new Error(`The second argument (updateData) must be an object, not a ${typeof updateData}`);
					const threadData = await save(threadID, updateData, "update", path);
					if (query)
						if (typeof query !== "string")
							throw new Error(`The fourth argument (query) must be a string, not a ${typeof query}`);
						else
							return resolve(_.cloneDeep(fakeGraphql(query, threadData)));
					return resolve(_.cloneDeep(threadData));
				}
				catch (err) {
					reject(err);
				}
			});
		});
	}

	async function deleteKey(threadID, path, query) {
		return new Promise(async function (resolve, reject) {
			messageQueue.push(async function () {
				try {
					if (isNaN(threadID)) {
						throw new CustomError({
							name: "INVALID_THREAD_ID",
							message: `The first argument (threadID) must be a number, not a ${typeof threadID}`
						});
					}
					if (typeof path !== "string")
						throw new Error(`The second argument (path) must be a string, not a ${typeof path}`);
					const spitPath = path.split(".");
					if (spitPath.length == 1)
						throw new Error(`Can't delete key "${path}" because it's a root key`);
					const parent = spitPath.slice(0, spitPath.length - 1).join(".");
					const parentData = await get_(threadID, parent);
					if (!parentData)
						throw new Error(`Can't find key "${parent}" in thread with threadID: ${threadID}`);

					_.unset(parentData, spitPath[spitPath.length - 1]);
					const setData = await save(threadID, parentData, "update", parent);
					if (query)
						if (typeof query !== "string")
							throw new Error(`The fourth argument (query) must be a string, not a ${typeof query}`);
						else
							return resolve(_.cloneDeep(fakeGraphql(query, setData)));
					return resolve(_.cloneDeep(setData));
				}
				catch (err) {
					reject(err);
				}
			});
		});
	}

	async function remove(threadID) {
		return new Promise(async function (resolve, reject) {
			messageQueue.push(async function () {
				try {
					if (isNaN(threadID)) {
						throw new CustomError({
							name: "INVALID_THREAD_ID",
							message: `The first argument (threadID) must be a number, not a ${typeof threadID}`
						});
					}
					await save(threadID, { threadID }, "delete");
					return resolve(true);
				}
				catch (err) {
					reject(err);
				}
			});
		});
	}

  async function getName(ID) {
    const i = global.db.allThreadData.find(t => t.threadID == ID);
    if (!i) return;
    return i.threadName;
  }

	return {
		existsSync: function existsSync(threadID) {
			return global.db.allThreadData.some(t => t.threadID == threadID);
		},
		create,
		refreshInfo,
		getAll,
		get,
		set,
		deleteKey,
		remove,
    getName
	};
};