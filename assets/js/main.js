var hasNewSelection = true;

function runtimeLoaded(error) {
  var elements = chrome.devtools.panels.elements;
  if (!error) {
    elements.onSelectionChanged.addListener(refreshSelection);
    createMainPanel();
  } else {
    elements.onSelectionChanged.addListener(retryRuntime);
  }
}

function retryRuntime() {
  chrome.devtools.panels.elements.onSelectionChanged.removeListener(
    retryRuntime
  );
  ReactInspectorAgent.initialize(runtimeLoaded);
}

function refreshSelection() {
  // Wait to refresh the selection to avoid the React panel stealing focus
  hasNewSelection = true;
}

function createMainPanel() {
  chrome.devtools.panels.create(
    'React', 'icon.png', 'views/devpanel.html', function(panel) {
      panel.onShown.addListener(mainPanelShown);
    }
  );
}

function mainPanelShown(mainPanelWindow) {
  if (!mainPanelWindow.wasShown) {
    mainPanelWindow.focus();
    mainPanelWindow.initialize({
      InspectorBackend: InspectorBackend,
      DOMAgent: DOMAgent,
      RuntimeAgent: RuntimeAgent
    });
    mainPanelWindow.wasShown = true;
  }

  // Refresh selection
  if (hasNewSelection) {
    hasNewSelection = false;
    ReactInspectorAgent.eval('DOM.inspectSelectedNode()', function() {});
  }
}

ReactInspectorAgent.initialize(runtimeLoaded);