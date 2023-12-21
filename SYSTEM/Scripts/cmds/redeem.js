global.BankRedeem = {}
global.BankAllou = []

module.exports = {
  config: {
    name: "ريديم",
    version: "1.0",
    author: "allou Mohamed",
    countDown: 5,
    role: 2,
    shortDescription: {
      vi: "",
      en: "للبنك 🏦 كودات البنك لزيادة النقود"
    },
    category: "البنك"
  },
 langs: {
   ar: {
     redeem: "#𝗿𝗲𝗱𝗲𝗲𝗺 𝗯𝗮𝗻𝗸 𝗰𝗼𝗱𝗲:\n\n%1\n\nإنسخ الكود وحده و رد به على هذه الرسالة لربح المال",
     win: "#𝗿𝗲𝗱𝗲𝗲𝗺 𝗯𝗮𝗻𝗸 𝗰𝗼𝗱𝗲:\n\nلقد ربحت 1000 دينار",
     incorrect: "#𝗿𝗲𝗱𝗲𝗲𝗺 𝗯𝗮𝗻𝗸 𝗰𝗼𝗱𝗲:\n\nغبي إنسخ الكود الصحيح ترا فيها نقود 🌝💔"
   }
 },
  
  atChat: async function({ threadsData, event, message, getLang, commandName }) {

    const by_allou = await threadsData.get(event.threadID, "settings.sendBankRedeem");

    if (by_allou != true) return;
    
    if (!global.BankRedeem.hasOwnProperty(event.threadID)) {
      global.BankRedeem[event.threadID] = 1;
        }
    global.BankRedeem[event.threadID]++
    //Idea and real code by NIB bro
    if (global.BankRedeem[event.threadID] >= 30) { 
      global.BankRedeem[event.threadID] = 0;
      
      let time = 6;
      console.log(`A redeem will send after  ${time} minutes`);
      setTimeout(async function() {

        const allouRedeem = await redeemCode(8);
        const allouRedeemB = await redeemCode(4);
        const allouRedeemC = `Yuki-${allouRedeemB}-ai-${allouRedeem}-Bot`;
        
        
        
        try {
          const form = {
            body: getLang("redeem", allouRedeemC)
          };

          message.send(form, (err, info) => {
            global.BankAllou.push(info.messageID);
            YukiBot.atReply.set(info.messageID, {
              commandName: 'ريديم',
              mid: info.messageID,
              name: allouRedeemC
            });
          });

          
        } catch (e) { 
          console.log(e);
          message.reply('🥺 error please fix redeem gai');
        }
      }, time * 60000);
    }
  },
  atReply: async function({ message, usersData, event, getLang, Reply }) {
    const { name, mid } = Reply;
    const crrBank = await usersData.get(event.senderID, "data.BankBal");
    const usa = event.body.toLowerCase();
    const a = name.toLowerCase();

    if (usa == a) {
      message.unsend(mid);
      await usersData.set(event.senderID, crrBank + 1000, "data.BankBal");
      message.reply(getLang("win"));
    } else {
      message.reply(getLang("incorrect"));
      
    }
  }
}

async function redeemCode(length) {
    const characters = 'abcdefghijklmnopqrstuvwxyz123456789';
    let redeem = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        redeem += characters[randomIndex];
    }
    
    return redeem;
      }