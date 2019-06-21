chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.capture){
        scrollPage();   
        sendResponse({okay:'prepping'});
      }
      return true;
    }
);

function getScrollHeight(){
  var body = document.body;
  var html = document.documentElement;

  var heights = [body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight];
  console.log(heights);

  return Math.max(...heights);
}

function scrollPage(){ 
  var windowHeight = window.innerHeight;
  var scrollHeight = getScrollHeight(); 
  
  var numShots = Math.ceil(scrollHeight / windowHeight); 
  
  dispatchScrolls(0, numShots, windowHeight);
}

function dispatchScrolls(currentPieceIndex, totalIndexes, pieceHeight){
  if(currentPieceIndex > totalIndexes){
    // done capturing all pieces
    chrome.runtime.sendMessage({done : 'capturing'}, function(response){
      console.log('done capturing!');
      return;
    });

    return;
  };
  
  setTimeout(function(){
    window.scrollTo(0, currentPieceIndex*pieceHeight);
    
    chrome.runtime.sendMessage({currentPieceIndex : currentPieceIndex}, function(response){
      dispatchScrolls(response.currentPieceIndex, totalIndexes, pieceHeight);
      return;
    });
  }, 500);
}