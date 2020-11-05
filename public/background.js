chrome.browserAction.onClicked.addListener(function(activeTab) {
  chrome.tabs.create({
    url: "http://warhammer.mcc.virginia.edu/fids/fids.php"
  });
});
