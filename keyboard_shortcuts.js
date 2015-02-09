/* Cancel */
$(document).bind('keydown', 'Alt+Shift+x', function() {
	console.log("KeyboardShortcuts > Cancelling document");
	$("a>span:contains('Cancel')").click();
});

/* Save */
$(document).bind('keydown', 'Alt+Shift+s', function() {
	console.log("KeyboardShortcuts > Saving document");
	$("a>span:contains('Submit')").click();
});