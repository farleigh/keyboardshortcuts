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

/*global define */
define("executor", function () {
    function execute (jq, handlers, statements) {
        var i, j, handlerKey, handler, stopExecution = false;
        if(!statements || !handlers) {
            return true;
        }
        while(statements.length > 0) {
            var statement = statements.shift();
            if(statement) {
                for(handlerKey in handlers) {
                    handler = handlers[handlerKey];
                    var result = handler.handle(jq, statement, statements, this, handlers);
                    if(result.stopExecution === true) {
                        stopExecution = true;
                        break;
                    }
                    if(result.handled === true) {
                        break;
                    }
                }
            }
            if(stopExecution) {
                break;
            }
        }
        return true;
    }

    return {
        execute: execute
    };
});

/*global define */
// Perform a copy operation (copy). If an attribute is specified, the value
// of the attribute will be copied. If nothing is specified, the content of
// the first element matching the query will be copied.
define("copy", ["result"], function(result) {
    var regex, handle;
    regex = /^copy\s*\(\s*(?:")([^"]+)(?:")\s*(?:,\s*(?:")([^"]+)(?:"))?\s*\)$/i;

    // Get content from an attribute if attribute name is specified, otherwise
    // get content from innerHTML.
    function getContent (jq, query, attributeName) {
        var elements = jq(query);
        if (elements && elements.length) {
            var element = elements.first();
            if (attributeName) {
             if (attributeName.indexOf("data-") > -1) {
                 var dataName = attributeName.substring(attributeName
                         .indexOf("data-") + 5);
                 return element.data(dataName);
             } else {
                 return element.attr(attributeName);
             }
            } else {
                return element.html();
            }
        }
    }

    // Push content into the clipboard
    function performCopy (jq, content) {
        var input = jq("<textarea />");
        input.appendTo("body");
        input.val(content);
        input.select();
        jq(document)[0].execCommand("copy");
        input.remove();
        return true;
    }

    // Get content from element and perform copy
    function copy (jq, query, attribute) {
        var value = getContent(jq, query, attribute);
        if (!value) {
         return false;
        }
        return performCopy(jq, value);
    }

    // Return true if copy can handle this command.
    function handleCopy (jq, statement) {
        var attribute;
        var matches = regex.exec(statement);
        if(!matches) {
         return result.NOT_HANDLED;
        }
        attribute = matches.length == 3 ? matches[2] : undefined;
        var success = copy(jq, matches[1], attribute);
        return success ? result.HANDLED : result.NOT_HANDLED;
    }

    function usage () {
        return "Usage: copy('query', 'attribute'); Copies a value from the content or attribute of an element on the page.  If attribute name is missing then copies innerHTML of the element.";
    }

    return {
        handle: handleCopy,
        execute: copy,
        toString: usage
    };
});

