/*global define */
// Perform a focus operation (focus) on the element specified by query value.
define("focus", ["result"], function(result) {
  "use strict";

  var regex = /^focus\s*\(\s*(?:")([^"]+)(?:")\s*\)$/i;

  // Perform a focus operation.
  function focus (jq, query) {
    var value = jq(query);
    if (value && value.length > 0) {
      value.first().trigger("focus");
      return true;
    }
    return false;
  }

  // Handle intepreting the focus operation.
  function handleFocus (jq, statement) {
    var success,
        matches = regex.exec(statement);
    if(!matches) {
      return result.NOT_HANDLED;
    }
    success = focus(jq, matches[1]);
    return success ? result.HANDLED : result.NOT_HANDLED;
  }

  function usage () {
    return 'Usage: focus("query"); Sets the focus to be on an element specified by query.  If more than one element matches query then uses the first.';
  }

  return {
    handle: handleFocus,
    execute: focus,
    toString: usage
  };
});
