/*global require, angular*/
require(["angularStorage", "extensionInfo", "exportShortcuts", "importShortcuts", "controller", "jquery"],
  function(angularStorage, extensionInfo, exportShortcuts, importShortcuts, controller, jq) {
    "use strict";
    // Define angular module.
    // Using require here is a consequence of having AMD modules as dependencies (storage).
    // Angular doesn't play particularly well with require.
    var keyboardShortcuts = angular.module("keyboardShortcuts", ["ng.group"]);
    keyboardShortcuts.factory("angularStorageFactory", angularStorage);
    keyboardShortcuts.factory("extensionInfoFactory", extensionInfo);
    keyboardShortcuts.factory("exportShortcutsFactory", exportShortcuts);
    keyboardShortcuts.factory("importShortcutsFactory", importShortcuts);
    keyboardShortcuts.controller("shortcutConfigurationController",
                                 [ "angularStorageFactory",
                                   "extensionInfoFactory",
                                   "exportShortcutsFactory",
                                   "importShortcutsFactory",
                                   controller ]);

    angular.element(document).ready(function() {
      jq(".container").attr("ng-controller", "shortcutConfigurationController as shortcuts");
      angular.bootstrap(document, ["keyboardShortcuts"]);
    });
  }
);
