var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var fs = require('fs-extra');

app.on('ready', function() {
  if (!fs.existsSync(__dirname + "/user")) {
    fs.mkdirSync(__dirname + "/user");
  }

  if (!fs.existsSync(__dirname + "/user/config.json")) {
    fs.writeJsonSync(__dirname + "/user/config.json", {});
  }

  if (!fs.existsSync(__dirname + "/user/history.json")) {
    fs.writeJsonSync(__dirname + "/user/history.json", {});
  }

  var mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    "auto-hide-menu-bar": true,
    "use-content-size": true,
    "node-intergration": true
  });
  mainWindow.loadUrl("file://" + __dirname + "/index.html");
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

app.on('window-all-closed', function() {
  app.quit();
});
