var fs = require('fs');

function getConfig() {
  var config;
  fs.readFile('user/config.json', 'utf8', function (err, data) {
    if (err) {
      config = {};
      throw err;
    }
    config = JSON.parse(data);
  });
  return config;
}

function writeConfig(config) {
  if (!config || typeof(config) !== 'object') {
    console.error('Tried to write invalid config!');
    return;
  }

  fs.open('user/config.json', 'w', function(err, fd) {
    if (err) throw err;
    fs.write(fd, JSON.stringify(config), function(err, written, string) {
      if (err) throw err;
      fs.closeSync(fd);
    });
  });

}
