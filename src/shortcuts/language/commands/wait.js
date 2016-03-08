/*global define */
define("wait", ["result", "executor"], function (result, executor) {
  "use strict";

  // TODO: Need "execute" dependency!

  // Example: wait("#myElement", minWait, maxWait)
  var regex = /^wait\s*\(\s*(?:")([^"]+)(?:")(?:\s*,\s*(\d+))?(?:\s*,\s*(\d+))?\s*\)$/i;

  // Perform the wait operation. This will wait for a query to resolve to an
  // element. If the query does not resolve to an element after maxWait
  // milliseconds, the wait gives up. The minWait is the increment that the
  // wait waits for before checking the query against the DOM. If minWait and
  // maxWait are not specified, a default of 200ms for minWait and 2 seconds
  // for maxWait will be used. Wait happens by setting a timeout and then
  // returning false on execute so that further expressions will not be
  // evaluated until wait is complete.
 function wait (jq, query, remainingStatements, executor, handlers, minWait, maxWait) {
   if (!remainingStatements || !remainingStatements.length) {
     return true;
   }
   minWait = minWait || 200;
   maxWait = maxWait || 2000;
   waitFor(jq, query, remainingStatements, executor, handlers, minWait, maxWait);
 }

  // Helper method for wait - this is recursively called by setTimeout. If the
  // element we are selecting is found, then evaluate and execute the
  // remaining statements.
  function waitFor (jq, query, remainingStatements, executor, handlers, minWait, maxWait) {
    var elements = $(query);
    if (elements && elements.length) {
      return executor.execute(jq, handlers, remainingStatements);
    }
    if (maxWait > 0) {
      maxWait = maxWait - minWait;
      setTimeout(function() {
          waitFor(jq, query, remainingStatements, executor, handlers, minWait, maxWait);
      }, minWait);
    }
  }

  // Handle processing the wait command
  function handleWait (jq, statement, remainingStatements, executor, handlers) {
    var query,
        minWait,
        maxWait,
        matches = regex.exec(statement);
    if(!matches) {
      return result.NOT_HANDLED;
    }
    query = matches[1] || "";
    if(matches.length > 2) {
      minWait = matches[2];
    }
    if(matches.length > 3) {
      maxWait = matches[3];
    }
    wait(jq, matches[1], remainingStatements, executor, handlers, minWait, maxWait);
    return { stopExecution: true };
  }

  function usage () {
    return 'Usage: wait("query"); Wait for the existence of an element that matches query. If more than one element matches query then uses the first.';
  }

  return {
    handle: handleWait,
    execute: wait,
    toString: usage
  };
});
