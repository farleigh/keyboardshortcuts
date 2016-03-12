/*global chrome */
define("tabSpammer", function () {
  return {
    // spam all tabs telling them shortcut keys have changed
    notify: function (value) {
      chrome.tabs.query({}, function(tabs) {
        angular.forEach(tabs, function(tab) {
          chrome.tabs.sendMessage(tab.id, value);
        });
      });
    }
  };
});