/*global define */
// Perform a focus operation (focus) on the element specified by query value.
define("focus", ["result"], function(result) {
    "use strict";

    var regex = /^focus\s*\(\s*(?:")([^"]+)(?:")\s*\)$/i;

    // Perform a focus operation.
    function focus (jq, query) {
        var value = jq(query);
        if (value && value.length > 0) {
            value.first().trigger("focus");
            return true;
        }
        return false;
    }

    // Handle intepreting the focus operation.
    function handleFocus (jq, statement) {
        var matches = regex.exec(statement);
        if(!matches) {
            return result.NOT_HANDLED;
        }
        var success = focus(jq, matches[1]);
        return success ? result.HANDLED : result.NOT_HANDLED;
    }

    function usage () {
        return 'Usage: focus("query"); Sets the focus to be on an element specified by query.  If more than one element matches query then uses the first.';
    }

    return {
        handle: handleFocus,
        execute: focus,
        toString: usage
    };
});

/*global define */
// Perform a hover operation on element specified with query.
define("hover", ["result"], function(result) {
    "use strict";

    var regex = /^hover\s*\(\s*(?:")([^"]+)(?:")\s*\)$/i;

    // Perform a hover operation (hover).
    function hover(jq, query) {
        var value = jq(query);
        if (value && value.length > 0) {
            value.first().trigger("mouseover");
            return true;
        }
        return false;
    }

    function handleHover (jq, statement) {
        var matches = regex.exec(statement);
        if(!matches) {
          return result.NOT_HANDLED;
        }
        var success = hover(jq, matches[1]);
        return success ? result.HANDLED : result.NOT_HANDLED;
    }

    function usage () {
        return 'Usage: hover("query"); Enable hover over element that matches query. If more than one element matches query then uses the first.';
    }

    return {
        handle: handleHover,
        execute: hover,
        toString: usage
    };
});

/*global define */
define("leftClick", ["triggerEvent", "result"], function(trigger, result) {
    "use strict";

    var regex = /^(?:left-)?click\s*\(\s*(?:")([^"]+)(?:")\s*\)$/i;

    // Perform the left click operation (click). Do a blur on the focused
    // element before the left click is performed (but after the element is
    // found).
    function leftClick (jq, query) {
        return trigger.execute(jq, query, "click");
    }

    function handleLeftClick (jq, statement) {
        var attribute;
        var matches = regex.exec(statement);
        if(!matches) {
          return result.NOT_HANDLED;
        }
        var success = leftClick(jq, matches[1]);
        return success ? result.HANDLED : result.NOT_HANDLED;
    }

    function usage () {
        return 'Usage: left-click("query"); Click element that matches query. If more than one element matches query then uses the first.';
    }

    return {
        handle: handleLeftClick,
        execute: leftClick,
        toString: usage
    };
});

/*global define */
// Perform a hover operation on element specified with query.
define("rightClick", ["triggerEvent", "result"], function(trigger, result) {
    "use strict";

    var regex = /^right-click\s*\(\s*(?:")([^"]+)(?:")\s*\)$/i;

    // Helper method to invoke the right click
    function invokeContextMenuOnObject (obj) {
        var element = obj.get(0);
        var event = element.ownerDocument.createEvent("MouseEvents");
        event.initMouseEvent("contextmenu", true, true,
               element.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false,
               false, false, 2, null);
        element.dispatchEvent(event);
    }

    // Perform the right click operation (right-click). Do a blur on the focused
    // element before the right click is performed (but after the element is
    // found).
    function rightClick (jq, query) {
        return trigger.execute(jq, query, function (obj) { invokeContextMenuOnObject(obj); });
    }

    // Return handled if right click handles this command.
    function handleRightClick (jq, statement) {
        var matches = regex.exec(statement);
        if(!matches) {
            return result.NOT_HANDLED;
        }
        var success = rightClick(jq, matches[1]);
        return success ? result.HANDLED : result.NOT_HANDLED;
    }

    function usage () {
        return 'Usage: right-click("query"); Trigger a right click on an element that matches query. If more than one element matches query then uses the first.';
    }

    return {
        handle: handleRightClick,
        execute: rightClick,
        toString: usage
    };
});

/*global define */
define("touch", ["triggerEvent", "result"], function (trigger, result) {
    "use strict";

    var regex = /^touch\s*\(\s*(?:")([^"]+)(?:")\s*\)$/i;

    // Perform the left click operation (click). Do a blur on the focused
    // element before the left click is performed (but after the element is
    // found).
    function touch (jq, query) {
        return trigger.execute(jq, query, "touchStart");
    }

    function handleTouch (jq, statement) {
        var matches = regex.exec(statement);
        if(!matches) {
          return result.NOT_HANDLED;
        }
        var success = touch(jq, matches[1]);
        return success ? result.HANDLED : result.NOT_HANDLED;
    }

    function usage () {
        return 'Usage: touch("query"); Touch element that matches query. If more than one element matches query then uses the first.';
    }

    return {
        handle: handleTouch,
        execute: touch,
        toString: usage
    };
});

/*global define */
define("wait", ["result", "executor"], function (result, executor) {
    "use strict";

    // TODO: Need "execute" dependency!

    // Example: wait("#myElement", minWait, maxWait)
    var regex = /^wait\s*\(\s*(?:")([^"]+)(?:")(?:\s*,\s*(\d+))?(?:\s*,\s*(\d+))?\s*\)$/i;

    // Perform the wait operation. This will wait for a query to resolve to an
    // element. If the query does not resolve to an element after maxWait
    // milliseconds, the wait gives up. The minWait is the increment that the
    // wait waits for before checking the query against the DOM. If minWait and
    // maxWait are not specified, a default of 200ms for minWait and 2 seconds
    // for maxWait will be used. Wait happens by setting a timeout and then
    // returning false on execute so that further expressions will not be
    // evaluated until wait is complete.
   function wait (jq, query, remainingStatements, executor, handlers, minWait, maxWait) {
       if (!remainingStatements || !remainingStatements.length) {
           return true;
       }
       if (!maxWait) {
           maxWait = 2000;
       }
       if (!minWait) {
           minWait = 200;
       }
       return waitFor(jq, query, remainingStatements, executor, handlers, maxWait, minWait);
   }

    // Helper method for wait - this is recursively called by setTimeout. If the
    // element we are selecting is found, then evaluate and execute the
    // remaining statements.
    function waitFor (jq, query, remainingStatements, executor, handlers, minWait, maxWait) {
        var elements = $(query);
        if (elements && elements.length) {
            return executor.execute(jq, handlers, remainingStatements);
        }
        if (maxWait > 0) {
            maxWait = maxWait - minWait;
            setTimeout(function() {
                waitFor(jq, query, remainingStatements, executor, handlers, minWait, maxWait);
            }, minWait);
            return false; // prevent execution of the remaining statements
        } else {
            return false;
        }
    }

    // Handle processing the wait command
    function handleWait (jq, statement, remainingStatements, executor, handlers) {
        var query, minWait, maxWait;
        var matches = regex.exec(statement);
        if(!matches) {
            return result.NOT_HANDLED;
        }
        query = matches[1] || "";
        if(matches.length > 2) {
            minWait = matches[2] || 200;
        }
        if(matches.length > 3) {
            maxWait = matches[3] || 2000;
        }
        wait(jq, matches[1], remainingStatements, executor, handlers, minWait, maxWait);
        return { stopExecution: true };
    }

    function usage () {
        return 'Usage: wait("query"); Wait for the existence of an element that matches query. If more than one element matches query then uses the first.';
    }

    return {
        handle: handleWait,
        execute: wait,
        toString: usage
    };
});

/*global define*/
// Define result values
define("result", function() {

    // Build a result object
    // Parameters:
    //    handled: boolean - indicates whether command has handled the request
    //    stop: boolean - indicates whether execution should stop
    //    severity: string - provides a severity level.  Severity levels are defined in result.severities
    //    msg: string - provides a user friendly message
    function build (handled, stop, severity, msg) {
        var obj;
        handled = handled || false;
        stop = stop || false;
        severity = severity || "";
        msg = msg || "";
        obj = { handled: handled, stop: stop };
        if(severity && msg) {
            obj.message = { msg: msg, severity: severity };
        }
        return obj;
    }

    return {
        severities: { ok: "", warning: "warning", error: "error" },
        build: build,
        HANDLED: build(true),
        NOT_HANDLED: build(false)
    };
});

define("triggerEvent", function() {
    // Trigger an event on first element matched by query using jq
    // (jq needs to support the JQuery API).
    function triggerEvent(jq, query, event) {
        var fcn = event;
        if(typeof event !== "function") {
            fcn = function (value) { value.trigger(event); };
        }
        return invokeEvent(jq, query, fcn);
    }

    // Invoke the event upon the element specified by query.
    // This method is responsible for finding the proper element and
    // then passing this element to the function.
    function invokeEvent (jq, query, fcn) {
        var result;
        if(typeof query !== "string" || typeof fcn !== "function" ) {
            return false;
        }
        result = jq(query);
        if (result && result.length > 0) {
          jq(":focus").blur();
          fcn(result.first());
          return true;
        }
        return false;
    }

    return {
        execute: triggerEvent
    };
});

/*global chrome */
define("storage", function storage() {
    "use strict";
    var key = "configuration";
    var storageArea = null;
    try {
        storageArea = chrome.storage.sync;
    } catch (err) {
        console.log("KeyboardShortcuts > could not initiate chrome storage: " + err);
    }
    return {
        get : function(callback) {
            storageArea.get(key, callback);
        },
        set : function(value) {
            var obj = {};
            obj[key] = value;
            storageArea.set(obj);
        },
        extractValue : function(obj) {
            return obj[key];
        }
    };
});
