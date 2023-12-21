const { removeHomeDir } = global.utils;
const { logger } = global.YukiBot;

module.exports = {
	config: {
		name: "تجربة",
    aliases: ["eval"],
    price: 0,
		version: "1.4",
		author: "NTKhang",
		countDown: 5,
		role: 2,
		shortDescription: "تجربة أمر للمطور",
		category: "المطور",
		guide: "{pn}"
	},

	
	atCall: async function ({ api, args, message, event, threadsData, usersData, threadModel, role, commandName, globalData }) {
		function output(msg) {
			if (typeof msg == "number" || typeof msg == "boolean" || typeof msg == "function")
				msg = msg.toString();
			else if (msg instanceof Map) {
				let text = `Map(${msg.size}) `;
				text += JSON.stringify(mapToObj(msg), null, 2);
				msg = text;
			}
			else if (typeof msg == "object")
				msg = JSON.stringify(msg, null, 2);
			else if (typeof msg == "undefined")
				msg = "undefined";

			message.reply(msg);
		}
		function out(msg) {
			output(msg);
		}
		function mapToObj(map) {
			const obj = {};
			map.forEach(function (v, k) {
				obj[k] = v;
			});
			return obj;
		}
		const cmd = `
		(async () => {
			try {
				${args.join(" ")}
			}
			catch(err) {
				message.reply(
					"'❌ | Error: '\\n" +
					(err.stack ?
						removeHomeDir(err.stack) :
						removeHomeDir(JSON.stringify(err, null, 2))
					)
				);
			}
		})()`;
		eval(cmd);
	}
};