module.exports = {
  config: {
    name: "بنك",
    aliases: ["bank"],
    version: "1.0",
    author: "allou Mohamed",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "",
      en: "البنك 🏦 نسخة جديدة"
    },
    category: "الألعاب"
  },
 langs: {
   ar: {
     bank_allou_list: "════𝗦𝗲𝗿𝘃𝗶𝗰𝗲𝘀════\n%1\n════════════════",
     bank_allou: "══════𝗕𝗮𝗻𝗸══════\n%1\n════════════════",
     bank_allou_bal: "══════𝗕𝗮𝗻𝗸══════\n#balance: %1 Da\n════════════════",
     login: "══════𝗕𝗮𝗻𝗸══════\n•تم تسجيلك في البنك بنجاح\n • إسم الحساب:\n%1\n════════════════",
     needAcc: "══════𝗕𝗮𝗻𝗸══════\n•أنت لم تسجل روح سجل و إرجع\n════════════════",
     need_money: "══════𝗕𝗮𝗻𝗸══════\n•#Login:\n • ثمن التسجيل:\n{ %1 Da }\n════════════════",
     Force_Loan: "👮🏾‍♂️ الشرطة يا لص !:\n%1",
     not_payed: "لقد أخذت قرض ولم ترجعه بعد 😒",
     transfer_Dm: "═══𝗧𝗿𝗮𝗻𝘀𝗳𝗲𝗿═════\n• الإسم: %3\n• المعرف: %1\n• مبلغ البنك المحول لك: %7 Da\n•كم كان معك سابقا: %6 Da\n•إسم حسابك في البنك: %4\n• معرفك: %2\n• كم كان مع الذي حول لك: %5 Da\n════════════════",
     reply_to: "رد على من تريد أن أحول له 🤨",
     redeem_on: "════𝗥𝗲𝗱𝗲𝗲𝗺𝗢𝗻════\n%1\n════════════════",
     redeem_off: "════𝗥𝗲𝗱𝗲𝗲𝗺𝗢𝗳𝗳════\n%1\n════════════════",
     old_trick: "• بدك تحول لنفسك و تسوي مضاعفة نقود يا كلب 🌝"
   }
 },
 atCall: async function({ usersData, threadsData, event, args, message, getLang, api }) {
   
   const services = "1: تسجيل\n2: إيداع\n3: عرض\n4: سحب\n5: قرض\n6: سدالقرض\n7: تحويل\n8: redeem (soon)\n══════𝗕𝗮𝗻𝗸══════\n• الفائدة تلقائية: => 10 رسائل تحصل على فائدة 50 Da 🙆‍♂️🤍\n❗ فقط لمن سجل في البنك";

   const service = args[0];
   
   if (!service) return message.reply(getLang("bank_allou_list", services));
   
   const amount = parseInt(args[1]);
   const id = event.senderID;
   //////////redeem///////////
   if (["redeem"].includes(service)) {
     if (["on", "تشغيل"].includes(args[1])) {
       await threadsData.set(event.threadID, true, "settings.sendBankRedeem");
       message.reply(getLang("redeem_on","تم تشغيل الوضع ✓"));
     }
     if (["off", "إيقاف"].includes(args[1])) {
       await threadsData.set(event.threadID, false, "settings.sendBankRedeem");
       message.reply(getLang("redeem_off","تم إيقاف الوضع ✓"));
     }
   }
   //////////login////////////
   if (["login", "تسجيل", "سجل"].includes(service)) {
     const usMo = await usersData.get(id, "money") || 0;
     const HOW = 2000;

     if (usMo < HOW) return message.reply(getLang("need_money", HOW));
    
     const username = await usersData.getName(id);
     
     await usersData.set(id, true, "data.has_bank_acc");
     await usersData.subtractMoney(id, 2000);
     message.reply(getLang('login', username));
   }
   const isR = await usersData.get(id, "data.has_bank_acc");

   if (isR != true) return message.reply(getLang("needAcc"));
  
  ///////////deposit//////////
  if (["deposit", "تخزين", "ايداع", "إيادع", "وضع"].includes(service)) {
    
    if (!amount) return message.reply('كم 😆 ؟');

    const res = await dpsMoneyToBank(amount, usersData, id);
    message.reply(getLang("bank_allou", res));
  }
   /////////withdraw/////////
   if (["withdraw", "wth", "سحب", "اخذ", "أخذ"].includes(service)) {
    
    if (!amount) return message.reply('كم 😆 ؟');

    const res = await wthMoneyFromBank(amount, usersData, id);
    message.reply(getLang("bank_allou", res));
      }
   ////////////bal////////
   if (["bal", "balance", "عرض"].includes(service)) {
     const usB = await usersData.get(id, "data.BankBal") || 0;
     message.reply(getLang("bank_allou_bal", usB));
   }
   //////////Loan////////
   if (["Loan", "loan", "قرض"].includes(service)) {
     const old = await usersData.get(id, "data.LoanSt");

     if (old == true) return message.reply(getLang("not_payed"));
     
     const Loan = 4000;
     
     const res = await addLoan(Loan, usersData, id);
     message.reply(getLang("bank_allou", res));
     
   }
   ////////////payLoan/////////
   if (["payLoan", "payloan", "سدالقرض"].includes(service)) {
     const res = await payLoan(id, usersData);
     return message.reply(getLang("bank_allou", res));
   }

   if (["transfer", "تحويل"].includes(service)) {
     

     if (event.type != "message_reply") return message.reply(getLang("reply_to"));
     
     const To = event.messageReply.senderID;

     const res = await transfer(id, To, usersData, amount, api, getLang);

     message.reply(getLang("bank_allou", res));
   }
 },
  
  atChat: async function({getLang, usersData, message, event }) {
    
    const id = event.senderID;
    const old = await usersData.get(id, "data.LoanSt");
    const isR = await usersData.get(id, "data.has_bank_acc");

    if (isR != true) return;

    await addGift(id, usersData);
    
    const res = await checkForLoan(id, usersData);

    if (!res) return;
    
    await aiGetTheLoan(id, usersData);
      message.reply(getLang("Force_Loan", res));
      

    
  }
 }

