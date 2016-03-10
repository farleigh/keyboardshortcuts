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

  function canHandle(statement) {
    if(regex.exec(statement)) {
      return true;
    }
    return false;
  }

  // Return handled if right click handles this command.
  function handleRightClick (jq, statement) {
    var success,
        matches = regex.exec(statement);
    if(!matches) {
      return result.NOT_HANDLED;
    }
    success = rightClick(jq, matches[1]);
    return success ? result.HANDLED : result.NOT_HANDLED;
  }

  function usage () {
    return 'Usage: right-click("query"); Trigger a right click on an element that matches query. If more than one element matches query then uses the first.';
  }

  return {
    handle: handleRightClick,
    canHandle: canHandle,
    execute: rightClick,
    toString: usage
  };
});
