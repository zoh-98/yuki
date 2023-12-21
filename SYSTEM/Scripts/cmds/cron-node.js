const cron = require('node-cron');
const Yuki_box_chat = "24264995336433185";

module.exports = {
    config: {
       name: 'المدرسة 👽',
       author: 'Allou Mohamed',
       version: '1.0.0@Beta',
       role: 2,
       category: 'ليس أمر',
       guide: 'ليس أمر',
       price: 0,
       reward: 0,
       description: 'هذا ليس أمر فقط تجاهله 🤍🌝',
       inbox: true
    },
onLoad: async function({ api }) {
   cron.schedule('0 7 * * *', () => {
     api.sendMessage('إنها الساعة السابعة صباحا هيا علمدرسة 🌝', Yuki_box_chat);
   }, {
     scheduled: true,
     timezone: "Africa/Algiers"
   });
  cron.schedule('0 8 * * *', () => {
     api.sendMessage('إنها الساعة الثامنة صباحا هيا علقسم 🌝', Yuki_box_chat);
   }, {
     scheduled: true,
     timezone: "Africa/Algiers"
   });
  }
};