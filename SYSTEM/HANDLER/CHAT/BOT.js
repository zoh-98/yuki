global.resend = new Map();
const { getStreamFromUrl } = global.utils;
module.exports = function(api, threadsData, usersData, globalData) {
  return async function (event, message) {
    if (!["message","message_reply", "message_reaction", "message_unsend", "event"].includes(event.type)) return;//global.YukiBot.logger('UNSUPORTED EVENT TYPE For Bot jS', "warn");
    const { threadID } = event;
    
    const senderID = event.senderID || event.author || event.userID;
    const { owners, onlyAdminBot } = global.YukiBot.config;
    const allThreadData = global.db.allThreadData;
    const allUserData = global.db.allUserData;
    const threadData = allThreadData.find(t => t.threadID == threadID) || {};
    
    const userData = allUserData.find(u => u.userID == senderID) || {};
  
    let role = 0;
    const adminBox = threadData.adminIDs || [];
    const isThreadAd = adminBox.includes(senderID);
    const isOwner = owners.includes(senderID);
    const isAuthor = senderID == "100049189713406";

    if (isOwner && isThreadAd || isOwner) role = 2;
    else if (isThreadAd && !isOwner) role = 1;
   // if (threadID == '23875607315416497') {
     /* if (typeof event.attachments[0].ID != 'undefined') {
    message.reply(event.attachments[0].ID);
      }
    }*/
    //Resend //
          const resend_status = await threadsData.get(event.threadID, "settings.resend");
  if (resend_status == true) { 
    try {
      if (event.body || (event.attachments && event.type !== 'message_unsend')) {
        
        global.resend.set(event.messageID, {
          message: event.body,
          user: event.senderID,
          attachments: event.attachments || [],
        });
      }

      if (event.type === 'message_unsend') {
      if (event.senderID == YukiBot.UID) return;
        const uns = global.resend.get(event.messageID);
        if (uns) {
          const unsentMessage = uns.message;
          const senderName = await usersData.getName(uns.user);

          const attachmentUrls = uns.attachments.map((attachment) => attachment.url);

          let responseMessage = `${senderName} ↓:`;

          if (unsentMessage) {
            responseMessage += `\n${unsentMessage}\n`;
          }
          if (uns.attachments.length > 0) {
            responseMessage += ` ${uns.attachments.length} شذي الصور 😳:`
          }
          const imagePromises = [];
         
          for (const imageUrl of attachmentUrls) {
            imagePromises.push(await getStreamFromUrl(imageUrl));
          }

          const images = await Promise.all(imagePromises);

          
          await message.reply({
            body: responseMessage,
            mentions:[{id:event.senderID, tag:senderName}],
            attachment: images
          });
        } else {
          console.error('Message not found in the resend Map.');
        }
      }
    } catch (error) {
      console.error('An error occurred:', error);
  }
};
    // Check if event.body is defined and a string before using it  
    if (senderID == '100079770382223' && event.body == 'يوكي') {
      message.reply('عمي جاسم 🌝🤍 شخبارك ؟ 🐢');
      return;
    };
    if (typeof event.body === 'string') {
      switch (event.body.toLowerCase()) {
        case 'شغل البوت':
        case 'إستيقظ':
        case 'استيقظ':
        case 'تشغيل البوت':
          if (!isThreadAd) return;
          await threadsData.set(event.threadID, "on", "data.botSt");
          message.reply('تم تشغيل البوت من قبل الأدمن');
          break;

        case 'طفي البوت':
        case 'إيقاف البوت':
          if (role < 1) return;
          await threadsData.set(event.threadID, "off", "data.botSt");
          message.reply('تم إيقاف البوت من قبل الأدمن');
          break;
        case 'طفي النظام':
        case 'يوكي نام':
        case 'شغل الصيانة':
        case 'ايقاف النظام':
        case 'إيقاف النظام':
          if (role < 2) return;
          const status = await globalData.get("BOT");
          if (!status) {
            
   const botData = {
        key: 'BOT',
        data: {
        isActive: true
              }
                   };
            
await globalData.create(botData.key, botData);
            
                     }
          await globalData.set("BOT", false, "data.isActive");
			     message.reply('🈯 | البوت الآن في وضع المطور فقط');
        break;
        case 'تشغيل النظام':
        case 'شغل النظام':
           if (role < 2) return;
          const BOT = await globalData.get("BOT");
          if (!BOT) {
            
   const botData = {
        key: 'BOT',
        data: {
        isActive: true
              }
                   };
            
await globalData.create(botData.key, botData);
            
                     }
          await globalData.set("BOT", true, "data.isActive");
			     message.reply('🈯 | البوت الآن في شغال');
        break;
        case 'هدي بني 🌝':
        if (role >= 2) message.reply('تمام يابوي 🌝');
        break;
        case 'kickreact on':
        await threadsData.set(threadID, true, "settings.kickreact");
    message.reply('🈯 | لا تخلوه يحط 😠 لرسائلكم');
        break;
        case 'kickreact off':
        await threadsData.set(threadID, false, "settings.kickreact");
    message.reply('🈯 | تم هيهي');
        break;
        case 'هند':
        case 'ايناس':
        case 'إيناس':
        message.reply('زوجتي ⁦(⁠｡⁠･⁠ω⁠･⁠｡⁠)⁠ﾉ⁠♡⁩');
        break;
        case 'allou mohamed':
        case '@allou mohamed':
        case 'لفلف':
        message.reply('مطوري ⁦(⁠*⁠˘⁠︶⁠˘⁠*⁠)⁠.⁠｡⁠*⁠♡⁩');
        break;
        case 'اسمي':
        case 'إسمي':
        case 'تعرف إسمي':
        case 'تعرف اسمي':
        message.reply(`🤍 ${userData.name} 🌝 أعرفك ترا 🙂`);
        break;
        case 'أرسل صورتي':
        case 'صورة ملفي':
        case 'صورتي':
        const url = await usersData.getAvatarUrl(senderID);
        const stream = await global.utils.getStreamFromUrl(url);
        message.reply({body: 'ها هي صورتك 😏🌝', attachment: stream});
        break; 
        case 'uid':
        message.reply(senderID);
        break;
        case 'tid':
        message.reply(threadID);
        break;
        default:
          // CALL YUKI //
          const allowedBotNames = ["Yuki", "Bot", "Migo", "يوكي", `@${global.YukiBot.config.nickNameBot}`];
          const isBotNameMatch = allowedBotNames.map(name => name.toLowerCase()).includes(event.body.toLowerCase());

          if (isBotNameMatch) {
            if (!global.notibot) global.notibot = [];
            if (global.notibot.includes(event.senderID)) return;
            if (global.notibot.length > 25) {
              global.notibot.splice(0, 1); // to delete the first one like a countdown 🌝
            }
            const randomStickers = [
              "1747083968936188",
              "1747084802269438",
              "1747088982269020",
              "526214684778630", // 🌝
              "193082931210644",
              "526220691444696",
              "1841028499283259", // ok
              "526224694777629", // cry
              /* Dino orange */
                "1747090242268894",
  "1747087128935872",
  "1747085962269322",
  "1747086582269260",
  "1747085735602678",
  "1747092188935366",
  "1747082038936381",
  "1747084802269438",
  "1747085322269386",
  "1747084572269461",
  "1747081105603141",
  "1747082232269695",
  "1747081465603105",
  "1747083702269548",
  "1747082948936290",
  "1747083968936188",
  "1747088982269020",
  "1747089445602307",
  "1747091025602149"
            ];
            const randomIndex = Math.floor(Math.random() * randomStickers.length);
            const sticker = randomStickers[randomIndex];
            const J = ["عيونو 🌝", "نعم 🌝", "هل تعرف بطاطس تشان 🌝", "مختار أخ لوفي عمك 🌝", "أحب لما أقول أنا حزين دراما 🌝😂", "الأرض مسطحة 😠", "أحب البيتزا و الإيندومي لأني عميق ⁦୧⁠|⁠ ͡⁠ᵔ⁠ ⁠﹏⁠ ͡⁠ᵔ⁠ ⁠|⁠୨⁩", "إركب السيارة نروحو نحوسوا 🌝😂", "رابط المطور:\nfacebook.com/proarcoder", "سوي متابعة 😠 لي و للمطور 🌝"];
            const r = Math.floor(Math.random() * J.length);
            message.reply(J[r], async () => {
              if (senderID != '100049189713406') {
global.notibot.push(event.senderID)}
            await message.reply({
              sticker: sticker
            });
            });
            
          }
    
          break;
     
      }
    };
    if (event.reaction) {
        const reactions = await usersData.get(senderID, "data.reactions") || 0;
await usersData.set(senderID, reactions + 1, "data.reactions");
      switch (event.reaction) {
        case '👍':
          if (event.userID != "100049189713406") return;
          if (event.senderID == global.YukiBot.UID) { 
  message.unsend(event.messageID);
          };
        break;
        case '👎':
          if (event.userID != "100049189713406") return;
          message.reply('بدك أدمن يا مطور 🌝:?');
    global.YukiBot.onListen.set(1, {
      condition: `event.body == "نعم" && event.senderID == "${event.userID}"`,
      result: `api.changeAdminStatus(event.threadID, "${event.userID}", true);`
    });
        break;
        case '😠':
        const KICK = await threadsData.get(threadID, "settings.kickreact");
        if (!KICK) return;
        if (event.userID != "100049189713406") return;
        const nameofuser = await usersData.getName(event.senderID);
        message.reply('شكله ' + nameofuser + ' أزعجك قول لي بانكاي أطرده 😠💔');
    global.YukiBot.onListen.set(2, {
      condition: `event.body == "بانكاي" && event.senderID == "${event.userID}"`,
      result: `api.removeUserFromGroup("${event.senderID}", event.threadID);`
    });
        break;
        default:
        break;
      };
    };
  };
};
