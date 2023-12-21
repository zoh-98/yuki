const axios = require("axios");
const { logger } = global.YukiBot;
const express = require("express");

const app = express();
const PORT = 3001;
module.exports = async (api) => {

  app.get('/', function(req, res) {
    
    const URL = `${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`.toLowerCase();
    res.send('YUKI BOT URL: ' + URL);
  });

  app.listen(PORT, () => {
    logger(`• Yuki is running on port: ${PORT}`, 'info');
    logger('line');
  });
}
