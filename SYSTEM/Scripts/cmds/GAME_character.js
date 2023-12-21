

module.exports = {
	config: {
		name: "شخصية",
    aliases: ["c"],
		version: "1.2",
		author: "لوفي",
		countDown: 5,
		role: 0,
    price: 500,
		shortDescription: {
			vi: "",
			en: "لعبة معرفة شخصيات الأنمي"
		},
		category: "الألعاب",
		guide: {
			en: "{pn}"
		},
	},

	
  onLoad: async function ({}) {
    global.Anime = {}

    const TID = 28292;
    global.Anime[TID] = {
        quiz: null,
        answer: null
      };
  },
  atCall: async function({ message, event, commandName, getLang }) {
  if (!global.Anime) global.Anime = {};
  
  
  const dataGame = [
{
    "Qname": "نامي",
    "Qanswer": "https://i.imgur.com/VhAmZez.jpg"
},
{
    "Qname": "نوي",
    "Qanswer": "https://i.imgur.com/fkK7mQL.jpg"
},
{
    "Qname": "جان",
    "Qanswer": "https://i.imgur.com/44jiG0i.jpg"
},
{
    "Qname": "سانجي",
    "Qanswer": "https://i.imgur.com/e8Xmt02.jpg"
},
{
    "Qname": "زورو",
    "Qanswer": "https://i.imgur.com/38gyw6O.jpg"
},
{ 
    "Qname": "لوفي",
    "Qanswer": "https://i.imgur.com/g7aVAkk.jpg"
},
  {
    "Qname": "غوكو",
    "Qanswer": "https://i.imgur.com/YE1MhsM.png"
},
{
    "Qname": "فيوليت",
    "Qanswer": "https://i.imgur.com/1ea164u.jpg"
},
{
    "Qname": "يوريو",
    "Qanswer": "https://i.imgur.com/PEMgwWQ.jpg"
},
{
    "Qname": "اينوي",
    "Qanswer": "https://i.imgur.com/zyORTM0.jpg"
},
{
    "Qname": "بولما",
    "Qanswer": "https://i.imgur.com/zXSVdg4.jpg"
},
{ 
    "Qname": "كيلوا",
    "Qanswer": "https://i.imgur.com/h8u7bMz.jpg"
},
  {
    "Qname": "كورابيكا",
    "Qanswer": "https://i.imgur.com/aG99hRH.jpg"
},
{
    "Qname": "غون",
    "Qanswer": "https://i.imgur.com/7zh5MmX.png"
},
{
    "Qname": "هيسوكا",
    "Qanswer": "https://i.imgur.com/MLdV9Bm.png"
},
{
    "Qname": "ايتشغوا",
    "Qanswer": "https://i.imgur.com/9jnxnCZ.jpg"
},
{
    "Qname": "ميليوداس",
    "Qanswer": "https://i.imgur.com/MV89DRK.jpg"
},
{ 
    "Qname": "ناروتوا",
    "Qanswer": "https://i.imgur.com/AiMmEHw.jpg"
},
  {
    "Qname": "روكيا",
    "Qanswer": "https://i.imgur.com/5I3wCTX.jpg"
  },
  {
    "Qname": "ايرين",
    "Qanswer": "https://i.imgur.com/l7L8dLW.jpg"
  },
  {
    "Qname": "غوجو",
    "Qanswer": "https://i.imgur.com/XWkWWQR.jpg"
  },
  {
    "Qname": "ساسكي",
    "Qanswer": "https://i.imgur.com/U6wmApa.jpg"
  },
  {
    "Qname": "مادارا",
    "Qanswer": "https://i.imgur.com/AO1yjIi.jpg"
  },
    {
    "Qname": "مزة",
    "Qanswer": "https://i.imgur.com/iKiayhM.jpg"
  },
  {
    "Qname": "مزة",
    "Qanswer": "https://i.imgur.com/v6T7uz8.jpg"
  },
  {
    "Qname": "جين",
    "Qanswer": "https://i.imgur.com/tCcWxJ2.jpg"
  },
  {
    "Qname": "مليم",
    "Qanswer": "https://i.imgur.com/0sMnaAW.jpg"
  },
  {
    "Qname": "هيوكا",
    "Qanswer": "https://i.imgur.com/6Yi2zGQ.jpg"
  },
    {
    "Qname": "سوكونا",
    "Qanswer": "https://i.imgur.com/rdwuxcU.jpg"
  },
  {
    "Qname": "ميكاسا",
    "Qanswer": "https://i.imgur.com/WTj090m.jpg"
  },
  {
    "Qname": "غوهان",
    "Qanswer": "https://i.imgur.com/mui3ZOv.jpg"
  },
  {
    "Qname": "مستر روبن سون",
    "Qanswer": "https://i.imgur.com/KCBaa9H.jpg"
  },
  {
    "Qname": "كيو",
    "Qanswer": "https://i.imgur.com/IxsKNPt.png"
  },
    {
    "Qname": "ستيفن البطل",
    "Qanswer": "https://i.imgur.com/AatdzEe.png"
  },
  {
    "Qname": "غامبول",
    "Qanswer": "https://i.imgur.com/YuJS6Le.jpg"
  },
  {
    "Qname": "داروين",
    "Qanswer": "https://i.imgur.com/Us17UId.jpg"
  },
  {
    "Qname": "ارثر",
    "Qanswer": "https://i.imgur.com/nqkZL1T.jpg"
  },
  {
    "Qname": "رونالدو",
    "Qanswer": "https://i.imgur.com/eg8GkDh.jpg"
  },
    {
    "Qname": "كلارنس",
    "Qanswer": "https://i.imgur.com/eoUKUx0.jpg"
  },
  {
    "Qname": "سومو",
    "Qanswer": "https://i.imgur.com/SYef2GQ.jpg"
  },
  {
    "Qname": "جيف",
    "Qanswer": "https://i.imgur.com/Dqkt7e7.jpg"
  }
  ]

  const TID = event.threadID;
  const randomIndex = Math.floor(Math.random() * dataGame.length);
  const data = dataGame[randomIndex];

  global.Anime[TID] = {
    quiz: data.Qname,
    answer: data.Qanswer
  };

  await message.reply({
    body: 'من هذا ؟ 🤔',
    attachment: await global.utils.getStreamFromURL(global.Anime[TID].answer)
  });
},
  
  atChat: async function({ event, message, usersData }) {
  if (!global.Anime) global.Anime = {};

  var TID = event.threadID;
  var uid = event.senderID;
  var name = await usersData.getName(uid);

  try { 

  if (global.Anime[TID].quiz) {
    if (event.body === global.Anime[TID].quiz) {
      await usersData.set(uid, (await usersData.get(uid, "data.Qexp") || 0) + 1, "data.Qexp");
      global.Anime[TID] = {
        quiz: null,
        answer: null
      };
      message.reply(`قام ${name} بكتابة إسم الشخصية الصحيح أولا [🤝]\nعدد نقاطك : ${await usersData.get(uid, "data.Qexp")} نقطة [🏆]\nيمكنك تكرار سؤال آخر بعد 10 ثوان ⏱`);
    }
  }
  } catch (e) {}
}

}