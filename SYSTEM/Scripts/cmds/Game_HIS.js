const allou_server = "https://games.proarcoder.repl.co/QSR";
const axios = require('axios');

module.exports = {
  config: {
    name: "آدمز",
    aliases: ["مغامرة"],
    version: "1.0",
    author: "allou Mohamed و Rayan Dri Dri",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "",
      en: "مغامرة في منزل العائلة آدمز"
    },
    category: "الألعاب",
    inbox: true
  },

  atCall: async function({ event, message, commandName }) {
    const uid = event.senderID;
    const res = await axios.get(allou_server, {
      params: {
        playerID: uid
      }
    });
    return message.reply(res.data.message, (err, info) => {
      global.YukiBot.atReply.set(info.messageID, {
        commandName,
        author: event.senderID,
        mid: info.messageID
      })
    });
  },
  atReply: async function({ message, event, args, Reply }) {
    const { mid, author, commandName } = Reply;
    const uid = event.senderID;
    if (uid != author) return message.reply('أنت لست لاعب القصة');
    const ans = {"1": "A", "2": "B", "3": "C"};
    const answer = ans[args[0]];
    const res = await axios.get(allou_server, {
      params: {
        playerID: uid,
        playerAnswer: answer
      }
    });
    message.unsend(mid);
    return message.reply(res.data.message, (err, info) => {
      global.YukiBot.atReply.set(info.messageID, {
        commandName,
        author: event.senderID,
        mid: info.messageID
      })
    });
  }
  };