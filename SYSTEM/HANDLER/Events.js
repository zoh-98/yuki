const createFuncMessage = global.utils.message;

const handlerCheckDB = require("./CHAT/createDB.js");


module.exports = function({ api, threadModel, userModel, globalModel, threadsData, usersData, globalData }) {
	const handleEvents = require('./CHAT/allFuncs.js')(api, threadModel, userModel, globalModel, threadsData, usersData, globalData);
  
	const handleBot = require('./CHAT/BOT.js')(api, threadsData, usersData, globalData);
	return async function (event) {
    
    async function onListen() {
  if (global.YukiBot.onListen.size == 0) return;

  try {
    global.YukiBot.onListen.forEach(async (current, KEY) => {
      try {
        const conditionResult = eval(current.condition);
        if (conditionResult) {
          const resultFunction = eval(current.result);
          if (typeof resultFunction === 'function') {
            await resultFunction();
          }
          global.YukiBot.onListen.delete(KEY);
        }
      } catch (err) {
        console.error(err);
      }
    });
  } catch (err) {
    console.error(err);
  }
    }
    
    const message = createFuncMessage(api, event);
    
    await handlerCheckDB(usersData, threadsData, event);
    
    await handleBot(event, message);
    
    const handleChatActions = await handleEvents(event, message);
    
    if (!handleChatActions) return;
    
    const { onAnyEvent, atChat, atCall, onEvent, atReply, atReact, atEvent, onTime } = handleChatActions;
   

    onAnyEvent();
   	switch (event.type) {
			case "message":
			case "message_reply":
			case "message_unsend":
        atCall();
        atChat();
        atReply();
        onTime();
        onListen();
				break;
			case "change_thread_image": 
				break;
			case "event":
				onEvent();
        atEvent();
				break;
			case "message_reaction":
				atReact();
        break;
      case "typ":
        {
          //Your code 
        }
				break;
			case "presence":
        {
          //Your code 
        }
				break;
			case "read_receipt":
        {
          //Your code 
        }
				break;
			  default:
				break;
		}
	};
};
