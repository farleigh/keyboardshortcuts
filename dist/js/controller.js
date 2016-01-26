/*global angular */
define("controller", function () {
    return function ($scope, angularStorage) {
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
    };
});
