var images = [];
var id = 0;

chrome.browserAction.onClicked.addListener(function(){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        images = [];

        chrome.tabs.sendMessage(tabs[0].id, {capture: "true"}, function(response) {
          console.log(response);
          return true;
        });
    });      
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){
    if(request.done){
        // done capturing all pieces
        console.log(images);
        displayShot();
        
        return;
    }

    console.log('capturing ' + request.currentPieceIndex);
    
    chrome.tabs.captureVisibleTab(function(screenshotUrl) {
        images.push(screenshotUrl);
    });

    sendResponse({currentPieceIndex : request.currentPieceIndex + 1});
    return;
});

function displayShot(){
    var shotTabUrl = chrome.extension.getURL('screenshot.html?id=' + id++);
    var shotTabId = null;

    chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
      if (tabId != shotTabId || changedProps.status != "complete")
        return;

      chrome.tabs.onUpdated.removeListener(listener);
      
      var views = chrome.extension.getViews();
      for (var i = 0; i < views.length; i++) {
        var view = views[i];
        console.log(view.location.href);
        console.log(shotTabUrl);

        if (view.location.href == shotTabUrl) {
            console.log(view);
          view.setScreenshot(images);
          break;
        }
      }
    });

    chrome.tabs.create({url: shotTabUrl}, function(tab) {
      shotTabId = tab.id;
    });
}