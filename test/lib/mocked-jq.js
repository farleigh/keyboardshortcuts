// A low budget way to mock jquery - can be replaced if mocking needs get more complex.
define(function(result) {
  "use strict";
  var calls = "";
  var shouldBeFound = true;

  function mockJQ(query) {

    var mockData = function mockData (dataName, value) {
      calls += "data(";
      calls += dataName;
      if(value) {
        calls += ", ";
        calls += value;
      }
      calls += ");";
      if(!value) {
        return "DATA ATTRIBUTE VALUE TO COPY";
      }
    };

    var mockAttr = function mockAttr (attrName, value) {
      calls += "attr(";
      calls += attrName;
      if(value) {
        calls += ", ";
        calls += value;
      }
      calls += ");";
      if(!value) {
        return "ATTRIBUTE VALUE TO COPY";
      }
    };

    var mockHTML = function mockHTML (value) {
      calls += "html(";
      if(value) {
        calls += value;
      }
      calls += ");";
      if(!value) {
        return "ELEMENT CONTENTS TO COPY";
      }
    };

    var mockExecCommand = function mockExecCommand () {
      calls += "execCommand();";
    };

    var mockAppendTo = function mockAppendTo (value) {
      calls += "appendTo(" + value + ");";
    };

    var mockVal = function mockVal (value) {
      calls += "val(" + value + ");";
      return "VALUE";
    };

    var mockSelect = function mockSelect () {
      calls += "select();";
    };

    var mockRemove = function mockRemove () {
      calls += "remove();";
    };

    var mockFirst = function mockFirst () {
      calls += "first();";
      return this[0];
    };

    var mockHide = function mockHide () {
      calls += "hide();";
    };

    var mockTrigger = function mockTrigger (event) {
      calls += "trigger(" + event + ");";
      return this;
    };

    var mockBlur = function mockBlur () {
        calls += "blur();";
    };

    var mockedOwnerDoc = {
        createEvent: function createEvent () {
            calls += "ownerDocument.createEvent();";
            return {
                initMouseEvent: function () {
                    calls += "event.initMouseEvent();";
                }
            };
        }
    };

    var mockGet = function mockGet (index) {
        calls += "get(" + index + ");";
        return {
            ownerDocument: mockedOwnerDoc,
            dispatchEvent: function () {
                calls += "ownerDocument.dispatchEvent();";
            }
        };
    };

    if(shouldBeFound) {
        // Mock an array that also appears to act as a single element
        var result = [{
            data: mockData,
            attr: mockAttr,
            html: mockHTML,
            appendTo: mockAppendTo,
            val: mockVal,
            select: mockSelect,
            remove: mockRemove,
            execCommand: mockExecCommand,
            trigger: mockTrigger,
            blur: mockBlur,
            ownerDocument: mockedOwnerDoc,
            get: mockGet,
            hide: mockHide
        }];

        result.first = mockFirst;
        result.appendTo = mockAppendTo;
        result.val = mockVal;
        result.select = mockSelect;
        result.remove = mockRemove;
        result.execCommand = mockExecCommand;
        result.trigger = mockTrigger;
        result.blur = mockBlur;
        result.ownerDocument = mockedOwnerDoc;
        result.get = mockGet;
        result.hide = mockHide;

        return result;
    } // else return undefined
  }

  var getCalls = function getCalls () {
    var currentCalls = calls;
    calls = "";
    return currentCalls;
  };

  var elementFound = function elementFound (found) {
      shouldBeFound = found;
  };

  // Return the mocked instance as instance and helper method getCalls
  // to determine what was called.
  return {
    instance: mockJQ,
    getCalls: getCalls,
    elementFound: elementFound
  };
});
