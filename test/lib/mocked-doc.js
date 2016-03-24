// Mock the document
define(function() {

  var calls = "";

  // Return an element
  function elementFromPoint (x, y) {
    calls += "elementFromPoint(" + x + "," + y + ");";
    return document.createElement("div");
  }

  // Get calls that have been performed on this doc
  function getCalls () {
    var currentCalls = calls;
    calls = "";
    return currentCalls;
  }

  // Return true if this is a mocked doc. Mocked JQuery sometimes needs to know.
  function isMockedDoc () {
    return true;
  }

  return {
    instance: {
      elementFromPoint: elementFromPoint,
      isMockedDoc: isMockedDoc
    },
    getCalls: getCalls
  };
});
