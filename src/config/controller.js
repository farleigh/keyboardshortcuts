/*global angular, chrome */
define("controller", ["tabSpammer"], function (tabSpammer) {

  return function keyboardShortcutsController (angularStorage, extensionInfo, exportShortcuts, importShortcuts) {

    // TODO: need to split edit (and possibly import) into their own angular components.

    // Declare scope vm
    var vm = this;

    var newKey = {
      name: "",
      urlExpression: "",
      sequence: "",
      expression: ""
    };

    // Declare functions

    // Array interactions

    // Add key to the array
    function addKey (arr, key) {
      if(!key) {
        return;
      }
      arr.push(key);
    }

    // This will find the first match in the array based on equality (not identity).
    // If you have duplicates, you'll always get the first.
    function findKey(arr, key) {
      if(!arr || !key) {
        return -1;
      }
      for(var i = 0; i < arr.length; i += 1) {
        if(equals(key, arr[i])) {
          return i;
        }
      }
      return -1;
    }

    // Replace an existing key in the array
    function replaceKey (arr, newKey, oldKey) {
      var index;
      if(!arr || !newKey || !oldKey) {
        return;
      }
      index = findKey(arr, oldKey);
      if(index > -1) {
        arr[index] = newKey;
      }
    }

    // Delete a key from the array
    function deleteKey (arr, key) {
      var index;
      if(!arr || !key) {
        return;
      }
      index = findKey(arr, key);
      if(index > -1) {
        arr.splice(index, 1);
      }
    }

    // Key identity

    // Key equality

    function equals(key1, key2) {
      return key1.urlExpression === key2.urlExpression &&
             key1.name === key2.name &&
             key1.key === key2.key;
    }

    // A low budget clone method

    function clone(key) {
      var copy = {};
      if(!key) {
        return key;
      }
      for(var prop in key)  {
        copy[prop] = key[prop];
      }
      return copy;
    }

    // Edit helpers

    // Returns true if we are currently editing a key
    function isEditing() {
      return vm.cache && vm.cache.key;
    }

    // Returns true if we are currently editing an existing key.
    function isEditingExisting() {
      return isEditing() && typeof vm.cache.priorKey !== "undefined";
    }

    // Returns true if we are currently editing priorKey.
    function isEditingKey(key) {
      return isEditingExisting() && equals(key, vm.cache.priorKey);
    }

    // Returns true if we are current creating a new key.
    function isEditingNew() {
      return isEditing() && typeof vm.cache.priorKey === "undefined";
    }

    // Shortcut key editing related

    // Add a new shortcut and edit it.
    // Don't add it as a valid shortcut until the dialog is closed.
    function add () {
      vm.cache = {};
      vm.cache.key = clone(newKey);
      saveEdit();
    }

    // Edit a shortcut
    function edit (key) {
      if(!key) {
        return;
      }
      vm.cache = {};
      vm.cache.priorKey = key;
      vm.cache.key = clone(key);
      saveEdit();
    }

    // Do a save of the entire array of keys. Also broadcast keys changed
    // to all tabs. Those that care will pick up the new keys.
    function save () {
      angularStorage.set("configuration", vm.shortcutKeys);
      tabSpammer.notify(vm.shortcutKeys);
    }

    function openAdd () {
      if(isEditing()) {
        saveAndClose();
      }
      add();
    }

    // Open editor
    function openEdit (key) {
      if(!key) {
        return;
      }
      if(isEditing()) {
        saveAndClose();
      }
      edit(key);
    }

    // Close edit and wipe the current edited state out.
    function closeEdit () {
      vm.cache = {};
      saveEdit();
    }

    // Save edit in a  temporary cached location. Do not save to
    // the array until dialog is closed.
    function saveEdit () {
      angularStorage.set("cache", vm.cache);
    }

    // Save the shortcut into the array and close the dialog.
    function saveAndClose ($event) {
      if(isEditingNew()) {
        addKey(vm.shortcutKeys, vm.cache.key);
      } else {
        replaceKey(vm.shortcutKeys, vm.cache.key, vm.cache.priorKey);
      }
      save(); // save to array
      closeEdit(); // clear the edit
    }

    // Revert the changes and reload
    function revert ($event) {
      if(isEditingNew()) {
        add();
      } else if(isEditingExisting()) {
        edit(vm.cache.priorKey);
      }
    }

    // Remove a shortcut and close the dialog.
    function removeAndClose ($event) {
      if(isEditingExisting()) {
        deleteKey(vm.shortcutKeys, vm.cache.priorKey);
        save();
      }
      vm.closeEdit();
    }

    // Import and export related handlers

    // Export keys to json
    function exportKeys () {
      exportShortcuts.execute(vm.shortcutKeys);
    }

    // Open import dialog
    function openImportKeys () {
      vm.editImport = true;
    }

    // Close import dialog
    function closeImportKeys () {
      vm.editImport = false;
    }

    // Import a shortcuts from a resource at a particular url
    function importKeys () {
      function exists (shortcut) {
        if (!shortcut) {
          return true; // return true for now so caller doesn't try to add to set.
        }
        for (var i = 0; i < vm.shortcutKeys.length; i += 1) {
          if(equals(shortcut, vm.shortcutKeys[i])) {
            return true;
          }
        }
        return false;
      }

      // Load imported shortcuts
      function loadShortcuts (shortcuts) {
        var count = 0;
        if (!shortcuts || !shortcuts.forEach) {
          error("Unable to load shortcuts from the provided URL. URL exists but data is not in the correct format.");
        }
        shortcuts.forEach(
          function (importedShortcut) {
            if (!exists(importedShortcut)) {
              addKey(vm.shortcutKeys, importedShortcut);
              count += 1;
            }
          }
        );
        save();
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
      importShortcuts.execute(vm.importURL, loadShortcuts, error);
    }

    // ng-group gets upset when dealing with null keys. I don't think
    // this is possible in practice, but it blows things up when it happens.
    function clean (arr) {
      for(var i = 0; i < arr.length; ++i) {
        if(arr[i] === null || typeof arr[i] === "undefined") {
          arr.splice(i, 1);
          i -= 1;
        }
      }
    }

    // Perform initialization for vm instance as "scope".

    vm.version = extensionInfo.getVersion();
    angularStorage.get("configuration").then(function (value) {
      vm.shortcutKeys = value || [];
      clean(vm.shortcutKeys);
    });

    angularStorage.get("cache").then(function (value) {
      vm.cache = value || {};
    });

    vm.isEditingNew = isEditingNew;
    vm.isEditingKey = isEditingKey;
    vm.openEdit = openEdit;
    vm.openAdd = openAdd;
    vm.closeEdit = closeEdit;
    vm.saveEdit = saveEdit;
    vm.saveAndClose = saveAndClose;
    vm.revert = revert;
    vm.removeAndClose = removeAndClose;
    vm.exportKeys = exportKeys;
    vm.openImportKeys = openImportKeys;
    vm.closeImportKeys = closeImportKeys;
    vm.importKeys = importKeys;

  };
});
