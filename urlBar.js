var ipc = require('ipc');

var bar = document.getElementsByName('urlBar')[0];
var button = document.getElementsByName('button');
var webview = document.getElementById("pageView");

if (typeof String.prototype.contains === 'undefined') {
  String.prototype.contains = function(it) {
    return this.indexOf(it) != -1;
  };
}

function goToPage() {
  var url;
  if (!bar.value.contains("http://") && !bar.value.contains("https://") && !bar.value.contains("file://")) {
    url = "http://" + bar.value;
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

webview.addEventListener('did-stop-loading', function(status) {
  document.getElementById("loadingOverlay").style.opacity = 0;
  window.setTimeout(function() {
    document.getElementById("loadingOverlay").style.display = 'none';
  }, 500);
  bar.value = webview.getUrl();
});

webview.addEventListener('did-start-loading', function(status) {
  document.getElementById("loadingOverlay").style.display = 'block';
  document.getElementById("loadingOverlay").style.opacity = 100;
});

webview.addEventListener('page-title-set', function(e) {
    document.title = e.title + " - Electronswer 1.0";
});

function goBack() {
  webview.goBack();
}

function goForw() {
  webview.goForward();
}
