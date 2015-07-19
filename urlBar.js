var ipc = require('ipc');
var fs = require('fs');
var config = require('./configUtil.js');

var bar = document.getElementsByName('urlBar')[0];
var webview = document.getElementById("pageView");
var prefPane = document.getElementsByClassName('pref')[0];

var prefPaneOut = false;
var doneLoading = false;

if (typeof String.prototype.contains === 'undefined') {
  String.prototype.contains = function(it) {
    return this.indexOf(it) != -1;
  };
}

function onLoad() {
  var home = config.getProperty('home');
  if (home && home !== "") {
    webview.setAttribute("src", home);
  } else {
    webview.setAttribute("src", "file://" + __dirname + "/pages/startPage.html");
  }
  onResize();
}

function onResize() {
  var body = document.body, html = document.documentElement;

  var height = Math.max( body.scrollHeight, body.offsetHeight,
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
  prefPane.style.height = (height - 50) + 'px';
}

function goToPage() {
  var url;
  if (!bar.value.contains("http://") && !bar.value.contains("https://") && !bar.value.contains("file://") && !bar.value.contains('g:')) {
    url = "http://" + bar.value;
  } else if (bar.value.contains("g:")) {
    url = 'https://www.google.se/#q=' + bar.value.substr(2);
  } else {
    url = bar.value;
  }

  webview.setAttribute("src", url);
}

bar.addEventListener("keypress", function(e) {
  if (e.keyCode == 13) {
    goToPage();
  }
}, false);

webview.addEventListener('did-stop-loading', function() {
  document.getElementById("loadingOverlay").style.opacity = 0;
  window.setTimeout(function() {
    document.getElementById("loadingOverlay").style.display = 'none';
  }, 500);
  bar.value = webview.getUrl();
});

webview.addEventListener('did-start-loading', function(status) {
  if (webview.isWaitingForResponse()) {
    doneLoading = false;
    document.getElementById("loadingOverlay").style.display = 'block';
    document.getElementById("loadingOverlay").style.opacity = 100;
  } else {
    doneLoading = true;
  }
});

webview.addEventListener('page-title-set', function(e) {
    document.title = e.title + " - Electronswer 1.0";
});

function reload() {
  webview.reload();
}

function goBack() {
  webview.goBack();
}

function goForw() {
  webview.goForward();
}

function togglePref() {
  prefPane.style.height = window.height - 50;
  if (!prefPaneOut) {
    prefPane.style.left="75%";
  } else {
    prefPane.style.left="100%";
  }
  prefPaneOut = !prefPaneOut;
}
