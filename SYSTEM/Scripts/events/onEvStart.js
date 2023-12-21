const allOnEvent = global.YukiBot.Event;

module.exports = {
	config: {
		name: "onEvent",
		version: "1.1",
		author: "NTKhang",
		description: "Loop to all event in global.YukiBot.Event and run when have new event",
		category: "events"
	},

	onRun: async ({ api, message, event, threadsData, usersData, role }) => {
		for (const item of allOnEvent) {
			if (typeof item === "string")
				continue;
			item.onListen({ api, message, event, threadsData, usersData, role  });
		}
	}
};