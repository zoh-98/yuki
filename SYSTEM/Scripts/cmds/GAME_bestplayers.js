module.exports = {
  config: {
    name: "المتصدرين",
    version: "1.1",
    author: "LouFi",
    shortDescription: {
      en: "أفضل عشر لاعبيين للعبة شخصية",
    },
    role: 0,
    category: "الألعاب"
  },

  atCall: async function ({ message, usersData }) {
    const allUsersData = await usersData.getAll();

    // Filter users who have non-zero points
    const filteredUsers = Object.values(allUsersData).filter(
      (user) => user.data.Qexp > 0
    );

    // Sort the filtered users based on data.Qexp in descending order
    const sortedUsers = filteredUsers.sort(
      (userA, userB) => userB.data.Qexp - userA.data.Qexp
    );

    // Get the top 10 players
    const topPlayers = sortedUsers.slice(0, 60);

    let response = "═══《المتصدريين》═══\n";
    for (let i = 0; i < topPlayers.length; i++) {
      const player = topPlayers[i];
      const uid = player.userID;
      const playerName = await usersData.getName(uid);
      const playerScore = player.data.Qexp || 0;
      let rank;
      switch (i + 1) {
        case 1:
          rank = "🥇";
          break;
        case 2:
          rank = "🥈";
          break;
        case 3:
          rank = "🥉";
          break;
        default:
          rank = `🏅.${i + 1}.`;
      }
      response += `${rank} الإسم 👤: ${playerName}\nالنقاط 🎭: ${playerScore} نقطة\n═════════════\n`;
    }

    message.reply(`${response} •ملاحظة 📝:\n⭔إلعب لعبة شخصية ليظهر إسمك .-. 🤍\n═════════════\n`);
  },
};
      