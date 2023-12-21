

module.exports = {
  config: {
    name: "إحزر2",
    aliases: ["guessnumber2"],
    version: "1.0",
    price: 0,
    author: "Allou Mohamed",
    countDown: 0,
    role: 0,
    shortDescription: "إحزر الرقم 2",
    category: "الألعاب",
    inbox: true,
  },

  atCall: async function ({ message, event, commandName, args }) {
    const secretNumber = generateRandomNumber();
    let maxAttempts = parseInt(args[0]);
    if (isNaN(maxAttempts) || !maxAttempts) {
  maxAttempts = 10;
    }
    
    message.reply(`📜 | أهلا بك نفس قوانين اللعبة الأولى ! أدخل توقعاتك المكونة من 4 أرقام.\n🛡️ | الفرص ${maxAttempts} فرص.`, (err, info) => {
      global.YukiBot.atReply.set(info.messageID, {
        commandName,
        secretNumber,
        attempts: maxAttempts,
        mid: info.messageID,
        guesses: [],
      });
    });
  },

  atReply: async function ({ message, event, Reply }) {
    const { secretNumber, mid, commandName, guesses } = Reply;
    
    const userGuess = event.body;
    const maxAttempts = Reply.attempts;
    
    if (!isValidGuess(userGuess)) {
      message.reply("📜 | مسموح فقط إدخال 4 أرقام.");
      return;
    }

    const result = checkGuess(secretNumber, userGuess);
    guesses.push(`[${result.correct}] ${userGuess} [${result.totalCorrect}]`);
    const attempts = Reply.attempts - 1;

    if (result.correct === 4 && result.totalCorrect === 4) {
      message.reply(`✅ | توقعت الرقم  (${secretNumber}). لقد فزت`);
      global.YukiBot.atReply.delete(message.replyToID);
    } else if (attempts > 0) {
      const replyMessage = `${guesses.join('\n')}\n\n🛡️ | تبقى لك ${attempts} فرص.\n📜 | إجمالي عدد الفرص  ${maxAttempts} فرص`;

      message.reply(replyMessage, (err, info) => {
        global.YukiBot.atReply.set(info.messageID, {
          commandName,
          secretNumber,
          mid: info.messageID,
          attempts,
          guesses,
        });
      });
    } else {
      message.reply(`⚔️ | إنتهت اللعبة و الرقم الصحيح كان  ${secretNumber}.`);
      global.YukiBot.atReply.delete(mid);
    }
  }
};

  function generateRandomNumber() {
    let digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    let number = "";

    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      const digit = digits[randomIndex];
      digits.splice(randomIndex, 1);
      number += digit;
    }

    return number;
  }


  function isValidGuess(guess) {
    return /^\d{4}$/.test(guess);
  }

  function checkGuess(secret, guess) {
  let correct = 0;
  let totalCorrect = 0;
  const secretCounts = {};
  const guessCounts = {}; 
    
  for (let i = 0; i < secret.length; i++) {
    const digit = secret[i];
    secretCounts[digit] = (secretCounts[digit] || 0) + 1;
  }

  for (let i = 0; i < guess.length; i++) {
    const digit = guess[i];
    guessCounts[digit] = (guessCounts[digit] || 0) + 1;
    if (secret[i] === digit) {
      correct++;
    }
  }

  for (const digit in guessCounts) {
    if (secretCounts[digit]) {
      totalCorrect += Math.min(secretCounts[digit], guessCounts[digit]);
    }
  }

  return { correct, totalCorrect };
    }
        

