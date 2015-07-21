var fs = require('fs-extra');

sortObj = function(obj, type, caseSensitive) {
  var temp_array = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (!caseSensitive) {
        key = (key['toLowerCase'] ? key.toLowerCase() : key);
      }
      temp_array.push(key);
    }
  }
  if (typeof type === 'function') {
    temp_array.sort(type);
  } else if (type === 'value') {
    temp_array.sort(function(a,b) {
      var x = obj[a];
      var y = obj[b];
      if (!caseSensitive) {
        x = (x['toLowerCase'] ? x.toLowerCase() : x);
        y = (y['toLowerCase'] ? y.toLowerCase() : y);
      }
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  } else {
    temp_array.sort();
  }
  var temp_obj = {};
  for (var i=0; i<temp_array.length; i++) {
    temp_obj[temp_array[i]] = obj[temp_array[i]];
  }
  return temp_obj;
};

module.exports = {
  addHistory: function(url) {
    console.log("Update history: " + url);
    var history = fs.readJsonSync(__dirname + '/user/history.json');
    if (history[url] && history[url] != null) {
      history[url] = history[url] - 1;
    } else {
      history[url] = -1;
    }
    console.log(history);
    fs.writeJsonSync(__dirname + '/user/history.json', history);
  },
  getHistory: function() {
    console.log("Get history " + __dirname + '/user/history.json');
    var out = sortObj(fs.readJsonSync(__dirname + '/user/history.json'), 'value', true);
    return out;
  },
  getHistoryEntry: function(url) {
    console.log("Get history entry");
    var hist = fs.readJsonSync(__dirname + '/user/history.json');
    return hist[url];
  },
  clearHistory: function() {
    var nada = {};
    fs.writeJsonSync(__dirname + '/user/history.json', nada);
  }
};
