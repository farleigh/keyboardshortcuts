(function() {
    "use strict";

    /**
     * Perform the left click operation (click). Do a blur on the focused
     * element before the left click is performed (but after the element is
     * found).
     */
    var leftClick = function(query) {
        var result = $(query);
        if (result && result.length > 0) {
            $(":focus").blur();
            result.first().trigger("click");
            return true;
        }
        return false;
    };

    /**
     * Perform the right click operation (right-click). Do a blur on the focused
     * element before the right click is performed (but after the element is
     * found).
     */
    var rightClick = function(query) {
        var result = $(query);
        if (result && result.length > 0) {
            $(":focus").blur();
            invokeContextMenuOnObject(result.first());
            return true;
        }
        return false;
    };

    /**
     * Helper method to invoke the right click
     */
    var invokeContextMenuOnObject = function(obj) {
        var element = obj[0];
        var event = element.ownerDocument.createEvent("MouseEvents");
        event.initMouseEvent("contextmenu", true, true,
                element.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false,
                false, false, 2, null);
        return !element.dispatchEvent(event);
    };

    /**
     * Perform a hover operation (hover).
     */
    var hover = function(query) {
        var result = $(query);
        if (result && result.length > 0) {
            result.first().trigger("mouseover");
            return true;
        }
        return false;
    };

    /**
     * Perform the wait operation. This will wait for a query to resolve to an
     * element. If the query does not resolve to an element after maxWait
     * milliseconds, the wait gives up. The minWait is the increment that the
     * wait waits for before checking the query against the DOM. If minWait and
     * maxWait are not specified, a default of 100ms for minWait and 1 second
     * for maxWait will be used. Wait happens by setting a timeout and then
     * pretending failure on execute so that further expressions will not be
     * evaluated until wait is complete.
     */
    var wait = function(query, expressions, maxWait, minWait) {
        if (!expressions || !expressions.length) {
            return true;
        }
        if (!maxWait) {
            maxWait = 2000;
        }
        if (!minWait) {
            minWait = 200;
        }
        return waitFor(query, expressions, maxWait, minWait);
    };

    /**
     * Helper method for wait - this is recursively called by setTimeout. If the
     * element we are selecting is found, then evaluate and execute the
     * remaining statements.
     */
    var waitFor = function(query, expressions, maxWait, minWait) {
        var elements = $(query);
        if (elements && elements.length) {
            return execute(expressions);
        }
        if (maxWait > 0) {
            maxWait = maxWait - minWait;
            setTimeout(function() {
                waitFor(query, expressions, maxWait, minWait);
            }, minWait);
            return false; // prevent execution of the remaining statements
        } else {
            return false;
        }

    };

    /**
     * Get content from an attribute if attribute name is specified, otherwise
     * get content from innerHTML
     */
    var getContent = function(query, attributeName) {
        var elements = $(query);
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
    };

    /**
     * Push content into the clipboard
     */
    var performCopy = function(content) {
        var input = $("<textarea />");
        input.appendTo("body");
        input.val(content);
        input.select();
        $(document)[0].execCommand("copy");
        input.remove();
        return true;
    };

    /**
     * Perform a copy operation (copy). If an attribute is specified, the value
     * of the attribute will be copied. If nothing is specified, the content of
     * the first element matching the query will be copied.
     */
    var copy = function(query, attribute) {
        var value = getContent(query, attribute);
        if (!value) {
            return false;
        }
        return performCopy(value);
    };

    /**
     * Perform a focus operation.
     */
    var focus = function(query) {
        var result = $(query);
        if (result && result.length > 0) {
            result.first().trigger("focus");
            return true;
        }
        return false;
    }

    /**
     * Parse the complete query expression by splitting it up based on the ;\s
     * delimiter and calling parseSingleStatement on each part.
     */
    var parseStatements = function(expression) {
        if (!expression) {
            return [];
        }
        var unparsedExpressions = expression.split(/;\s*/);
        var parsedExpressions = [];
        $.each(unparsedExpressions, function(index, value) {
            parsedExpressions.push(parseSingleStatement(value));
        });
        return parsedExpressions;
    };

    /**
     * Parse a single statement. A statement should consist of an operator
     * followed by operands that are specific to the operation being performed.
     * If an expression does not have a recognizable format, it is ignored.
     */
    var parseSingleStatement = function(expression) {
        var regex = /([-\w]+)\s*\(\s*"([^"]+)"\s*(?:(?:,\s*"([-\w]+)")|(?:(?:,\s*(\d+)\s*)?(?:,\s*(\d+)\s*)?))\s*\)/i;
        var matches = regex.exec(expression);
        var parsedExpression = {};
        if (matches && matches.length >= 2) {
            parsedExpression.operator = matches[1];
            parsedExpression.query = matches[2];
            if (matches.length > 3 && matches[3] !== undefined) {
                if (!parseInt(matches[3])) {
                    parsedExpression.attribute = matches[3];
                } else {
                    parsedExpression.maxWaitTime = parseInt(matches[3]);
                }
            }
            if (matches.length > 4 && matches[4] !== undefined) {
                parsedExpression.minWaitTime = parseInt(matches[4]);
            }
        }
        return parsedExpression;
    };

    /**
     * Execute all statements in order. If a statement does not have a
     * recognizable operation, it is ignored.
     */
    var execute = function(expressions) {
        if (expressions === undefined || expressions.length === 0) {
            return true;
        }
        var expression = expressions.shift();
        var returnVal = true;
        if (expression.operator === "click") {
            returnVal = leftClick(expression.query);
        } else if (expression.operator === "right-click") {
            returnVal = rightClick(expression.query);
        } else if (expression.operator === "wait") {
            returnVal = wait(expression.query, expressions,
                    expression.maxWaitTime, expression.minWaitTime);
        } else if (expression.operator === "hover") {
            returnVal = hover(expression.query);
        } else if (expression.operator === "copy") {
            returnVal = copy(expression.query, expression.attribute);
        } else if (expression.operator === "focus") {
            returnVal = focus(expression.query);
        }
        if (!returnVal) {
            return false;
        }
        return execute(expressions);
    };

    /**
     * Add a handler for each shortcut key that matches the URL pattern.
     */
    var addHandler = function(value) {
        var handler = function() {
            var expressions = parseStatements(value.expression);
            if (expressions) {
                execute(expressions);
            }
        };
        $(document).on("keydown", null, value.sequence, handler);
    };

    // Keep handlers around for turning them off
    var handlers = [];

    /**
     * Remove existing handlers and then add new handlers for each shortcut
     * defined in shortcuts.
     */
    var addHandlers = function(shortcuts) {
        $.each(handlers, function(i, handler) {
            $(document).off("keydown", handler);
        });
        $.each(shortcuts, function(i, value) {
            var urlExpr = value.urlExpression || ".*";
            var regex = new RegExp(value.urlExpression);
            if (regex.exec(window.location.href, "i")) {
                addHandler(value);
                handlers.push(value);
            }
        });
    };

    /**
     * Retrieve all shortcuts from the data store and add the shortcuts with
     * URLs that match the specified pattern to the page to be listened for.
     * Shortcut keys without a URL pattern are considered to match all URLs.
     */
    var loadShortcuts = function() {
        storage.get(function(obj) {
            var values = storage.extractValue(obj);
            addHandlers(values);
        });
    };

    jQuery.hotkeys.options.filterInputAcceptingElements = false;
    jQuery.hotkeys.options.filterContentEditable = false;
    jQuery.hotkeys.options.filterTextInputs = false;

    // Add a listener for messages received from the popup
    chrome.runtime.onMessage
            .addListener(function(request, sender, sendResponse) {
                if (request && request.length) {
                    addHandlers(request);
                }
            });

    // Do the initial load
    $(document).ready(function() {
        loadShortcuts();
    });
})();