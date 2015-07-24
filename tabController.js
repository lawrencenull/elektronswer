var ipc = require('ipc');

function doClose() {
  console.log('Close!');
  ipc.send('quit');
}
