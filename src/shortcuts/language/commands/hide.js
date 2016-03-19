/*global define */
// Perform a hide operation (hide) on the element specified by query value.
define("hide", ["elementRetriever", "result"], function(retriever, result) {
  "use strict";

  var regex = /^hide\s*\(\s*(?:")([^"]+)(?:")\s*\)$/i;

  // Perform a hide operation.
  function hide (jq, query, context) {
    var value = retriever.get(jq, query, context);
    if (value) {
      value.hide();
      return true;
    }
    return false;
  }

  function canHandle (statement, context) {
    return regex.test(statement);
  }

  // Handle intepreting the hide operation.
  function handleHide (jq, statement, context) {
    var matches = regex.exec(statement),
        success;
    if(!matches) {
      return result.NOT_HANDLED;
    }
    success = hide(jq, matches[1], context);
    return success ? result.HANDLED : result.NOT_HANDLED;
  }

  function usage () {
    return 'Usage: hide("query"); Hides an element specified by query.  If more than one element matches query then uses the first.';
  }

  return {
    handle: handleHide,
    canHandle: canHandle,
    execute: hide,
    toString: usage
  };
});
