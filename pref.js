var require = window.parent.require;
var config = require('./config.js');


function setTheme(theme) {
  if (theme === 'dark') {
    document.getElementsByName('dark')[0].classList.add('selectedBtn');
    document.getElementsByName('light')[0].classList.remove('selectedBtn');
  } else if (theme === 'light') {
    document.getElementsByName('light')[0].classList.add('selectedBtn');
    document.getElementsByName('dark')[0].classList.remove('selectedBtn');
  }
  conf = config.getConfig();
  conf.theme = theme;
  config.writeConfig(conf);
}
