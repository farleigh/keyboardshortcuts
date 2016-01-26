/*global angular, $*/
require(["angularStorage", "controller", "jquery"], function(angularStorage, controller, jq) {
    "use strict";

    // Define angular module.
    // Using require here is a consequence of having AMD modules as dependencies (storage).
    // Angular doesn't play particularly well with require.
    var keyboardShortcuts = angular.module("keyboardShortcuts", []);
    keyboardShortcuts.factory("angularStorage", angularStorage);
    keyboardShortcuts.controller("shortcutConfigurationController", [ "$scope", "angularStorage", controller]);

    angular.element(document).ready(function() {
        jq(".container").attr("ng-controller", "shortcutConfigurationController");
        angular.bootstrap(document, ["keyboardShortcuts"]);
    });
});
