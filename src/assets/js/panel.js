function f() {
  window.__Injected = true;
  window.addEventListener( 'load', function() {

    var sequenceCloned = [];
    window.sequence.forEach(function(b) {
      sequenceCloned.push({
        name: b.name,
        type: b.getTypeName(),
        start: b.start,
        end: b.end
      })
    });

    var data = {
      timer:window.MNDRN.timer,
      sequence:sequenceCloned
    };
    window.postMessage( { source: 'MandarineScenario', method: 'init',data:data}, '*');
  });
}

function u()
{
  var data = {
    timer:window.MNDRN.timer
  };
  window.postMessage( { source: 'MandarineScenario', method: 'update',data:data}, '*');
}

var backgroundPageConnection = chrome.runtime.connect({
  name: 'panel'
});

backgroundPageConnection.onMessage.addListener( function( msg ) {
  switch( msg.method ) {
    case 'inject':
      chrome.devtools.inspectedWindow.eval( '(' + f.toString() + ')()' ) ;

      break;
    case 'init':
      $('#info').hide();

      if(!started)
      {
        sequence = msg.data.sequence;
        MNDRN.timer = msg.data.timer;
        init();
      }
      break;
    case 'update':
      MNDRN.timer = msg.data.timer;
      break;
    case 'onCommitted':
      break;
    case 'getExtension':
      //logMsg( 'addExtension', msg.extension );
      //gl.getExtension( msg.extension );
      break;
    default:
      break;
  }
});

backgroundPageConnection.postMessage({
  name: 'init',
  tabId: chrome.devtools.inspectedWindow.tabId
});
