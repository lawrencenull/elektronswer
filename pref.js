var fs = require('fs');
var config;
fs.readFile('user/config.json', 'utf8', function (err, data) {
  if (err) throw err;
  config = JSON.parse(data);
});

function setTheme(theme) {
  if (theme === 'dark') {
    document.getElementsByName('dark').classList.add('selectedBtn');
    document.getElementsByName('light').classList.remove('selectedBtn');
  } else if (theme === 'light') {
    document.getElementsByName('light').classList.add('selectedBtn');
    document.getElementsByName('dark').classList.remove('selectedBtn');
  }
  config.theme = theme;
  fs.open('user/config.json', 'w', function(err, fd) {
    if (err) throw err;
    fs.write(fd, JSON.stringify(config), function(err, written, string) {
      if (err) throw err;
    });
  });
}
