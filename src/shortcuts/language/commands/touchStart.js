/*global define */
define("touchStart", ["triggerEvent", "result"], function (trigger, result) {
  "use strict";

  var regex = /^touch-start\s*\(\s*(?:")([^"]+)(?:")\s*\)$/i;

  function invokeTouch (el, context) {
    var element = el && el.get && typeof el.get === "function" && el.get(0);
    if(!element) {
      return false;
    }

    var touchStartEvent = new TouchEvent("touchstart", {
      touches: [ new Touch({
        identifier: Math.random() /* super half baked attempt at uniqueness */,
        target: element,
      }) ]
    });
    element.dispatchEvent(touchStartEvent);
    return true;
  }

  // Perform the left click operation (click). Do a blur on the focused
  // element before the left click is performed (but after the element is
  // found).
  function touch (jq, query, context) {
    return trigger.execute(jq, query, context, invokeTouch);
  }

  function canHandle (statement, context) {
    return regex.test(statement);
  }

  // Handle touch start
  function handleTouchStart (jq, statement, context) {
    var success,
        matches = regex.exec(statement);
    if(!matches) {
      return result.NOT_HANDLED;
    }
    success = touch(jq, matches[1], context);
    return success ? result.HANDLED : result.NOT_HANDLED;
  }

  function usage () {
    return 'Usage: touch-start("query"); Touch element that matches query. If more than one element matches query then uses the first.';
  }

  return {
    handle: handleTouchStart,
    canHandle: canHandle,
    execute: touch,
    toString: usage
  };
});
