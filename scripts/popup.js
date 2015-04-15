(function() {
    "use strict";
    var keyShorts = angular.module("keyShorts", []);

    keyShorts.factory("angularStorage", function($q) {
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
    });

    keyShorts.controller("shortcutConfigurationController", [ "$scope",
            "angularStorage", function($scope, angularStorage) {
                $scope.shortcutKeys = undefined;
                angularStorage.get().then(function(value) {
                    $scope.shortcutKeys = value || [];
                });

                $scope.addKey = function() {
                    $scope.shortcutKeys.push({
                        urlExpression: "",
                        sequence: "",
                        expression: ""
                    });
                };

                $scope.removeKey = function($event, key) {
                    var index = $scope.shortcutKeys.indexOf(key);
                    if (index > -1) {
                        $scope.shortcutKeys.splice(index, 1);
                    }
                };

                $scope.save = function() {
                    angularStorage.set($scope.shortcutKeys);
                };

                $scope.$watch("shortcutKeys", $scope.save, true);
            } ]);
})();