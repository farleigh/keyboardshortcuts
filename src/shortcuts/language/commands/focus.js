/*global define */
// Perform a focus operation (focus) on the element specified by query value.
define("focus", ["triggerEvent", "result"], function(trigger, result) {
  "use strict";

  var regex = /^focus\s*\(\s*(?:")([^"]+)(?:")\s*\)$/i;

  // Perform a focus operation.
  function focus (jq, query, context) {
    return trigger.execute(jq, query, context, "focus");
  }

  function canHandle (statement, context) {
    return regex.test(statement);
  }

  // Handle intepreting the focus operation.
  function handleFocus (jq, statement, context) {
    var success,
        matches = regex.exec(statement);
    if(!matches) {
      return result.NOT_HANDLED;
    }
    success = focus(jq, matches[1], context);
    return success ? result.HANDLED : result.NOT_HANDLED;
  }

  function usage () {
    return 'Usage: focus("query"); Sets the focus to be on an element specified by query.  If more than one element matches query then uses the first.';
  }

  return {
    handle: handleFocus,
    canHandle: canHandle,
    execute: focus,
    toString: usage
  };
});
