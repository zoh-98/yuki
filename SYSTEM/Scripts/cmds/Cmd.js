const { execSync } = require('child_process');
    const { join } = require("path");
    const fs = require("fs-extra");


module.exports = {
  config: {
    name: "كوماند",
    aliases: ["cmd"],
    version: "1.0.0",
    role: 3,
    author: "Allou Mohamed",
    shortDescription: "إدارة الأوامر",
    category: "المطور",
    guide: "{pn} load | unload",
    countDown: 5,
},
  atCall: async function({ args, message, api }) {
   
  const allWhenChat = YukiBot.atChat;
    
   const loadCmd = function (filename, api) {

  try {
  const pathCommand = __dirname + `/${filename}.js`;
  if (!fs.existsSync(pathCommand)) throw new Error(`no file ${filename}.js founded`);
  const oldCommand = require(join(__dirname, filename + ".js"));
  const oldNameCommand = oldCommand.config.name;
       
  if (oldCommand.config.aliases) {
          let oldShortName = oldCommand.config.aliases;
          if (typeof oldShortName == "string") oldShortName = [oldShortName];
          for (let aliases of oldShortName) YukiBot.aliases.delete(aliases);

  }
 
  delete require.cache[require.resolve(pathCommand)];
  const command = require(join(__dirname, filename + ".js"));
  
  const configCommand = command.config;
        if (!configCommand) throw new Error("Config of command undefined");

  const nameScript = configCommand.name.toLowerCase();
  
  const indexWhenChat = allWhenChat.findIndex(item => item === oldNameCommand);

if (indexWhenChat !== -1) {
  allWhenChat[indexWhenChat] = null;
}
  
if (command.atChat) {
  allWhenChat.push(nameScript);
}
if (command.atEvent) {
  YukiBot.atEvent.set(nameScript, command);
}
  
if (configCommand.aliases) {
  let { aliases } = configCommand;

  if (typeof aliases == "string") {
    aliases = [aliases];
  }

  for (const aliasesYuki of aliases) {
    if (typeof aliasesYuki === "string") {
      if (YukiBot.aliases.has(aliasesYuki)) {
        throw new Error(`Short Name ${aliasesYuki} already exists in other command: ${YukiBot.aliases.get(aliasesYuki)}`);
      } else {
        YukiBot.aliases.set(aliasesYuki, configCommand.name);
      }
    }
  }
}

  
if (!command.config.name) throw new Error(`Command without name !`);


     if (command.onLoad) {
              try {
                command.onLoad({api});
              } catch (error) {
                const errorMessage = "Unable to load the onLoad function of the module."
                throw new Error(errorMessage, 'error');
              }
     }
  
  YukiBot.commands.delete(oldNameCommand);
        YukiBot.commands.set(nameScript, command);

  return {
          status: "succes",
          name: filename
        };
      }
      catch(err) {
        return {
          status: "failed",
          name: filename,
          error: err
        };
     }
   }
if (!args[0]) {
  return message.reply('❌ | load or loadall ?') 
} 
else if (args[0] == "load") {
      if (!args[1]) return message.reply("❌ | Enter cmd name");
      const infoLoad = loadCmd(args[1], api);
      if (infoLoad.status == "succes") message.reply(`🌝 | loaded command "${infoLoad.name}" successfully`);
      else message.reply(`❌ | load command ${infoLoad.name} Errors\n${infoLoad.error.stack.split("\n").filter(i => i.length > 0).slice(0, 5).join("\n")}`);
      YukiBot.atChat = allWhenChat.filter(item => item !== null);
    }
    else if (args[0].toLowerCase() == "loadall") {
      const allFile = fs.readdirSync(__dirname)
      .filter(item => item.endsWith(".js"))
      .map(item => item = item.split(".")[0]);
      const arraySucces = [];
      const arrayFail = [];
      for (let name of allFile) {
        const infoLoad = loadCmd(name, api);
        infoLoad.status == "succes" ? arraySucces.push(name) :
        arrayFail.push(`${name}: ${infoLoad.error.name}: ${infoLoad.error.message}`);
      }
      YukiBot.atChat = allWhenChat.filter(item => item !== null);
      message.reply(`🌝 | Loaded ${arraySucces.length} cmds Successfully`
        + `\n${arrayFail.length > 0 ? `\n❌ | Load errors: ${arrayFail.length} command\n${arrayFail.join("\n")})` : ""}`);
    }
  }
}
