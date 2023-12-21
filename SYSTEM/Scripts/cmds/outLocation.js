module.exports = {
  config: {
    name: "إحداثيات",
    version: "1.0.0",
    author: "Allou Mohamed",
    description: "إستخراج موقع",
    category: "المطور",
    guide: "x z",
    role: 0,
    countDown: 10,
    reward: 100,
    price: 0,
    inbox: true,
  },
  atCall: async function ({ event, message, args }) {
    const locationMessage = {
      body: 'BY ALLOU MOHAMED:',
      location: {
        latitude: parseInt(args[0]),
        longitude: parseInt(args[1]),
        current: false,
      },
    };
    message.reply(locationMessage);
  },
};
    