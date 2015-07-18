var fs = require('fs-extra');

var configInternal = {};

module.exports = {
  config: configInternal,
  initConfig: function() {
    console.log('Get config! ' +__dirname + '/user/config.json');
    configInternal = fs.readJsonSync(__dirname + '/user/config.json');
    console.log(configInternal);
  },
  writeConfig: function() {
    fs.writeJsonSync(__dirname + '/user/config.json', configInternal);
  },
  setProperty: function(prop, value) {
    configInternal[prop] = value;
    config.writeConfig();
  },
  getProperty: function(prop) {
    return configInternal[prop];
  }
};
