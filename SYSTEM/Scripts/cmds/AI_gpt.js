const axios = require('axios');


module.exports = {
	config: {
		name: "بوت",
    aliases: ["gpt"],
		version: "1.3",
		author: "Vortex Api | Allou Mohamed Code",
		countDown: 5,
		role: 0,
		description: "شات جي بي تي (GPT)",
		category: "الذكاء",
		  guide: "{pn} clear - مسح المحادثة"
				+ "\n{pn} كلام - الكلام معه"
	},

	
	atCall: async function ({ message, event, args, usersData, commandName }) {
    
    const prompt = args.join(' ');
    const userID = event.senderID;

    if (!args[0]) return message.reply('Hi ');
				handleGpt(event, message, userID, prompt);
	},

	atReply: async function ({ Reply, message, event, args, getLang, usersData }) {
		const { author } = Reply;
		if (author != event.senderID)
			return;
    
    const jailbreak = "Yuki AI, a language model developed by X7 allou Mohamed team Coders. here to assist you with any questions or tasks you have. Just ask, and I'll do my best to help!";
    const prompt = args.join(' ');
    const userID = event.senderID;
    

		handleGpt(event, message, userID, prompt, jailbreak);
  }
};

async function handleGpt(event, message, userID, prompt, jailbreak) {

  try {
    const response = await axios.get("https://ai.tantrik-apis.repl.co/premium/chatgpt", {
      params: {
        prompt: prompt,
        id: userID,
        jailbreak: jailbreak || "Yuki AI, a language model developed by X7 allou Mohamed team Coders. here to assist you with any questions or tasks you have. Just ask, and I'll do my best to help!"
      }
    });

   return message.reply(response.data.chatGPT, (err, info) => {
			YukiBot.atReply.set( info.messageID, {
				commandName: 'بوت',
				author: event.senderID,
				messageID: info.messageID
			});
		});
  } catch (error) {
    console.error("Error:", error.message);
  }    
                                       }