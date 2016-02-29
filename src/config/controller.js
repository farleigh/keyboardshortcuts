/*global angular */
define("controller", function () {
    return function (angularStorage) {
        var vm = this;

        angularStorage.get().then(function(value) {
            vm.shortcutKeys = value || [];
        });

        vm.edit = function(key, isNew) {
            vm.currentEditKey = key;
            vm.isNew = isNew || false;
        };

        vm.add = function() {
            var key = {
                name: "",
                urlExpression: "",
                sequence: "",
                expression: ""
            };
            vm.shortcutKeys.push(key);
            vm.edit(key, true);
        };

        vm.remove = function($event, key) {
            var index = vm.shortcutKeys.indexOf(key);
            if (index > -1) {
                vm.shortcutKeys.splice(index, 1);
                angularStorage.set(vm.shortcutKeys);
            }
            vm.close();
        };

        vm.save = function() {
            angularStorage.set(vm.shortcutKeys);
        };

        vm.close = function() {
            vm.edit(null);
        };
    };
});
