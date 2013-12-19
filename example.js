var Bot = require('./index');

var plugin1 = {
  name: 'hello plugin',
  type: 'private',
  matcher: /^hello (.*)/,
  authorized: function(nick) {
    return nick == 'bthesorceror';
  },
  onMatch: function(name) {
    this.reply("Hello, " + name);
  },
  help: "there is a command in my beer!"
}

var plugin2 = {
  name: 'joiner plugin',
  type: 'private',
  matcher: /^join (#.*)/,
  authorized: function(nick) {
    return nick == 'bthesorceror';
  },
  onMatch: function(channel) {
    this.join(channel);
    this.reply("Joining " + channel);
  },
  help: "type 'join {channel}' to cause the bot to join a channel"
}

var bot = new Bot('irc.freenode.net', {
  nick: 'botter1',
  port: 6667
});

bot.register(plugin1);
bot.register(plugin2);

bot.on('error', function(error) {
  console.error(error);
});

bot.join('#randomchannel123');
