/*global define */
// Perform a hover operation on element specified with query.
define("rightClick", ["triggerEvent", "result"], function(trigger, result) {
  "use strict";

  var regex = /^right-click\s*\(\s*(?:")([^"]+)(?:")\s*\)$/i;

  // Helper method to invoke the right click
  function invokeContextMenuOnObject (obj, context) {
    var element = obj.get(0);
    var event = new MouseEvent("contextmenu", {
      "view": element.ownerDocument.defaultView,
      "button": 2,
      "screenX": context.position.x,
      "screenY": context.position.y,
      "bubbles": true,
      'cancelable': true
    });
    element.dispatchEvent(event);
  }

  // Perform the right click operation (right-click). Do a blur on the focused
  // element before the right click is performed (but after the element is
  // found).
  function rightClick (jq, query, context) {
    return trigger.execute(jq, query, context, function (obj) { invokeContextMenuOnObject(obj, context); });
  }

  function canHandle(statement, context) {
    return regex.test(statement);
  }

  // Return handled if right click handles this command.
  function handleRightClick (jq, statement, context) {
    var success,
        matches = regex.exec(statement);
    if(!matches) {
      return result.NOT_HANDLED;
    }
    success = rightClick(jq, matches[1], context);
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
