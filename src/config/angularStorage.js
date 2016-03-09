/*global chrome */
define("angularStorage", ["storage"], function (storage) {
  return function angularStorage ($q) {
    return {
      get: function() {
        var deferred = $q.defer();
        storage.get(function(data) {
          var value = storage.extractValue(data);
          deferred.resolve(value);
        });
        return deferred.promise;
      },
      set: function(value) {
        if (!value) {
          return;
        }
        storage.set(value);
        // spam all tabs telling them shortcut keys have changed
        chrome.tabs.query({}, function(tabs) {
          angular.forEach(tabs, function(tab) {
            chrome.tabs.sendMessage(tab.id, value);
          });
        });
      }
    };
  };
});
