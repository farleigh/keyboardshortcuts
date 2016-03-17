/*global define */
define("leftClick", ["triggerEvent", "result"], function(trigger, result) {
  "use strict";

  var regex = /^(?:left-)?click\s*\(\s*(?:")([^"]+)(?:")\s*\)$/i;

  // Perform the left click operation (click). Do a blur on the focused
  // element before the left click is performed (but after the element is
  // found).
  function leftClick (jq, query, context) {
    return trigger.execute(jq, query, context, "click");
  }

  function canHandle(statement, context) {
    if(regex.exec(statement)) {
      return true;
    }
    return false;
  }

  function handleLeftClick (jq, statement, context) {
    var attribute,
        success,
        matches = regex.exec(statement);
    if(!matches) {
      return result.NOT_HANDLED;
    }
    success = leftClick(jq, matches[1], context);
    return success ? result.HANDLED : result.NOT_HANDLED;
  }

  function usage () {
    return 'Usage: left-click("query"); Click element that matches query. If more than one element matches query then uses the first.';
  }

  return {
    handle: handleLeftClick,
    canHandle: canHandle,
    execute: leftClick,
    toString: usage
  };
});
