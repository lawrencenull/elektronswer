var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var config = require('./config.js');

app.on('ready', function() {
  var mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    "auto-hide-menu-bar": true,
    "use-content-size": true,
    "node-intergration": true
  });
  config.initConfig();
  mainWindow.loadUrl("file://" + __dirname + "/index.html");
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

app.on('before-quit', function(e) {
    config.writeConfig();
});
