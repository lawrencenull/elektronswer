var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var fs = require('fs');

function registerProtocol() {
  var protocol = require('protocol');
protocol.registerProtocol('atom', function(request) {
  console.log(request);
  var url = request.url.substr(7)
  return new protocol.RequestFileJob(path.normalize(__dirname + '/' + url));
}, function (error, scheme) {
  if (!error)
    console.log(scheme, ' registered successfully');
  if (error) throw error;
});
  /*var protocol = require('protocol');
  protocol.registerProtocol('elcsw', function(request) {
    //console.log(request);
    return new protocol.RequestErrorJob(2);
    var options = {};

    fs.readFile('user/config.json', 'utf8', function (err, data) {
      if (err) {
        return new protocol.RequestErrorJob(2);
        throw err;
      }
      options.data = data;
    });

    return new protocol.RequestStringJob(options);
  }, function(scheme, err) {
    if (err) {
      throw err;
    } else {
      console.log('Successfully registered ' + scheme);
    }
  });*/
}

app.on('ready', function() {
  registerProtocol();
  var mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    "auto-hide-menu-bar": true,
    "use-content-size": true,
    "node-intergration": true
  });
  mainWindow.loadUrl("file://" + __dirname + "/index.html");
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
