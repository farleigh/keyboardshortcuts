(function() {
	"use strict";
	var addHandler = function(value) {
		$(document).bind(
				'keydown',
				value.sequence,
				function() {
					console.log("KeyboardShortcuts > Invoking key "
							+ value.sequence + " for action " + value.action);
					if (value.action == "click") {
						var result = $(value.query);
						result && result.length > 0 && result.first().trigger("click");
					} else if (value.action == "right-click") {
						var result = $(value.query);
						console.log(result);
						result && result.length > 0 && result.first().trigger({
							type : "mousedown",
							which : 3
						}).trigger({
							type : "mouseup"
						});
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
				var regex = new RegExp(value.urlExpression);
				if (regex.exec(window.location.href, "i")) {
					addHandler(value);
				}
			});
		});
	};

	invokeShortcuts();
})();
