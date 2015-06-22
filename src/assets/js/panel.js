function f() {

  window.__Injected = true;

  window.addEventListener( 'load', function() {
    window.postMessage( { source: 'MandarineScenario', method: 'init' }, '*');
  });
}

var backgroundPageConnection = chrome.runtime.connect({
  name: 'panel'
});

backgroundPageConnection.onMessage.addListener( function( msg )
{
  console.log("onMessage",msg);
  switch( msg.method ) {
    case 'inject':
      chrome.devtools.inspectedWindow.eval( '(' + f.toString() + ')()' ) ;
      break;
    case 'onUpdated':
      //chrome.devtools.inspectedWindow.eval( '(' + f.toString() + ')()' ); // this gets appended AFTER the page
      /*chrome.devtools.inspectedWindow.reload( {
       ignoreCache: true,
       injectedScript: '(' + f.toString() + ')()'
       } );*/
      //console.log( 'onCommitted', Date.now() );
      break;
    case 'init':
      $('#info').hide();
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
