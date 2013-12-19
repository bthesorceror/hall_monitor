var _   = require('underscore');
var Bot = require('../index');

var bot = new Bot('irc.freenode.net', {
  nick: 'botter1',
  port: 6667
});

bot.register(require('./hello'));
bot.register(require('./join'));
bot.register(require('./list'));

bot.on('error', function(error) {
  console.error(error);
});
