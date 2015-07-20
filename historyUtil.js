var fs = require('fs-extra');

module.exports = {
  addHistory: function(url) {
    console.log("Update history: " + url);
    var history = fs.readJsonSync(__dirname + '/user/history.json');
    if (history[url] && history[url] != null) {
      history[url][1] = history[url][1] - 1;
    } else {
      history[url] = [url, -1];
    }
    console.log(history);
    fs.writeJsonSync(__dirname + '/user/history.json', history);
  },
  getHistory: function() {
    console.log("Get history");
    return fs.readJsonSync(__dirname + '/user/history.json');
  },
  getHistoryEntry: function(url) {
    console.log("Get history entry");
    var hist = fs.readJsonSync(__dirname + '/user/history.json');
    return hist[url];
  }
};
