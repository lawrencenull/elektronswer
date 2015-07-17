var ipc = require('ipc');

var bar = document.getElementsByName('urlBar')[0];
var button = document.getElementsByName('button');
var webview = document.getElementById("pageView");

function goToPage() {
  var url;
  if (bar.value.indexOf("http://") < 0 || bar.value.indexOf("https://")) {
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
  bar.value = webview.getUrl();
});
webview.addEventListener('did-start-loading', function(status) {
  document.getElementById("loadingOverlay").style.opacity = 100;
});
