/*global jQuery, chrome */
require(["require", "jquery"], function (require, $) {
    "use strict";

    console.log("Running main.js");

    var executor = require("executor");
    var copy = require("copy");
    var focus = require("focus");
    var hover = require("hover");
    var leftClick = require("leftClick");
    var rightClick = require("rightClick");
    var touch = require("touch");
    var wait = require("wait");
    var storage = require("storage");

    var executionHandlers = {
        copy: copy,
        focus: focus,
        hover: hover,
        leftClick: leftClick,
        rightClick: rightClick,
        touch: touch,
        wait: wait
    };

     // Add a handler for each shortcut key that matches the URL pattern.
    var addHandler = function addHandler (value) {
        var handler = function () {
            var statements = value.expression && value.expression.split(/\s*;\s*/);
            if (statements) {
                executor.execute($, executionHandlers, statements);
            }
        };
        return $(document).on("keydown", null, value.sequence, handler);
    };

    // Keep handlers around for turning them off
    var handlers = [];

     // Remove existing handlers and then add new handlers for each shortcut
     // defined in shortcuts.
    var addHandlers = function addHandlers (shortcuts) {
        handlers.forEach(function(handler) {
            $(document).off("keydown", handler);
        });
        shortcuts.forEach(function(value) {
            var urlExpr = value.urlExpression || ".*";
            var regex = new RegExp(value.urlExpression);
            if (regex.exec(window.location.href, "i")) {
                handlers.push(addHandler(value));
            }
        });
    };


     // Retrieve all shortcuts from the data store and add the shortcuts with
     // URLs that match the specified pattern to the page to be listened for.
     // Shortcut keys without a URL pattern are considered to match all URLs.
    var loadShortcuts = function loadShortcuts () {
        storage.get(function (obj) {
            var values = storage.extractValue(obj);
            addHandlers(values);
        });
    };

    jQuery.hotkeys.options.filterInputAcceptingElements = false;
    jQuery.hotkeys.options.filterContentEditable = false;
    jQuery.hotkeys.options.filterTextInputs = false;

    // Add a listener for messages received from the popup
    chrome.runtime.onMessage
            .addListener(function (request, sender, sendResponse) {
                if (request && request.length) {
                    addHandlers(request);
                }
            });

    // Do the initial load
    $(document).ready(function () {
        loadShortcuts();
    });
});
