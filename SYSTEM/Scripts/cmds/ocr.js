const axios = require("axios");
const Tesseract = require("tesseract.js");

module.exports = {
  config: {
    name: "نص-الصورة",
    aliases: ["ocr"],
    version: "1.0",
    author: "Loufi",
    category: "خدمات",
    shortDescription: "إستخراج نص من صورة"
    },
  atCall: async function ({ message, event }) {
    try {
    
      if (!event.messageReply || !event.messageReply.attachments) {
        return message.reply("رد على صورة .-.");
      }

      const imageAttachment = event.messageReply.attachments[0];
      if (imageAttachment.type !== "photo") {
        return message.reply("رد على صورة فقط ._.");
      }

      // Get the image URL
      const imageUrl = imageAttachment.url;

      // Download the image
      const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
      const imageBuffer = Buffer.from(imageResponse.data, "binary");

      // Perform OCR on the image
      const { data } = await Tesseract.recognize(imageBuffer, "eng");

      // Extract the recognized text
      const extractedText = data.text;

      // Reply with the extracted text
      message.reply(`${extractedText}`);
    } catch (error) {
      console.error("._.:", error);
      message.reply("تحقق من صورتك ._.");
    }
  }
};