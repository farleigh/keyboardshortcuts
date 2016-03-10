/*global angular, chrome */
define("controller", function () {

  return function keyboardShortcutsController(angularStorage, extensionInfo, exportShortcuts, importShortcuts) {
    var vm = this;
    function addKey(key) {
      vm.shortcutKeys.push(key);
    }

    vm.version = extensionInfo.getVersion();

    angularStorage.get().then(function(value) {
      vm.shortcutKeys = value || [];
    });

    vm.edit = function (key, isNew) {
      vm.currentEditKey = key;
      vm.isNew = isNew || false;
    };

    vm.add = function () {
      var key = {
        name: "",
        urlExpression: "",
        sequence: "",
        expression: ""
      };
      addKey(key);
      vm.edit(key, true);
    };

    vm.remove = function ($event, key) {
      var index = vm.shortcutKeys.indexOf(key);
      if (index > -1) {
        vm.shortcutKeys.splice(index, 1);
        angularStorage.set(vm.shortcutKeys);
      }
      vm.close();
    };

    vm.save = function () {
      angularStorage.set(vm.shortcutKeys);
    };

    vm.close = function () {
      vm.edit(null);
    };

    vm.export = function () {
      exportShortcuts.execute(vm.shortcutKeys);
    };

    vm.closeImport = function () {
      vm.editImport = false;
    };

    vm.openImport = function () {
      vm.editImport = true;
    };

    // Import a shortcuts from a resource at a particular url
    vm.import = function () {
      function exists (shortcut) {
        var i = 0, existingShortcut;
        if(!shortcut) {
          return true; // return true for now so caller doesn't try to add to set.
        }
        for(; i < vm.shortcutKeys.length; i += 1) {
          existingShortcut = vm.shortcutKeys[i];
          if(shortcut.urlExpression === existingShortcut.urlExpression &&
             shortcut.name === existingShortcut.name &&
             shortcut.key === existingShortcut.key) {
            return true;
          }
        }
        return false;
      }

      // Load imported shortcuts
      function loadShortcuts (shortcuts) {
        var count = 0;
        console.log(shortcuts);
        if(!shortcuts || !shortcuts.forEach) {
          error("Unable to load shortcuts from the provided URL. URL exists but data is not in the correct format.");
        }
        shortcuts.forEach(
          function (importedShortcut) {
            if(!exists(importedShortcut)) {
              addKey(importedShortcut);
              count += 1;
            }
          }
        );
        success("Successfully imported " + count + " new shortcuts. Existing shortcuts were preserved.");
      }

      // Report error back to the user
      function error (message) {
        vm.importError = message;
      }

      function success(message) {
        vm.importSuccess = message;
      }

      success("");
      error("");
      console.log(vm.importURL);
      importShortcuts.execute(vm.importURL, loadShortcuts, error);
    };
  };
});
