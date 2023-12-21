    const axios = require("axios");
    const fs = require("fs-extra");
    const ytdl = require("ytdl-core");
    const request = require("request");
    const yts = require("yt-search");

module.exports = {
  config: {
    name: "أغنية",
    version: "1.0",
    role: 0,
    author: "KSHITIZ",
    cooldowns: 5,
    shortDescription: "الحصول على كتابة أغنية و الأغنية معا",//use offical music name 
    category: "أغاني",
    guide: "{pn} (إسم الأغنية بالإنجليزية و بدون خطأ)",
    },

  atCall: async ({ api, event, args }) => {
    
    const song = args.join(' ');
    if (!args[0]) return;
    try {
      api.sendMessage(`🕵️‍♂️ | جاري البحث عن كتابة "${song}".\n⏳ | أصبر قليلا...`, event.threadID);

      const res = await axios.get(`https://api.popcat.xyz/lyrics?song=${encodeURIComponent(song)}`);
      const lyrics = res.data.lyrics || "";
      const title = res.data.title || "song";
      const artist = res.data.artist || "";

      const searchResults = await yts(song);
      if (!searchResults.videos.length) {
        return api.sendMessage("السيرفر مشغول الرجاء إبلاغ المطور عن الخطأ | ❎", event.threadID, event.messageID);
      }

      const video = searchResults.videos[0];
      const videoUrl = video.url;

      const stream = ytdl(videoUrl, { filter: "audioonly" });

      const fileName = `${event.senderID}.mp3`;
      const filePath = __dirname + `/cache/${fileName}`;

      stream.pipe(fs.createWriteStream(filePath));

      stream.on('response', () => {
        //console.info('[DOWNLOADER]', 'Starting download now!');
      });

      stream.on('info', (info) => {
        //console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} by ${info.videoDetails.author.name}`);
      });

      stream.on('end', () => {
       // console.info('[DOWNLOADER] Downloaded');

        if (fs.statSync(filePath).size > 26214400) {
          fs.unlinkSync(filePath);
          return api.sendMessage('[ERR] The file could not be sent because it is larger than 25MB.', event.threadID);
        }

        const message = {
          body: `❏العنوان: ${title}\n\n❏الأغنية: ${lyrics}`,
          attachment: fs.createReadStream(filePath)
        };

        api.sendMessage(message, event.threadID, () => {
          fs.unlinkSync(filePath);
        });
      });
    } catch (error) {
     // console.error('[ERROR]', error);
      api.sendMessage('try again later > error.', event.threadID);
    }
  }
};