const chalk = require("chalk");
const gradient = require("gradient-string");
const moment = require("moment-timezone");

function customColorize(message) {
  const customColorPattern = /(\w+)\(([^)]+)\)/g;
  return message.replace(customColorPattern, (match, color, word) => {
    switch (color.toLowerCase()) {
  case "red":
    return chalk.red(word);
  case "green":
    return chalk.green(word);
  case "yellow":
    return chalk.yellow(word);
  case "blue":
    return chalk.blue(word);
  case "cyan":
    return chalk.cyan(word);
  case "magenta":
    return chalk.magenta(word);
  case "white":
    return chalk.white(word);
  case "gray":
    return chalk.gray(word);
  case "black":
    return chalk.black(word);
  case "purple":
    
    return chalk.hex('#800080')(word); 
  default:
    return word;
    }
  });
}

async function logger(content, WT, User, Time, commandName, UID) {
  let text;
  let pl; 

  if (WT == "warn") {
    text = chalk.hex('#FFFF00')(content);
    const inf = WT.toUpperCase();
    const pscs = inf;
    pl =  chalk.bold.hex('#FFFF00')('⭔ ' + pscs);
    console.log(`  ${pl}   ${text}`);
  }
  if (WT == "error") {
    text = chalk.hex('#FF0000')(content);
    const inf = WT.toUpperCase();
    const pscs = inf;
    pl =  chalk.bold.hex('#FF0000')('⭔ ' + pscs);
    console.log(`  ${pl}   ${text}`);
  }
  if (WT == "info") {
    text = chalk.hex('#00FF7F')(content);
    const inf = WT.toUpperCase();
    const pscs = inf;
    pl =  chalk.bold.hex('#00FF7F')('⭔ ' + pscs);
    console.log(`  ${pl}   ${text}`);
  }
  if (WT == "CallCommand") {
    cmd = gradient.summer(`⭔ Command: ${commandName.toUpperCase()}`);
    args = gradient.summer(`⭔ UID: ${UID}\n⭔ User: ${User}\n⭔ ARGS: ${content || 'No args'}`);
    const inf = 'Call Command:'.toUpperCase();
    const pscs = gradient.fruit(inf);
    pl =  chalk.bold(pscs);
    
    pscs2 = chalk.grey(Time);
    console.log(`${pscs2} ${pl}\n${cmd}\n${args}`);
    }
  if (content == "CallEvent") {
    cmd = gradient.summer(`⭔ Event: ${User.toUpperCase()}`);

    const inf = 'Run Event:'.toUpperCase();
    const pscs = gradient.fruit(inf);
    pl =  chalk.bold(pscs);
    pscs2 = chalk.grey(WT);
    console.log(`${pscs2} ${pl}\n${cmd}`);
  }
  if (content == "DataBase") {
    DBTYPE = gradient.vice(WT.toUpperCase());
    text = `⭔ Connected to ${DBTYPE} database `;
    console.log(text);
  }
  if (content == "Loader") {
    ld = gradient.vice(WT.toUpperCase());
    text = `⭔ Loaded ${chalk.bold.green(User)} ${ld} succeefully`;
    if (!Time) { 
    console.log(text);
    } else {
    text = `× Can't Load ${chalk.bold.red(User)} ${ld}`
    console.log(text);
    }
  }
  if (content == "Facebook") {
    text = WT;
    if (!User) {
console.log(`${chalk.bold.hex('#FFFF00')('⭔ FACEBOOK')} ${text}`);
    } else {
      text2 = `${chalk.bold.hex('#FFFF00')('⭔ FACEBOOK')} ${chalk.red('Error:')} ${text}`;
      console.log(text2);
    }
  }
  if (content == "logo") {
    const logo = `                          
       █▄█ █ █ █▄▀ █ █▄▄ █▀█ ▀█▀
        █  █▄█ █ █ █ █▄█ █▄█  █ 

 Bot Launcher Created By Allou Mohamed
             For Messenger
 `;
    const c = [
  "#00FFFF", "#00FFFF"  
];
    const text = gradient(c)(logo);
    console.log(text);
  }
  if (content == 'line') {
    console.log(gradient(["#FFFF00", "#FF0000", "#00FF7F"])('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'));
  }
}

async function logo(op, version) {
  const logoText = `
      █▄█ █░█ █▄▀ █   █▄▄ █▀█ ▀█▀
      ░█░ █▄█ █░█ █   █▄█ █▄█ ░█░

A simple bot chat by Allou Mohamed V${version}`;

  const gradientColors = [
  "#FF5733",
  "#FF4533",
  "#FF3333",
  "#FF2222",
  "#FFA500",
  "#FF8C00",
  "#FF7F00",
  "#FF6600"
];

  let colorfulLogo = gradient(gradientColors)(logoText);
  if (op == "rai") {
    colorfulLogo = gradient.rainbow(logoText);
  }

  if (op == "anm") {
    colorfulLogo = gradient.instagram(logoText);
  }

  if (op == "teee") {
    colorfulLogo = gradient.teen(logoText);
  }
  
  
  console.log(colorfulLogo);
}
      
async function text(Text) {
  const colorMap = {
    '--green': '\x1b[38;2;0;255;0m',
    '--red': '\x1b[38;2;255;0;0m',
    '--blue': '\x1b[38;2;0;0;255m',
    '--orange': '\x1b[38;2;255;165;0m',
    '--purple': '\x1b[38;2;128;0;128m',
    '--white': '\x1b[38;2;255;255;255m',
    '--yellow': '\x1b[38;2;255;255;0m',
  };

  let formattedText = Text;

  for (const code in colorMap) {
    const color = colorMap[code];
    formattedText = formattedText.replace(code, color);
  }

  console.log(formattedText + '\x1b[0m');
}


async function Line() {
  const bigLine = '\x1b[38;2;128;0;128m══════════════════════════════════════════\x1b[0m';
  console.log(bigLine);
}

async function boldText(Text) {
  const colorMap = {
    '--green': '\x1b[1;38;2;0;255;0m',
    '--red': '\x1b[1;38;2;255;0;0m',
    '--blue': '\x1b[1;38;2;0;0;255m',
    '--orange': '\x1b[1;38;2;255;165;0m',
    '--purple': '\x1b[1;38;2;128;0;128m',
    '--white': '\x1b[1;38;2;255;255;255m',
    '--yellow': '\x1b[1;38;2;255;255;0m',
  };

  const customRed = '\x1b[1;38;2;255;0;0m';
  let formattedText = Text;

  formattedText = formattedText.replace(/--red/g, customRed);

  for (const code in colorMap) {
    const color = colorMap[code];
    formattedText = formattedText.replace(new RegExp(code, 'g'), color);
  }

  console.log(formattedText + '\x1b[0m');
}



module.exports = { logger, logo, text, Line, boldText };
