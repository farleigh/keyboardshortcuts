// Mock the url strategy - we don't really want to test it.
define(function(result) {
  "use strict";
  var calls = "", mockUrlStrategy = {
    getUrl: function mockGetUrl (url, valueObject) {
      calls += "getUrl(" + url + ", " + fold(valueObject, "") + ");";
      return url + "/transformed";
    }
  };

  function fold(object, initialValue) {
    var key;
    if(!object) {
        return initialValue;
    }
    initialValue += "{ ";
    for(key in object) {
        initialValue += key + ": " + object[key] + ", ";
    }
    initialValue += " }";
    return initialValue;
  }

  var getCalls = function getCalls () {
    var currentCalls = calls;
    calls = "";
    return currentCalls;
  };

  // Return the mocked instance as instance and helper method getCalls
  // to determine what was called.
  return {
    instance: mockUrlStrategy,
    getCalls: getCalls
  };
});
