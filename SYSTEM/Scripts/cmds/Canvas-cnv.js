const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  config: {
    name: 'صمملي',
    author: 'Allou Mohamed',
    version: '1.0.0',
    role: 0,
    category: 'تصميم',
    guide: '{pn}',
    description: 'أمر مميز هه.'
  },
  atCall: async function({ message, event, usersData }) {
   
    const name = await usersData.getName(event.senderID); // Make sure to put the name in quotes
    const picture = await loadImage(await usersData.getAvatarUrl(event.senderID));
    
    // Load the background image
    const background = await loadImage('https://i.ibb.co/W0r73Y0/background.jpg');

    // Set the HD resolution
    const canvasWidth = 800;
    const canvasHeight = 800;

    // Create a canvas
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');

    // Draw the background image
    ctx.drawImage(background, 0, 0, canvasWidth, canvasHeight);

    // Create a blue-bordered circle
    const radius = canvasWidth / 3; // Adjust the size of the circle as needed
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 10; // Adjust the border width as needed for HD
    ctx.strokeStyle = 'blue';
    ctx.stroke();
    ctx.closePath();

    // Clip the image to the shape of the circle with HD scale
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(picture, centerX - radius, centerY - radius, radius * 2, radius * 2);
    ctx.restore();

    // Add user's name in bold
    ctx.font = 'bold 60px Arial'; // Adjust the font size and style as needed for HD
    ctx.fillStyle = 'white'; // Color of the text
    ctx.textAlign = 'center';
    ctx.fillText(name, centerX, centerY + radius + 60); // Adjust the position for HD

    // Create a PNG stream and send the HD image
    const out = fs.createWriteStream(__dirname + '/cache/avatarHD.png');

    const stream = canvas.createPNGStream();
    stream.pipe(out);

    out.on('finish', () => {
      message.reply({
        attachment: fs.createReadStream(__dirname + '/cache/avatarHD.png')
      });
    });
  }
};
    