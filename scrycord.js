var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
const https = require('https');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Listen for commands starting with '!'
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            case 'card':
              var cardName = args.join('+');
              if (cardName == undefined) {
                bot.sendMessage({
                      to: channelID,
                      message: 'You must provide a card name to search for.'
                  });
              }
              else {
              https.get('https://api.scryfall.com/cards/named?fuzzy=' + cardName, (res) => {
                logger.info('Connected to Scryfall. Searching for ' + cardName);
                logger.info('Headers: ' + res.headers);
                var cardObjJson = '';
                res.on('data', (d) => {
                  cardObjJson += d;
                });
                res.on('end', (cardObj) => {
                  cardObj = JSON.parse(cardObjJson);
                  logger.debug(cardObjJson);
                  var cardName = cardObj['name'];
                  var cardImgUrls = cardObj['image_uris'];
                  var normalUrl = cardImgUrls['normal'];
                  bot.sendMessage({
                        to: channelID,
                        message: normalUrl
                });
                }).on('error', (e) => {
                  logger.error('Error: ' + e);
                });
              });
              }
            break;

         }
     }
});
