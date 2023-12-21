const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
	config: {
		name: "غاي",
		version: "1.0",
		author: "Allou Mohamed",
		countDown: 10,
		role: 0,
		shortDescription: "احم 😂",
		longDescription: "",
		category: "المجموعة",
		guide: "{pn}"
	},

atCall: async function ({ event, message, usersData }) {
let uid;
let text;
    
    if(!event.type == "message_reply"){
    uid = event.senderID;
      text = "مين غيرك غاي 😹";
    } else{
        uid = event.messageReply.senderID;
      text = "شوفوا الغاي يا جماعة 🌝";
    }

let url = await usersData.getAvatarUrl(uid)
let avt = await new DIG.Gay().getImage(url)

  		const pathSave = `${__dirname}/tmp/gay.png`;
	fs.writeFileSync(pathSave, Buffer.from(avt));
    message.reply({body:text,
attachment: fs.createReadStream(pathSave)
		}, () => fs.unlinkSync(pathSave));  
  }
};




