module.exports = {
  config: {
    name: 'تحديث_الكل',
    author: 'Allou mohamed',
    version: '1.0.B',
    role: 3,
    category: 'المطور',
    guide: '{pn}',
    price: 0,
    reward: 0,
    description: 'تحديث كل المجموعات',
    inbox: true
  },
  atCall: async function({ usersData, threadsData, message }) {
   message.reply('♻️ جاري التحديث إنتضر حوالي 30 ثانية ...');
    const succeed = [];
    const errors = [];
    const allUs = await usersData.getAll();
    const allTd = await threadsData.getAll();
    const allUsersUids = [];
    const allThreadsUids = [];

    for (const user of allUs) {
      allUsersUids.push(user.userID);
      try {
        await usersData.refreshInfo(user.userID);
        succeed.push(`تم : ${user.userID}`);
      } catch (error) {
        await usersData.remove(user.userID);
        errors.push(`حدث خطأ  ${user.userID}: ${error.message}`);
      }
    }

    for (const thread of allTd) {
      allThreadsUids.push(thread.threadID);
      try {
        await threadsData.refreshInfo(thread.threadID);
        succeed.push(`تم : ${thread.threadID}`);
      } catch (error) {
        await threadsData.remove(thread.threadID);
        errors.push(`حدث خطأ ${thread.threadID}: ${error.message}`);
      }
    }
   message.reply('✅ | تم تحديث : ' + succeed.length + ' شخص و مجموعة\n❎ | و الباقي تم حذفه : ' + errors.length);
  }
};
