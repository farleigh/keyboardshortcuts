/*global define */
define("executor", ["contentRetriever"], function (contentRetriever) {

  // Return true if the expression should be run.
  function isTime (jq, when, context) {
    var result;
    if(!when) {
      return true;
    }
    result = contentRetriever.getContent(jq, when, context);
    return result !== "" && result !== undefined && result !== null;
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
