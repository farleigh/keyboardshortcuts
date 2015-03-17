(function() {
	"use strict";

	var leftClick = function(query) {
		var result = $(query);
		if (result && result.length > 0) {
			$(":focus").blur();
			console.log(result);
			result.first().trigger("click");
			return true;
		}
		return false;
	};

	var rightClick = function(query) {
		var result = $(query);
		if (result && result.length > 0) {
			$(":focus").blur();
			invokeContextMenuOnObject(result.first());
			return true;
		}
		return false;
	};

	var invokeContextMenuOnObject = function(obj) {
		var element = obj[0];
		var event = element.ownerDocument.createEvent("MouseEvents");
		event.initMouseEvent("contextmenu", true, true,
				element.ownerDocument.defaultView, 1, 0, 0, 0, 0, false, false,
				false, false, 2, null);
		return !element.dispatchEvent(event);
	};

	var hover = function(query) {
		var result = $(query);
		if (result && result.length > 0) {
			result.first().mouseover();
			return true;
		}
		return false;
	};

	var wait = function(query, maxWait, minWait) {
		if ($(query)) {
			return true;
		}
		if (!maxWait) {
			maxWait = 1000;
		}
		if (!minWait) {
			minWait = 100;
		}
		if (maxWait > 0) {
			setTimeout(waitFor(query, minWait, maxWait - minWait), minWait);
		} else {
			return true;
		}
	};

	var parseQueryExpression = function(expression) {
		if (!expression) {
			return [];
		}
		var unparsedExpressions = expression.split(/;\s*/);
		console.log("Splitting expressions");
		console.log(unparsedExpressions);
		var parsedExpressions = [];
		$.each(unparsedExpressions, function(index, value) {
			parsedExpressions.push(parseSingleExpression(value));
		});
		return parsedExpressions;
	};

	var parseSingleExpression = function(expression) {
		console.log("KeyboardShortcuts > Parsing expression " + expression);
		var regex = /([-\w]+)\s*\(\s*\"(.+)\"\s*(?:(?:,\s*\"([-\w]+)\")|(?:(?:,\s*(\d+)\s*)?(?:,\s*(\d+)\s*)?))\s*\)/i;
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

	var execute = function(expressions) {
		if (expressions === undefined || expressions.length === 0) {
			return true;
		}
		var expression = expressions.shift();
		console.log("KeyboardShortcuts > Executing expression " + expression);
		var returnVal = true;
		if (expression.operator === "click") {
			returnVal = leftClick(expression.query);
		} else if (expression.operator === "right-click") {
			returnVal = rightClick(expression.query);
		} else if (expression.operator === "wait") {
			returnVal = wait(expression.query, expression.maxWaitTime,
					expression.minWaitTime);
		} else if (expression.operator === "hover") {
			returnVal = hover(expression.query);
		}
		if (!returnVal) {
			return false;
		}
		return execute(expressions);
	};

	var addHandler = function(value) {
		$(document).bind('keydown', value.sequence, function() {
			console.log("KeyboardShortcuts > key invoked " + value.sequence);
			var expressions = parseQueryExpression(value.expression);
			console.log(expressions);
			if (expressions) {
				execute(expressions);
			}
		});
	};

	var invokeShortcuts = function() {
		var key = "configuration";
		var storageArea = null;
		try {
			storageArea = chrome.storage.sync;
		} catch (err) {
			console.log("could not initiate chrome storage: " + err);
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
