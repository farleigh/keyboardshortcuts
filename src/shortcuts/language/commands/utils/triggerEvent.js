define("triggerEvent", ["elementRetriever"], function(retriever) {

  // Get the first element that matches query
  function getFirstMatchingElement (jq, query, context) {
    return retriever.get(jq, query, context);
  }

  // Trigger an event on first element matched by query using jq
  // (jq needs to support the JQuery API).
  function triggerEvent(jq, query, context, event) {
    var fcn = event;
    if(typeof event !== "function") {
      fcn = function (value) { value.trigger(event); };
    }
    return invokeEvent(jq, query, context, fcn);
  }

  // Invoke the event upon the element specified by query.
  // This method is responsible for finding the proper element and
  // then passing this element to the function.
  function invokeEvent (jq, query, context, fcn) {
    var result;
    if(typeof query !== "string" || typeof fcn !== "function" ) {
      return false;
    }
    result = getFirstMatchingElement(jq, query, context);
    if(result) {
      try {
        jq(":focus").blur();
      } catch(e) {
        console.log("Error trying to blur focus.");
      }
      fcn(result, context);
      return true;
    }
    return false;
  }

  return {
    execute: triggerEvent
  };
});
