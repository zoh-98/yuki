module.exports = {
  config: {
    name: 'معرف الكل',
    author: 'Allou Mohamed',
    version: '1.0.0',
    role: 2,
    category: 'المطور',
    guide: '{pn}',
    price: 0,
    reward: 0,
    description: 'الحصول على معرف الكل',
    inbox: true
  },
  atCall: async function ({ api, event, args }) {
    const threadID = event.threadID;
    const { participantIDs, userInfo } = await api.getThreadInfo(threadID);
    participantIDs.sort();
    const page = parseInt(args[0]) || 1;
    const participantsPerPage = 30;
    const startIdx = (page - 1) * participantsPerPage;
    const endIdx = startIdx + participantsPerPage;
    const pageParticipants = participantIDs.slice(startIdx, endIdx);
    let logMessage = `الأعضاء (الصفحة ${page}):\n`;
    pageParticipants.forEach((participantID, index) => {
      const user = userInfo.find((u) => u.id === participantID);
      logMessage += `${index + 1}. ${user ? user.name : 'N/A'}: ${participantID}\n`;
    });

    api.sendMessage(logMessage, event.threadID);
  }

};