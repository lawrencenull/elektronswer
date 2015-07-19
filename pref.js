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
  loadTheme();
  window.parent.setTheme();
  window.parent.injectScrollbar();
}

function setHomepage() {
  config.setProperty('home', document.getElementsByName('homepage')[0].value);
}

function loadTheme() {
  var theme = config.getProperty('theme');
  if (theme && theme !== "") {
    document.getElementsByName('theme')[0].setAttribute('href', 'css/' + theme + '.css');
  }
}

function onload() {
  var curTheme = config.getProperty('theme');
  loadTheme();
  if (curTheme === 'dark') {
    document.getElementsByName('dark')[0].classList.add('selectedBtn');
    document.getElementsByName('light')[0].classList.remove('selectedBtn');
  } else if (curTheme === 'light') {
    document.getElementsByName('light')[0].classList.add('selectedBtn');
    document.getElementsByName('dark')[0].classList.remove('selectedBtn');
  }
  document.getElementsByName('homepage')[0].value = config.getProperty('home');
}
