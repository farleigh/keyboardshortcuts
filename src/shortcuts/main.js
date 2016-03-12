/*global jQuery, chrome */
require(["require", "jquery"], function (require, $) {
    "use strict";

    // Commands
    var executor = require("executor");
    var copy = require("copy");
    var focus = require("focus");
    var hover = require("hover");
    var leftClick = require("leftClick");
    var rightClick = require("rightClick");
    var touch = require("touch");
    var wait = require("wait");
    var go = require("go");
    var hide = require("hide");
    var set = require("set");

    // Other require
    var storage = require("storage");

    var executionHandlers = {
      copy: copy,
      focus: focus,
      hover: hover,
      leftClick: leftClick,
      rightClick: rightClick,
      touch: touch,
      wait: wait,
      go: go,
      hide: hide,
      set: set
    };

    var handlerNamespace = "keydown.keyboardshortcuts";

     // Add a handler for each shortcut key that matches the URL pattern.
    var addHandler = function addHandler (value) {
      var handler = function () {
        var statements = value.expression && value.expression.split(/\s*;\s*/);
        if (statements) {
          executor.execute($, executionHandlers, statements);
        }
      };
      $(document).on(handlerNamespace, null, value.sequence, handler);
    };

     // Remove existing handlers and then add new handlers for each shortcut
     // defined in shortcuts.
    var addHandlers = function addHandlers (shortcuts) {
      console.log("Removing handlers");
      $(document).off(handlerNamespace);
      console.log("Adding handlers");
      shortcuts.forEach(function(value) {
        var urlExpr = value.urlExpression || ".*";
        var regex = new RegExp(value.urlExpression);
        if (regex.exec(window.location.href, "i")) {
            addHandler(value);
        }
      });
    };

     // Retrieve all shortcuts from the data store and add the shortcuts with
     // URLs that match the specified pattern to the page to be listened for.
     // Shortcut keys without a URL pattern are considered to match all URLs.
    var loadShortcuts = function loadShortcuts () {
      var key = "configuration";
      storage.get(key, function (obj) {
        var values = storage.extractValue(key, obj);
        addHandlers(values);
      });
    };

    $.hotkeys.options.filterInputAcceptingElements = false;
    $.hotkeys.options.filterContentEditable = false;
    $.hotkeys.options.filterTextInputs = false;

    // Add a listener for messages received from the popup
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
          if (request && request.length) {
              addHandlers(request);
          }
      });

    // Do the initial load
    $(document).ready(function () {
      loadShortcuts();
    });
});
