window.addEventListener('message', function(event) {

  console.log( 'message ', event );

  if (event.source !== window) {
    return;
  }

  var message = event.data;

  // Only accept messages that we know are ours
  if (typeof message !== 'object' || message === null ) {
    return;
  }
  //console.log("message",message);
  chrome.runtime.sendMessage(message);
});