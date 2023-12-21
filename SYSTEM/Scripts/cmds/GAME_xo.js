const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

const gameData = {
  Board: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
  player_a: null,
  player_a_name: null,
  player_b: null,
  player_b_name: null,
  positions: [],
  turn: null
};

function checkWin(player) {
  const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6],          
  ];

  for (const combo of winCombos) {
    const [a, b, c] = combo;
    if (gameData.Board[a] === player && gameData.Board[b] === player && gameData.Board[c] === player) {
      return true;
    }
  }
  return false;
}

function checkDraw() {
  return !gameData.Board.some((cell) => !isNaN(cell));
}

function updateBoard(position, player) {
  if (gameData.Board[position - 1] !== 'x' && gameData.Board[position - 1] !== 'o') {
    gameData.Board[position - 1] = player;
    gameData.positions.push({ position, player });
    return true;
  }
  return false;
}

const drawInf = {
  x: `${__dirname}/canvas/ttt/X.png`,
  o: `${__dirname}/canvas/ttt/O.png`,
  1: `${__dirname}/canvas/ttt/1.png`,
  2: `${__dirname}/canvas/ttt/2.png`,
  3: `${__dirname}/canvas/ttt/3.png`,
  4: `${__dirname}/canvas/ttt/4.png`,
  5: `${__dirname}/canvas/ttt/5.png`,
  6: `${__dirname}/canvas/ttt/6.png`,
  7: `${__dirname}/canvas/ttt/7.png`,
  8: `${__dirname}/canvas/ttt/8.png`,
  9: `${__dirname}/canvas/ttt/9.png`,
  board: `${__dirname}/canvas/ttt/Board.jpg`,
};

module.exports = {
  config: {
    name: "إكس_او",
    aliases: ["xo"],
    version: "1.0",
    price: 0,
    author: "Allou Mohamed",
    countDown: 0,
    role: 0,
    shortDescription: "لعبة إكس أو",
    category: "الألعاب",
    inbox: true,
  },

  atCall: async function ({ message, event, commandName, usersData }) {
    
    if (args[0] == 'إنهاء') {
      await resetGame();
      message.reply('✅ | 🌝🏹 تم ✓');
      return;
    }
    
    if (!gameData.player_a) {
      gameData.player_a = event.senderID;
      gameData.player_a_name = await usersData.getName(event.senderID);
      message.reply(`إنظم أول لاعب  (${gameData.player_a_name}), أنت الرمز 'X'. ليكتب اللاعب الثاني xo...`);
      gameData.turn = event.senderID;
    } else if (!gameData.player_b) {
      gameData.player_b = event.senderID;
      gameData.player_b_name = await usersData.getName(event.senderID);
      message.reply(`إنظم اللاعب الثاني (${gameData.player_b_name}), أنت رمز 'O'. بدأت اللعبة !`);
      renderGameBoard(message, event, commandName, gameData.Board, gameData.player_a_name);
    } else {
      message.reply("الناس تلعب حاليا إنتضر دورك 🌝.");
    }
  },

  atReply: async function ({ message, event, Reply, usersData }) {
    if (gameData.player_a === event.senderID || gameData.player_b === event.senderID) {
      const currentPlayer = gameData.player_a === event.senderID ? 'x' : 'o';
      const otherPlayer = gameData.player_a === event.senderID ? 'o' : 'x';

      if (gameData.turn !== event.senderID) {
        message.reply("مش دوورك 🌝🏹");
        return;
      }
      let turnName; if (otherPlayer == 'x') {
        turnName = gameData.player_a_name;
      } else {
        turnName = gameData.player_b_name;
      }

      if (!checkWin(currentPlayer) && !checkDraw()) {
        const move = parseInt(event.body);

        if (isNaN(move) || move < 1 || move > 9) {
          message.reply("تمزح ولا أعمى ؟ 🌝🏹");
        } else {
          if (updateBoard(move, currentPlayer)) {
            renderGameBoard(message, event, Reply.commandName, gameData.Board, turnName);

            if (checkWin(currentPlayer)) {
              let name;
              if (currentPlayer == 'x') {
                name = gameData.player_a_name;
              } else {
                name = gameData.player_b_name;
              }
message.reply(`${name} فاز ! اللعبة إنتهت.`);
              resetGame();
            } else if (checkDraw()) {
              message.reply("تعادل الكل ينقلع 🌝🏹.\nمش مصدق ؟ شوف الصورة تحت 🌝❎");
              resetGame();
            }

            
            gameData.turn = gameData.turn === gameData.player_a ? gameData.player_b : gameData.player_a;
          } else {
            message.reply("أحم يا أعمى ركز 🌝🏹.");
          }
        }
      } else {
        message.reply(`اللعبة خلصت 🌝. ${otherPlayer} فاز !`);
        resetGame();
      }
    }
  },
};

function resetGame() {
  gameData.player_a = null;
  gameData.player_b = null;
  gameData.positions = [];
  gameData.turn = null;
  gameData.Board = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
}
function renderGameBoard(message, event, commandName, boardArray, name) {
  const canvas = createCanvas(360, 360);
  const ctx = canvas.getContext('2d');
  ctx.font = '40px Arial';

  loadImage(drawInf.board).then((boardImage) => {
    ctx.drawImage(boardImage, 0, 0, 360, 360);

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const cellValue = boardArray[row * 3 + col];

        if (cellValue === 'x' || cellValue === 'o') {
          
          loadImage(drawInf[cellValue]).then((symbol) => {
            ctx.drawImage(symbol, col * 120, row * 120, 120, 120);
          });
        } else {
          /*
          ctx.fillText(cellValue.toString(), col * 120 + 50, row * 120 + 100);
          */
          loadImage(drawInf[cellValue]).then((cell) => {
            ctx.drawImage(cell, col * 120, row * 120, 120, 120);
          });
        }
      }
    }

    const boardImageOutput = fs.createWriteStream(`${__dirname}/canvas/ttt/game_board.png`);
    const stream = canvas.createPNGStream();
    stream.pipe(boardImageOutput);

    boardImageOutput.on('finish', () => {
      const readStream = fs.createReadStream(`${__dirname}/canvas/ttt/game_board.png`);
      message.reply({
        body: 'إنه دور اللاعب:\n' + name,
        attachment: readStream,
      }, (err, info) => {
        global.YukiBot.atReply.set(info.messageID, {
          commandName
        });
      });
    });
  });
}
