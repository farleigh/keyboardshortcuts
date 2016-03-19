/*global define */
// Perform a hover operation on element specified with query.
define("hover", ["triggerEvent", "result"], function(trigger, result) {
  "use strict";

  var regex = /^hover\s*\(\s*(?:")([^"]+)(?:")\s*\)$/i;

  // Perform a hover operation (hover).
  function hover (jq, query, context) {
    return trigger.execute(jq, query, context, "mouseenter");
  }

  function canHandle (statement, context) {
    return regex.test(statement);
  }

  function handleHover (jq, statement, context) {
    var matches = regex.exec(statement),
        success;
    if(!matches) {
      return result.NOT_HANDLED;
    }
    success = hover(jq, matches[1], context);
    return success ? result.HANDLED : result.NOT_HANDLED;
  }

  function usage () {
    return 'Usage: hover("query"); Enable hover over element that matches query. If more than one element matches query then uses the first.';
  }

  return {
    handle: handleHover,
    canHandle: canHandle,
    execute: hover,
    toString: usage
  };
});
