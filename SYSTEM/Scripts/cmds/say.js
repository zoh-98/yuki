const axios = require('axios');
const fs = require('fs');

module.exports = {
    config: {
        name: "قل",
        aliases: ["say"],
        version: "1.0",
        author: "NIB",
        countDown: 5,
        role: 0,
        shortDescription: "يقول شي 🙂",
        longDescription: "",
        category: "مضحكة",
        guide: "{pn} نص"
    },

    atCall: async function ({ api, message, args, event }) {
        const lng = "ar", say = args.join(" ");
        try {
            let url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lng}&client=tw-ob&q=${encodeURIComponent(say)}`;

            const response = await axios({
                url: url,
                method: 'GET',
                responseType: 'stream'
            });

            const pathSave = `${__dirname}/cache/${event.senderID}say.mp3`;
            const writeStream = fs.createWriteStream(pathSave);
            response.data.pipe(writeStream);

            writeStream.on('finish', () => {
                message.reply({ attachment: fs.createReadStream(pathSave) });
            });
          
        } catch (e) {
            console.error(e);
            message.reply(`لا ما بدي 🌝😹`);
        }
    }
};
