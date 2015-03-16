(function() {
	"use strict";
	var keyShorts = angular.module("keyShorts", []);

	keyShorts.factory("storage", function($q) {
		var storageArea = null;
		try {
			storageArea = chrome.storage.sync;
		} catch (err) {
			console.log("could not initiate chrome storage: " + err);
		}
		return {
			get : function(key) {
				var deferred = $q.defer();
				storageArea.get(key, function(value) {
					var keyValue = value[key];
					deferred.resolve(keyValue);
				});
				return deferred.promise;
			},
			set : function(key, value) {
				var obj = {};
				obj[key] = value;
				storageArea.set(obj);
			}
		};
	});

	keyShorts.controller("shortcutConfigurationController", [ "$scope",
			"storage", function($scope, storage) {
				$scope.shortcutKeys = undefined;
				storage.get("configuration").then(function(value) {
					$scope.shortcutKeys = value;
					if (!$scope.shortcutKeys || !$scope.shortcutKeys.length) {
						$scope.shortcutKeys = [];
					}

				});

				$scope.addKey = function() {
					$scope.shortcutKeys.push({
						urlExpression : "",
						sequence : "",
						expression : ""
					});
				};

				$scope.removeKey = function($event, key) {
					var index = $scope.shortcutKeys.indexOf(key);
					if (index > -1) {
						$scope.shortcutKeys.splice(index, 1);
					}
				};

				$scope.save = function() {
					storage.set("configuration", $scope.shortcutKeys);
				};

				$scope.$watch("shortcutKeys", $scope.save, true);
			} ]);
})();