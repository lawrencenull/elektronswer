var fs = require('fs-extra');

module.exports = {
  setProperty: function(prop, value) {
    console.log('Get config! ' +__dirname + '/user/config.json');
    var configInternal = fs.readJsonSync(__dirname + '/user/config.json');
    configInternal[prop] = value;
    console.log(configInternal);
    fs.writeJsonSync(__dirname + '/user/config.json', configInternal);
  },
  getProperty: function(prop) {
    var configInternal = fs.readJsonSync(__dirname + '/user/config.json');
    return configInternal[prop];
  }
};
