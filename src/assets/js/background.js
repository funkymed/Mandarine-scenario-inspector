// chrome.extension calls
var connections = {};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//  console.log('incoming message from injected script');
  // console.log(request);

  // Messages from content scripts should have sender.tab set
  if (sender.tab) {
    var tabId = sender.tab.id;
    if (tabId in connections) {
      connections[tabId].postMessage(request);
    } else {
      console.log("Tab not found in connection list.");
    }
  } else {
    console.log("sender.tab not defined.");
  }
  return true;
});

chrome.runtime.onConnect.addListener(function(port) {

  // Listen to messages sent from the DevTools page
  port.onMessage.addListener(function(request) {
    console.log("background",request.name);
    // Register initial connection
    switch(request.name)
    {
      case "init":
        connections[request.tabId] = port;
        port.onDisconnect.addListener(function() {
          delete connections[request.tabId];
        });
        return;
        break;
      default:
        break;
    }
  });

});

chrome.webNavigation.onBeforeNavigate.addListener(function(data)
{
  console.log("onBeforeNavigate: " + data.url + ". Frame: " + data.frameId + ". Tab: " + data.tabId);
});

chrome.webNavigation.onCommitted.addListener(function(data) {

  console.log("onCommitted: " + data.url + ". Frame: " + data.frameId + ". Tab: " + data.tabId);

  if( connections[ data.tabId ] ) {
    if( data.frameId === 0 ) {
      connections[ data.tabId ].postMessage( { method: 'inject' } );
    }
  }

});

chrome.webNavigation.onCompleted.addListener(function(data)
{
  console.log("onCompleted: " + data.url + ". Frame: " + data.frameId + ". Tab: " + data.tabId);
});
