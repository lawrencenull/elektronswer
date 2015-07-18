var config = window.parent.require('./configUtil.js');

//Display current config in prefs

function setTheme(theme) {
  if (theme === 'dark') {
    document.getElementsByName('dark')[0].classList.add('selectedBtn');
    document.getElementsByName('light')[0].classList.remove('selectedBtn');
  } else if (theme === 'light') {
    document.getElementsByName('light')[0].classList.add('selectedBtn');
    document.getElementsByName('dark')[0].classList.remove('selectedBtn');
  }
  config.setProperty('theme', theme);
}

function setHomepage() {
  config.setProperty('home', document.getElementsByName('homepage')[0].value);
}

function onload() {
  var curTheme = config.getProperty('theme');
  if (curTheme === 'dark') {
    document.getElementsByName('dark')[0].classList.add('selectedBtn');
    document.getElementsByName('light')[0].classList.remove('selectedBtn');
  } else if (curTheme === 'light') {
    document.getElementsByName('light')[0].classList.add('selectedBtn');
    document.getElementsByName('dark')[0].classList.remove('selectedBtn');
  }
  document.getElementsByName('homepage')[0].value = config.getProperty('home');
}
