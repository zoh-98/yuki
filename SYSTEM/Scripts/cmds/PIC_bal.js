const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
    config: {
        name: "ضرب",
        aliases: ["تدمير"],
        version: "1.0",
        author: "loufi",
        countDown: 5,
        role: 0,
        shortDescription: "ضرب 🌝 للذكور فقط",
        longDescription: "",
        category: "تسلية",
        guide: ""
    },

    atCall: async function ({ message, event, args }) {
        if (event.type !== "message_reply") return message.reply("رد عليه هههه 🌝");

        try {
            const one = event.senderID, two = event.messageReply.senderID;
            const pth = await bal(one, two);
            message.reply({ body: "ودع بيضك 😂", attachment: fs.createReadStream(pth) });
        } catch (error) {
            console.error("An error occurred:", error);
        
        }
    }
};

async function bal(one, two) {
    let avone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    avone.circle();
    let avtwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
    avtwo.circle();
    let pth = `${__dirname}/cache/abcd.png`;
    let img = await jimp.read("https://i.postimg.cc/C5V68KgZ/qzvtLVd.jpg");

    img.resize(1080, 1320).composite(avone.resize(170, 170), 200, 320).composite(avtwo.resize(170, 170), 610, 70);

    await img.writeAsync(pth);
    return pth;
}
