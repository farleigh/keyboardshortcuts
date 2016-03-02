/*global define */
define("executor", function () {
    function execute (jq, handlers, statements) {
        var i, j, handlerKey, handler, stopExecution = false;
        if(!statements || !handlers) {
          return true;
        }
        while(statements.length > 0) {
          var statement = statements.shift();
          if(statement) {
            for(handlerKey in handlers) {
              handler = handlers[handlerKey];
              var result = handler.handle(jq, statement, statements, this, handlers);
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
