const fast = require("fast-speedtest-api");
module.exports = {
  config: {
    name: "معلومات",
    aliases: ["ping", "uptime"],
    category: 'معلومات',
    author: "Allou Mohamed",
    role: 2,
    description: "معلومات البوت",
    countDown: 10,
    guide: '{pn}'
  },
    langs: {
      ar: {
        resault: "# Uptime:\n-Ping: %1 MB/s\n-RunTime: %2"
      }
    },
  
    atCall: async function({ message, getLang }) { 
		const speedTest = new fast({
			token: "YXNkZmFzZGxmbnNkYWZoYXNkZmhrYWxm",
			verbose: false,
			timeout: 10000,
			https: true,
			urlCount: 5,
			bufferSize: 8,
			unit: fast.UNITS.Mbps
		});
		const resault = await speedTest.getSpeed();
    const runningTime = calculateProjectRunningTime();
		return message.reply(getLang ("resault", removeDecimal(resault), runningTime));
  }
}

function removeDecimal(number) {
  const numberString = number.toString();
  const integerPart = numberString.split('.')[0];
  const result = parseInt(integerPart);
  return result;
}

function calculateProjectRunningTime() {
  const projectStartTime = global.YukiBot.start
  const currentTime = Date.now();
  const timeDifference = new Date(currentTime - projectStartTime);

  const hours = timeDifference.getUTCHours();
  const minutes = timeDifference.getUTCMinutes();
  const seconds = timeDifference.getUTCSeconds();

  return `${hours} h, ${minutes} min, ${seconds} s`;
}

