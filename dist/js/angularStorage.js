/*global chrome */
define("angularStorage", ["storage"], function (storage) {
    return function ($q) {
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
                // send message to all tabs that shortcut keys have changed
                chrome.tabs.query({}, function(tabs) {
                    angular.forEach(tabs, function(tab) {
                        chrome.tabs.sendMessage(tab.id, value);
                    });
                });
            }
        };
    };
});
