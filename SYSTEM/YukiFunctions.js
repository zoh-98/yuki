const Canvas = require('canvas');
const fs = require("fs");

async function CreateBankCard(bal, url) {
  const canvas = Canvas.createCanvas(800, 600); // Increase the canvas size for HD
  const ctx = canvas.getContext('2d');
  Canvas.registerFont("../keifont.ttf", { family: 'keifont' });

  // Draw circular profile picture with blue border
  const avatarSize = 300; // Increase the avatar size for HD
  const avatarX = (canvas.width - avatarSize) / 2;
  const avatarY = 100;
  ctx.beginPath();
  ctx.arc(avatarX + avatarSize / 2, avatarY + avatarSize / 2, avatarSize / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 10; // Increase border width for HD
  ctx.stroke();
  ctx.clip();
  
  const avatar = await Canvas.loadImage(url);
  ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);

  // Display balance
  ctx.fillStyle = 'grey'; // Change text color to grey
  ctx.font = 'bold 24px keifont';
  ctx.textAlign = 'center';
  ctx.fillText(`Your bank balance is: ${bal.toFixed(2)}`, canvas.width / 2, 500); // Adjust the position

  return canvas.toBuffer(); // Return the canvas as a buffer
}

function BoldText(text) {
    const replacements = {
        'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴', 'h': '𝗵',
        'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻', 'o': '𝗼', 'p': '𝗽',
        'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂', 'v': '𝘃', 'w': '𝘄', 'x': '𝘅',
        'y': '𝘆', 'z': '𝘇',
        'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚', 'H': '𝗛',
        'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡', 'O': '𝗢', 'P': '𝗣',
        'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨', 'V': '𝗩', 'W': '𝗪', 'X': '𝗫',
        'Y': '𝗬', 'Z': '𝗭',
        'À': '𝗔', 'Á': '𝗔', 'Ä': '𝗔', 'Æ': '𝗔', 'Å': '𝗔',
        'á': '𝗮'
    };

    const regex = new RegExp(Object.keys(replacements).join('|'), 'g');
    
    return text.replace(regex, match => replacements[match]);
}
function getUserOrder(userID, userDataArray) {
  const sortedData = userDataArray.sort((a, b) =>
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const userIndex = sortedData.findIndex(user => user.userID === userID);
  if (userIndex !== -1) {
  
    return userIndex + 1;
  } else {
    return -1; 
  }
}

function outOrder(userID, us) {
  const userOrder = global.yuki.getUserOrder(userID, us);
  if (userOrder !== -1) {
    return userOrder;
  } else {
    return `• ${userID} not found.`;
  }
}


const newUtils = {
  BoldText,
  outOrder,
  getUserOrder,
  CreateBankCard
};

module.exports = newUtils;