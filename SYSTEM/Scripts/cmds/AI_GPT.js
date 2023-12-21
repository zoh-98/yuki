const axios = require('axios');


module.exports = {
	config: {
		name: "بطاطس",
    aliases: ["gpt2"],
		version: "1.3",
		author: "Allou Mohamed",
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

    if (!args[0]) return message.reply('Hi there how can i assist you today mf 🌝 (my friend)!');
				handleGpt(event, message, userID, prompt);
	},

	atReply: async function ({ Reply, message, event, args, getLang, usersData }) {
		const { author } = Reply;
		if (author != event.senderID)
			return;
    
    const prompt = args.join(' ');
    const userID = event.senderID;
    

		handleGpt(event, message, userID, prompt);
  }
};

async function handleGpt(event, message, userID, prompt, jailbreak) {

  try {
    const response = await axios.get("https://gpt.proarcoder.repl.co/gpt", {
      params: {
        prompt: prompt,
        userId: userID
      }
    });

   return message.reply(response.data.message, (err, info) => {
			YukiBot.atReply.set( info.messageID, {
				commandName: 'بطاطس',
				author: event.senderID,
				messageID: info.messageID
			});
		});
  } catch (error) {
    console.error("Error:", error.message);
  }    
                                       }