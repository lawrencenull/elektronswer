var ipc = require('ipc');
var fs = require('fs-extra');
var config = require('./configUtil.js');
var historyUtil = require('./historyUtil.js');

var bar = document.getElementsByName('urlBar')[0];
var webview = document.getElementById("pageView");
var prefPane = document.getElementsByClassName('pref')[0];
var historyPane = document.getElementById("history");

var prefPaneOut = false;
var doneLoading = false;
var curHistory = 0;
var inHistory = false;

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
  } else {
    config.setProperty('theme', 'dark');
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


function bubbleSort(arr){
   var len = arr.length;
   for (var i = len-1; i>=0; i--){
     for(var j = 1; j<=i; j++){
       if(arr[j-1]>arr[j]){
           var temp = arr[j-1];
           arr[j-1] = arr[j];
           arr[j] = temp;
        }
     }
   }
   return arr;
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
  inHistory = false;
  curHistory = 0;
  webview.setAttribute("src", url);
}

bar.addEventListener("keydown", function(e) {
  if (curHistory == -1) {
    curHistory = 0;
  }

  if (e.keyCode == 40 && curHistory < document.getElementsByName('history').length-1) { //Down
    console.log("Key down");
    if (curHistory == 0 && !inHistory) {
      document.getElementsByName('history')[curHistory].classList.add('historySel');
      inHistory = true;
      bar.value = document.getElementsByName('history')[curHistory].innerHTML;
      return;
    }
    e.preventDefault();
    document.getElementsByName('history')[curHistory].classList.remove('historySel');
    curHistory++;
    document.getElementsByName('history')[curHistory].classList.add('historySel');
    bar.value = document.getElementsByName('history')[curHistory].innerHTML;
  } else if (e.keyCode == 38 && curHistory > -1) { //Up
    console.log("Key up");
    document.getElementsByName('history')[curHistory].classList.remove('historySel');
    if (curHistory == 0 && inHistory) {
      bar.value = document.getElementsByName('history')[curHistory].innerHTML;
      curHistory = 0;
      inHistory = false;
      return;
    }
    e.preventDefault();
    curHistory--;
    document.getElementsByName('history')[curHistory].classList.add('historySel');
    bar.value = document.getElementsByName('history')[curHistory].innerHTML;
  }
  console.log(document.getElementsByName('history'));
  console.log("curHistory " + curHistory);
});

bar.addEventListener("keyup", function(e) {
  if (e.keyCode == 13) { // Enter
    historyPane.style.opacity = 0;
    window.setTimeout(function() {
      historyPane.style.display = 'none';
    }, 250);
    bar.blur();
    goToPage();
  }
}, false);

bar.addEventListener('input', updateHistory());

function updateHistory() {
  var out = "<ul>";
  var body = document.body, html = document.documentElement;
  var count = 0;
  var j = 0;
  Object.keys(historyUtil.getHistory()).forEach(function(element, index) {
    if (element.contains(bar.value)) {
      j++;
      if ((j * 25 ) < Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight )*0.25) {
        out += '<li name="history">' + element + "</li>"
        count++;
      }
    }
  });
  out += "</ul>"

  historyPane.innerHTML = out;
  historyPane.style.height = Math.min(count*25, Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight )*0.25) + 'px';
}

bar.addEventListener('focus', function() {
  updateHistory();

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
});

webview.addEventListener('did-finish-load', function() {
  historyUtil.addHistory(webview.getUrl());
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
