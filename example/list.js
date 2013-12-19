var _ = require('underscore');

module.exports = {
  name: 'locator plugin',
  type: 'private',
  matcher: /^where are you\\?/,
  authorized: function(nick) {
    return nick == 'bthesorceror';
  },
  onMatch: function() {
    console.log(this.channels());
    _.each(this.channels(), function(channel, name) {
      this.reply(name);
    }, this);
  },
  help: "type 'where are you' to cause the bot to list channel monitoring"
}

