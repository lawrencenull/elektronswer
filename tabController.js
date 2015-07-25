var ipc = require('ipc');

function doClose() {
  console.log('Close!');
  ipc.send('quit');
}

function onLoad() {
  resizeWebFrames();
}

function resizeWebFrames() {
  var body = document.body, html = document.documentElement;

  var height = Math.max( body.scrollHeight, body.offsetHeight,
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
  for (var i = 0; i < document.getElementsByClassName('browser').length; i++) {
    console.log('Iteration!');
    var c = document.getElementsByClassName('browser')[i];
    c.style.height = (height - document.getElementById('tabFrame')) + 'px';
  }
}
