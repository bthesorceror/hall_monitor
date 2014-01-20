var _            = require('underscore');
var irc          = require('irc');
var EventEmitter = require('events').EventEmitter;

function createClient(server, options) {
  return new irc.Client(server, options.nick, options);
}

function authorized(plugin, nick) {
  return (!plugin.authorized || plugin.authorized(nick));
}

function pluginHelpMessage(plugin) {
  return "HELP:: " + plugin.name + " (" + plugin.type + ") -> " +
    plugin.help
}

function handlePluginHelp(plugin, from) {
  if (!authorized(plugin, from)) return;
  this.say(from, pluginHelpMessage(plugin));
}

function handlePluginMessage(plugin, from, message) {
  var matches = message.match(plugin.matcher);
  if (!matches) return;
  if (!authorized(plugin, from)) return;

  var args = matches.slice(1);

  plugin.onMatch.apply({
    nick: from,
    raw_message: message,
    join: _.bind(this.join, this),
    reply: _.bind(this.say, this, from),
    channels: _.bind(this.channels, this)
  },
  args);
}

var defaults = {
  nick: 'onebotterone',
  port: 6667
}

function Bot(server, options) {
  EventEmitter.call(this);
  this.plugins = [];
  this.options = _.extend(_.clone(defaults), options || {});
  this.client  = this.options.client || createClient(server, this.options);
  this.bindEvents();
}

(require('util')).inherits(Bot, EventEmitter);

Bot.prototype.register = function(plugin) {
  this.plugins.push(plugin);
}

Bot.prototype.channels = function() {
  return this.client.chans;
}

Bot.prototype.onHelp = function(nick) {
  _.each(this.plugins, function(plugin) {
    handlePluginHelp.call(this, plugin, nick);
  }, this);
}

Bot.prototype.onPluginMessage = function(nick, message) {
  _.each(this.plugins, function(plugin) {
    handlePluginMessage.call(this, plugin, nick, message);
  }, this);
}

Bot.prototype.onPrivateMessage = function(nick, message) {
  if (message == 'help') {
    this.onHelp(nick);
  } else {
    this.onPluginMessage(nick, message);
  }
}

Bot.prototype.say = function() {
  this.client.say.apply(this.client, arguments);
}

Bot.prototype.join = function() {
  this.client.join.apply(this.client, arguments);
}

Bot.prototype.onError = function(error) {
  process.nextTick(_.bind(function() {
    this.emit('error', error);
  }, this));
}

Bot.prototype.bindEvents = function() {
  this.client.on('error', _.bind(this.onError, this));
  this.client.on('pm', _.bind(this.onPrivateMessage, this));
}

module.exports = Bot;
