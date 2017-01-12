const {ipc} = require('electron');
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
var tabCount = 0;
var curTab = 0;
var tabIDs = [];

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
  var views = document.getElementsByClassName('tabView');
  for (var i = 0; i < views.length; i++) {
      initEventListeners(views[i]);
  }
  var tabButtons = document.getElementsByClassName('tab');
  for (var i = 0; i < tabButtons.length; i++) {
      initButtonListeners(tabButtons[i]);
  }
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
  sizeHistoryArea();
}

function sizeHistoryArea() {
    var body = document.body, html = document.documentElement;
    var rect = bar.getBoundingClientRect();
    historyPane.style.height = Math.min(historyPane.lastChild.getBoundingClientRect().bottom - historyPane.lastChild.getBoundingClientRect().top, Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight )*0.25) + 'px';
    historyPane.style.width = (rect.right - rect.left) + 'px';
    historyPane.style.top = rect.bottom + 'px';
    historyPane.style.left = getOffset(bar).left + 'px';
}

function goToPage() {
  var url;
  if (!bar.value.contains("http://") && !bar.value.contains("https://") && !bar.value.contains("file://") && bar.value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) != null) {
    url = "http://" + bar.value;
  } else if (bar.value.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g) != null) {
    url = bar.value;
  } else {
    url = 'https://www.google.se/#q=' + bar.value;
  }
  inHistory = false;
  curHistory = 0;
  webview.setAttribute("src", url);
}

bar.addEventListener("keydown", function(e) {
  if (curHistory == -1) {
    curHistory = 0;
  }

  if (e.keyCode == 40 && curHistory < (document.getElementsByName('history').length-1 || (curHistory == 0 && !inHistory))) { //Down
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

document.addEventListener("keyup", function(e) {
    if (e.keyCode == 9 && e.ctrlKey && !e.shiftKey) {
        if (curTab < tabIDs.length-1) {
            curTab++;
            openTabID(curTab);
        } else {
            curTab = 0;
            openTabID(curTab);
        }
    }

    if (e.keyCode == 9 && e.ctrlKey && e.shiftKey) {
        if (curTab > 0) {
            curTab--;
            openTabID(curTab);
        } else {
            curTab = tabIDs.length-1;
            openTabID(curTab);
        }
    }
});

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
  //historyPane.style.height = Math.min(count*25, Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight )*0.25) + 'px';
  sizeHistoryArea();
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

function getCurrentTabButton() {
    return document.getElementsByClassName('tab active')[0];
}

function setCurrentTabIcon(iconUrl) {
    getCurrentTabButton().firstChild.src = iconUrl;
}

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

function openTab(tabButton) {
    webview.removeAttribute('id');
    var views = document.getElementsByClassName('tabView');
    for (var i = 0; i < views.length; i++) {
        if (views[i].dataset.tabId == tabButton.dataset.tabId) {
            views[i].setAttribute('id', 'pageView');
            webview = views[i];
            curTab = views[i].dataset.tabId;
            break;
        }
    }
    if (getCurrentTabButton() != undefined) getCurrentTabButton().classList.remove('active');
    tabButton.classList.add('active');
    bar.value = webview.getURL();
}

function openTabID(id) {
    console.log(tabIDs);
    console.log("Open tab index " + id + " id " + tabIDs[id]);
    webview.removeAttribute('id');
    var views = document.getElementsByClassName('tabView');
    for (var i = 0; i < views.length; i++) {
        if (views[i].dataset.tabId == tabIDs[id]) {
            views[i].setAttribute('id', 'pageView');
            webview = views[i];
            curTab = id;
            break;
        }
    }
    if (getCurrentTabButton != undefined) getCurrentTabButton().classList.remove('active');
    var tabButtons = document.getElementsByClassName('tab');
    for (var i = 0; i < tabButtons.length; i++) {
        if (tabButtons[i].dataset.tabId == tabIDs[id]) {
            tabButtons[i].classList.add('active');
            break;
        }
    }
    bar.value = webview.getURL();
}

function addTab() {
    var tabList = document.querySelector('.tabs ul ul');
    var newTabButton = document.createElement('li');
    var buttonImg = document.createElement('img');
    var container = document.querySelector('.viewContainer ul');
    var newView = document.createElement('webview');

    newTabButton.appendChild(buttonImg);
    tabList.appendChild(newTabButton);
    container.appendChild(newView);

    var home = config.getProperty('home');
    if (home && home !== "") {
      newView.setAttribute("src", home);
    } else {
      newView.setAttribute("src", "file://" + __dirname + "/pages/startPage.html");
    }

    newTabButton.dataset.tabId = tabCount + 1;
    newView.dataset.tabId = tabCount + 1;

    newTabButton.classList.add('tab');
    newView.classList.add('tabView');

    initEventListeners(newView);
    initButtonListeners(newTabButton);
    openTab(newTabButton);
}

function removeTab(tabButton) {
    var views = document.getElementsByClassName('tabView');
    for (var i = 0; i < views.length; i++) {
        if (views[i].dataset.tabId == tabButton.dataset.tabId) {
            console.log("View in remove");
            if (webview.dataset.tabId == views[i].dataset.tabId) {
                console.log("Tab will be opened");
                openTabID(Math.max(tabIDs.indexOf('' + (webview.dataset.tabId - 1)), 0));
            }
            views[i].remove();
            break;
        }
    }
    for (var i = 0; i < tabIDs.length; i++) {
        if (tabIDs[i] == tabButton.dataset.tabId) {
            tabIDs.splice(i, 1);
            break;
        }
    }
    tabButton.remove();
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

function initEventListeners(webview) {
    webview.addEventListener('did-finish-load', function() {
        console.log('Finished loading!');
        historyUtil.addHistory(webview.getURL());
        bar.value = webview.getURL();
    });

    webview.addEventListener('page-favicon-updated', (ev) => {
        console.log('ICONS: ' + ev.favicons);
        setCurrentTabIcon(ev.favicons[0]);
    })

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
        document.title = e.title + " - Elektronswer 1.0";
    });

    webview.addEventListener('dom-ready', function() {
      injectScrollbar();
    })

    webview.addEventListener('did-stop-loading', function() {
      document.getElementById("loadingOverlay").style.opacity = 0;
      console.log('Stopped loading!');
      window.setTimeout(function() {
        document.getElementById("loadingOverlay").style.display = 'none';
      }, 500);
    });
    tabCount++;
    tabIDs.push(webview.dataset.tabId);
}

tabClicked = function(e) {
    console.log("Tab clicked!");
    e = e || window.event;
    var target = e.target || e.srcElement;
    if (e.button == 1) {
        if (e.target.tagName == 'LI') {
            removeTab(e.target);
        } else {
            removeTab(e.target.parentElement);
        }
    } else {
        if (e.target.tagName == 'LI') {
            openTab(e.target);
        } else {
            openTab(e.target.parentElement);
        }
    }
};

function initButtonListeners(tabButton) {
    tabButton.addEventListener('click', tabClicked);
}
