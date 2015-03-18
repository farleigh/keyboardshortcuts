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
			result.first().mouseover();
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
		if (!expressions || expressions.length == 0) {
			return true;
		}
		if (!maxWait) {
			maxWait = 4000;
		}
		if (!minWait) {
			minWait = 400;
		}
		return waitFor(query, expressions, maxWait, minWait);
	};

	/**
	 * Helper method for wait - this is recursively called by setTimeout. If the
	 * element we are selecting is found, then evaluate and execute the
	 * remaining expressions.
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
			return false;
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
	 * Parse the complete query expression by splitting it up based on the ;\s
	 * delimiter and calling parseSingle expression on each expression.
	 */
	var parseQueryExpression = function(expression) {
		if (!expression) {
			return [];
		}
		var unparsedExpressions = expression.split(/;\s*/);
		var parsedExpressions = [];
		$.each(unparsedExpressions, function(index, value) {
			parsedExpressions.push(parseSingleExpression(value));
		});
		return parsedExpressions;
	};

	/**
	 * Parse a single expression. An expression should consist of an operator
	 * followed by operands that are specific to the operation being performed.
	 * If an expression does not have a recognizable format, it is ignored.
	 */
	var parseSingleExpression = function(expression) {
		console.log("KeyboardShortcuts > Parsing expression " + expression);
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
	 * Execute all expressions in order. If an expression does not have a
	 * recognizable operation, it is ignored.
	 */
	var execute = function(expressions) {
		if (expressions === undefined || expressions.length === 0) {
			return true;
		}
		var expression = expressions.shift();
		console.log("KeyboardShortcuts > Executing expression "
				+ expression.operator);
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
		}
		if (!returnVal) {
			return false;
		}
		return execute(expressions);
	};

	/**
	 * Add a handle for each shortcut key that matches the URL pattern.
	 */
	var addHandler = function(value) {
		$(document).bind('keydown', value.sequence, function() {
			console.log("KeyboardShortcuts > key invoked " + value.sequence);
			var expressions = parseQueryExpression(value.expression);
			if (expressions) {
				execute(expressions);
			}
		});
	};

	/**
	 * Retrieve all shortcuts from the data store and add the shortcuts with
	 * URLs that match the specified pattern to the page to be listened for.
	 * Shortcut keys without a URL pattern are considered to match all URLs.
	 */
	var invokeShortcuts = function() {
		var key = "configuration";
		var storageArea = null;
		try {
			storageArea = chrome.storage.sync;
		} catch (err) {
			console.log("KeyboardShortcuts > could not initiate chrome storage: " + err);
		}
		storageArea.get(key, function(value) {
			var keyValues = value[key];
			$.each(keyValues, function(i, value) {
				var urlExpr = value.urlExpression;
				if (!urlExpr) {
					urlExpr = ".*";
				}
				var regex = new RegExp(value.urlExpression);
				if (regex.exec(window.location.href, "i")) {
					addHandler(value);
				}
			});
		});
	};

	invokeShortcuts();
})();