async function wthMoneyFromBank(amount, usersData, id) {
  try {
    let crrM = await usersData.get(id, "money") || 0;
    let crrBank = await usersData.get(id, "data.BankBal") || 0;

    if (isNaN(amount)) return '• مسموح فقط الأرقام';

    if (amount > crrBank) return '• المبلغ كبير عليك 🤣';

    await usersData.set(id, crrBank - amount, "data.BankBal");
    await usersData.addMoney(id, amount);

    return `• تم سحب ${amount} Da من حسابك البنكي و هي الآن في رصيدك`;

  } catch (error) {
    console.error(error.message);
    return error.message;
  }
  }


async function dpsMoneyToBank(amount, usersData, id) {
  try {
    if (isNaN(amount)) return '• أدخل رقم فقط';

    
    let crrBank = await usersData.get(id, "data.BankBal") || 0;

    let crrM = await usersData.get(id, "money") || 0;
    
    if (amount > crrM) return '• لا يوجد معك هذا المبلغ';
    
    let newBankBalance = crrBank + amount;

    await usersData.set(id, newBankBalance, "data.BankBal");
    await usersData.subtractMoney(id, amount);

    return `•تم بنجاح إيداع ${amount} Da في حسابك.`; 

  } catch (error) {
    console.error(error.message);
    
    return `• حدث خطأ: \n${error.message}`; 
  }
}

async function addLoan(amount, usersData, id) {
  
  let crrBank = await usersData.get(id, "data.BankBal") || 0;

  await usersData.set(id, crrBank + amount, "data.BankBal");

  await usersData.set(id, Date.now(), "data.LoanDate");

  await usersData.set(id, true, "data.LoanSt");

  
  
  return `• لقد تم إعطائك قرض بقيمة ${amount}\n📝 سيتم عقابك إذا لم تدفعه في 4 ساعات 👾 مش مزح`;
}

async function checkForLoan(id, usersData) {
  
  const firstLoan = await usersData.get(id, "data.LoanDate");
  const old = await usersData.get(id, "data.LoanSt");
  
  if (!old) return;
  
const currentTime = Date.now();

const byAllouMohamed = 4 * 3600000;


   if (currentTime - firstLoan > byAllouMohamed) {
     return '• تم أخذ القرض الذي لم تدفع ثمنه من رصيدك أو أكثر شوي 😈 لقد قلت لك ستعاقب بعد أربع ساعات...';  
   } else {
     return false;
   }
}

async function aiGetTheLoan(id, usersData) {
  
  await usersData.set(id, 0, "data.BankBal");
  await usersData.set(id, null, "data.LoanDate");
  await usersData.set(id, false, "data.LoanSt");

  return true;
  
} 
async function payLoan(id, usersData) {
   const crrM = await usersData.get(id, "money") || 0;
   if (crrM < 4000) return '• لا تملك المال الكافي معك (في رصيدك ليس في البنك)';

   await usersData.subtractMoney(id, 4000);
 
   await usersData.set(id, false, "data.LoanSt");

  await usersData.set(id, null, "data.LoanDate");
    
    
  
  return '• تم سد القرض من رصيدك ممتاز ✓';
}

async function transfer(From, To, usersData, amount, api, getLang) {

   if (From == To) return getLang("old_trick");
  
   const FcrrBank = await usersData.get(From, "data.BankBal") || 0;

   const TcrrBank = await usersData.get(To, "data.BankBal") || 0;

   const Tname = await usersData.getName(To);

   const Fname = await usersData.getName(From);

   if (isNaN(amount) || amount < 1000) return '• المبلغ يجب أن يكون أكبر من 1000 Da';
  
   if (amount > FcrrBank) return '• المبلغ أقل من رصيدك البنكي 😹';

   await usersData.set(From, FcrrBank - amount, "data.BankBal");

   await usersData.set(To, TcrrBank + amount, "data.BankBal");
  
   api.sendMessage(getLang("transfer_Dm", From, To, Fname, Tname, FcrrBank, TcrrBank, amount), To);

  return '• تمت عملية التحويل بنجاح'
   
}

async function addGift(id, usersData) {
  
  const crrBank = await usersData.get(id, "data.BankBal") || 0;

  await usersData.set(id, crrBank + 5, "data.BankBal");

  return; /*console.log('added gift 🎁');*/

}



 