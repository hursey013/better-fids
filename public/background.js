const manifestData = chrome.runtime.getManifest();

chrome.browserAction.onClicked.addListener(function (activeTab) {
  chrome.tabs.create({
    url: manifestData.content_scripts[0].matches[0],
  });
});
