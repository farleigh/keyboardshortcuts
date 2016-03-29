/*global define */
define("executor", ["contentRetriever"], function (contentRetriever) {

  var notRegex = /not\((.*)\)/i;

  // Returns true if value is any of the possible empty-falsy values.
  function isValueFalsy(value) {
    return value === "" || value === undefined || value === null;
  }

  // Return true if the expression should be run.
  function isTime (jq, when, context) {
    var result, matches, isNegated = false;
    if(!when) {
      return true;
    }
    matches = notRegex.exec(when);
    if(matches) {
      when = matches[1];
      isNegated = true;
    }

    result = contentRetriever.getContent(jq, when, context);
    // If is negated then result must be at least one of the falsy values. If not negated
    // then result cannot be any of the falsy values.
    return (isNegated && isValueFalsy(when)) || (!isNegated && !isValueFalsy(when));
  }

  function execute (jq, when, handlers, statements, context) {
    var i, j, handlerKey, handler, stopExecution = false, result;
    // If not statements or handlers then simply return
    if(!statements || !handlers || !isTime(jq, when, context)) {
      return true;
    }
    while(statements.length > 0) {
      var statement = statements.shift();
      if(statement) {
        for(handlerKey in handlers) {
          handler = handlers[handlerKey];
          result = handler.handle(jq, statement, context, statements, this, handlers);
          if(result.stopExecution === true) {
            stopExecution = true;
            break;
          }
          if(result.handled === true) {
            break;
          }
        }
      }
      if(stopExecution) {
          break;
      }
    }
    return true;
  }

  return {
    execute: execute
  };
});
