var ipc = require('ipc');
var fs = require('fs-extra');
var config = require('./configUtil.js');

var bar = document.getElementsByName('urlBar')[0];
var webview = document.getElementById("pageView");
var prefPane = document.getElementsByClassName('pref')[0];
var historyPane = document.getElementById("history");

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
  setTheme();
  onResize();
}

function setTheme() {
  var theme = config.getProperty('theme');
  if (theme && theme !== "") {
    document.getElementsByName('theme')[0].setAttribute('href', 'css/' + theme + '.css');
  }
}

function getOffset( el ) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
}

function onResize() {
  var body = document.body, html = document.documentElement;

  var height = Math.max( body.scrollHeight, body.offsetHeight,
                       html.clientHeight, html.scrollHeight, html.offsetHeight );

  prefPane.style.height = (height - 50) + 'px';
  var rect = bar.getBoundingClientRect();
  historyPane.style.height = (height*0.25) + 'px';
  historyPane.style.width = (rect.right - rect.left) + 'px';
  historyPane.style.top = rect.bottom + 'px';
  historyPane.style.left = getOffset(bar).left + 'px';

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
    historyPane.style.opacity = 0;
    window.setTimeout(function() {
      historyPane.style.display = 'none';
    }, 250);
    bar.blur();
    goToPage();
  }
}, false);

bar.addEventListener('focus', function() {
  historyPane.style.display = 'block';
  historyPane.style.opacity = 100;
});

bar.addEventListener('blur', function() {
  historyPane.style.opacity = 0;
  window.setTimeout(function() {
    historyPane.style.display = 'none';
  }, 250);
});

document.addEventListener("keyup", function(e) {
  if (e.keyCode == 123) {
    webview.openDevTools();
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

webview.addEventListener('dom-ready', function() {
  injectScrollbar();
})

function injectScrollbar() {
  var theme = config.getProperty('theme');
  if (theme && theme !== "") {
    fs.readFile(__dirname + "/css/" + theme + "_scroll.css", {"encoding": "utf-8"}, function(err, data) {
      //if (err) throw err;
      webview.insertCSS(data);
    });
  }
}

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
