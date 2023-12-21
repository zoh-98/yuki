const emojis = [
{
  "emoji": "😗",
  "link": "https://i.imgur.com/LdyIyYD.png"
},
{
  "emoji": "😭",
  "link": "https://i.imgur.com/P8zpqby.png"
},
  {
  "emoji": "🤠",
  "link": "https://i.imgur.com/kG71glL.png"
  },
  {
  "emoji": "🙂",
  "link": "https://i.imgur.com/hzP1Zca.png"
  },
    {
  "emoji": "🐸",
  "link": "https://i.imgur.com/rnsgJju.png"
  },
    {
  "emoji": "⛽",
  "link": "https://i.imgur.com/LBROa0K.png"
  },
    {
  "emoji": "💰",
  "link": "https://i.imgur.com/uQmrlvt.png"
  },
    {
  "emoji": "🥅",
  "link": "https://i.imgur.com/sGItXyC.png"
  },
    {
  "emoji": "♋",
  "link": "https://i.imgur.com/FCOgj6D.jpg"
  },
    {
  "emoji": "🍌",
  "link": "https://i.imgur.com/71WozFU.jpg"
  },
    {
  "emoji": "🦊",
  "link": "https://i.imgur.com/uyElK2K.png"
  },
    {
  "emoji": "😺",
  "link": "https://i.imgur.com/PXjjXzl.png"
  },
    {
  "emoji": "🍀",
  "link": "https://i.imgur.com/8zJRvzg.png"
  },
    {
  "emoji": "🆘",
  "link": "https://i.imgur.com/Sl0JWTu.png"
  },
    {
  "emoji": "🥺",
  "link": "https://i.imgur.com/M69t6MP.jpg"
  },
    {
  "emoji": "😶",
  "link": "https://i.imgur.com/k0hHyyX.jpg"
  },
    {
  "emoji": "😑",
  "link": "https://i.imgur.com/AvZygtY.png"
  },
    {
  "emoji": "😔",
  "link": "https://i.imgur.com/pQ08T2Q.jpg"
  },
    {
  "emoji": "🤦‍♂️",
  "link": "https://i.imgur.com/WbVCMIp.jpg"
  },
    {
  "emoji": "👀",
  "link": "https://i.imgur.com/sH3gFGd.jpg"
  },
    {
  "emoji": "💱",
  "link": "https://i.imgur.com/Gt301sv.jpg"
  },
    {
  "emoji": "🕴️",
  "link": "https://i.imgur.com/652pmot.jpg"
  },
    {
  "emoji": "🏖️",
  "link": "https://i.imgur.com/CCb2cVz.png"
  },
    {
  "emoji": "🏕️",
  "link": "https://i.imgur.com/zoGHqWD.jpg"
  },
    {
  "emoji": "🪆",
  "link": "https://i.imgur.com/FUrUIYZ.jpg"
  }
];

module.exports = {
 config: {
  name: 'الأسرع',
  aliases: ['الاسرع'],
  author: 'Allou Mohamed',
  category: 'الألعاب',
  role: 0,
  reward: 100,
  price: 0,
  countDown: 20,
  description: "جاوب و إربح نقود",
  guide: '{pn}'
  },
  
atCall: async function({ event, message, commandName, reward }) {
  const randomIndex = Math.floor(Math.random() * emojis.length);
    const randomQuestion = emojis[randomIndex];

    await message.reply({body: 'من يرسل هذا الإيموجي اولا يفوز', attachment: await global.utils.getStreamFromURL(randomQuestion.link)});
  
  const answer = randomQuestion.emoji;
  const KEY = generateRandomNumber();
global.YukiBot.onListen.set(KEY, {
      condition: `event.body.toLowerCase() == "${answer || answer.toLowerCase()}"`,
      result: `async () => {
      await message.reply('صحيح لقد ربحت 100 عملة | ✅');
      await usersData.addMoney(event.senderID, ${reward});
      }`
    });

  }
};
  
   async function generateRandomNumber() {
  let number = '';
  for (let i = 0; i < 15; i++) {
    number += Math.floor(Math.random() * 10);
  }
  return number;
   }
