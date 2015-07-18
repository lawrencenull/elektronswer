var fs = window.parent.require('fs');
var config;
fs.readFile('user/config.json', 'utf8', function (err, data) {
  if (err) {
    config = {}
    throw err;
    return;
  }
  config = JSON.parse(data);
});

function setTheme(theme) {
  if (theme === 'dark') {
    document.getElementsByName('dark')[0].classList.add('selectedBtn');
    document.getElementsByName('light')[0].classList.remove('selectedBtn');
  } else if (theme === 'light') {
    document.getElementsByName('light')[0].classList.add('selectedBtn');
    document.getElementsByName('dark')[0].classList.remove('selectedBtn');
  }
  config.theme = theme;
  fs.open('user/config.json', 'w', function(err, fd) {
    if (err) throw err;
    fs.write(fd, JSON.stringify(config), function(err, written, string) {
      if (err) throw err;
    });
  });
}
