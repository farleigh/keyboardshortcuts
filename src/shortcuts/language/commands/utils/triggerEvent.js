define("triggerEvent", function() {
  // Trigger an event on first element matched by query using jq
  // (jq needs to support the JQuery API).
  function triggerEvent(jq, query, event) {
    var fcn = event;
    if(typeof event !== "function") {
      fcn = function (value) { value.trigger(event); };
    }
    return invokeEvent(jq, query, fcn);
  }

  // Invoke the event upon the element specified by query.
  // This method is responsible for finding the proper element and
  // then passing this element to the function.
  function invokeEvent (jq, query, fcn) {
    var result;
    if(typeof query !== "string" || typeof fcn !== "function" ) {
      return false;
    }
    result = jq(query);
    if (result && result.length > 0) {
      jq(":focus").blur();
      fcn(result.first());
      return true;
    }
    return false;
  }

  return {
    execute: triggerEvent
  };
});
