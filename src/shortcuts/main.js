/*global chrome, mousetrap */
require(["require", "jquery", "mousetrap"], function (require, $, mousetrap) {
    "use strict";

    // Commands
    var executor = require("executor");
    var copy = require("copy");
    var focus = require("focus");
    var hover = require("hover");
    var leftClick = require("leftClick");
    var rightClick = require("rightClick");
    var touch = require("touchStart");
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

    var cursorLocation = { x: 0, y: 0 };

    function addMouseWatcher () {
      $(document).on(
        "mousemove",
        function(event) {
          cursorLocation.x = event.clientX;
          cursorLocation.y = event.clientY;
        }
      );
    }

    var keySequences = [];

    // Unbind all bound handlers
    function off (mousetrap) {
      keySequences.forEach(function (keySequence) {
        mousetrap.unbind(keySequence);
      });
    }

    // Bind one handler
    function on (mousetrap, keySequence, fcn) {
      mousetrap.bind(keySequence, fcn);
      keySequences.push(keySequence);
    }

     // Add a handler for each shortcut key that matches the URL pattern.
    function addHandler (value) {
      var handler = function handler (event) {
        var statements = value.expression && value.expression.split(/\s*;\s*/);
        var context = {
          window: window,
          document: document,
          event: event,
          position: cursorLocation
        };
        if (statements) {
          executor.execute($, value.when, executionHandlers, statements, context);
        }
      };
      on(mousetrap, value.sequence, handler);
    }

     // Remove existing handlers and then add new handlers for each shortcut
     // defined in shortcuts.
    function addHandlers (shortcuts) {
      var hasShortcutsForTab = false;
      off(mousetrap);
      if(shortcuts && shortcuts.length) {
        shortcuts.forEach(function(value) {
          var urlExpr = value.urlExpression || ".*";
          var regex = new RegExp(value.urlExpression);
          if (regex.exec(window.location.href, "i")) {
              addHandler(value);
              hasShortcutsForTab = true;
          }
        });
        if(hasShortcutsForTab) {
          addMouseWatcher();
        }
      }
    }

     // Retrieve all shortcuts from the data store and add the shortcuts with
     // URLs that match the specified pattern to the page to be listened for.
     // Shortcut keys without a URL pattern are considered to match all URLs.
    function loadShortcuts () {
      var key = "configuration";
      storage.get(key, function (obj) {
        var values = storage.extractValue(key, obj);
        addHandlers(values);
      });
    }

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
