// A low budget way to mock jquery - can be replaced if mocking needs get more complex.
define(function(result) {
  "use strict";
  var calls = "";
  var shouldBeFound = true;

  function mockJQ(query) {

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

    function isMockedDoc (query) {
      return query && query.isMockedDoc && typeof query.isMockedDoc === "function" && query.isMockedDoc();
    }

    function mockData (dataName, value) {
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
    }

    function mockAttr (attrName, value) {
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
    }

    function mockHTML (value) {
      calls += "html(";
      if(value) {
        calls += value;
      }
      calls += ");";
      if(!value) {
        return "ELEMENT CONTENTS TO COPY";
      }
    }

    function mockExecCommand () {
      calls += "execCommand();";
    }

    function mockAppendTo (value) {
      calls += "appendTo(" + value + ");";
    }

    function mockVal (value) {
      calls += "val(" + value + ");";
      return "VALUE";
    }

    function mockSelect () {
      calls += "select();";
    }

    function mockRemove () {
      calls += "remove();";
    }

    function mockFirst () {
      calls += "first();";
      return getInstance()[0];
    }

    function mockHide () {
      calls += "hide();";
    }

    function mockTrigger (event) {
      calls += "trigger(" + event + ");";
      return getInstance();
    }

    function mockBlur () {
      calls += "blur();";
    }

    function mockGet (index) {
      calls += "get(" + index + ");";
      if(!shouldBeFound) {
        return undefined;
      }
      return {
        ownerDocument: mockedOwnerDoc,
        dispatchEvent: function () {
          calls += "ownerDocument.dispatchEvent();";
        }
      };
    }

    function mockContents () {
      calls += "contents();";
      return getInstance();
    }

    function mockEq (index) {
      calls += "eq(" + index + ");";
      if(shouldBeFound) {
        return getInstance();
      }
    }

    function mockFind (query) {
      calls += "find(" + query + ");";
      if(shouldBeFound) {
        return getInstance();
      }
    }

    // Mock an array that also appears to act as a single element
    function getInstance() {
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
          hide: mockHide,
          contents: mockContents,
          eq: mockEq,
          find: mockFind
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
      result.contents = mockContents;
      result.eq = mockEq;
      result.find = mockFind;
      return result;
    }

    if(shouldBeFound || isMockedDoc(query)) {
      return getInstance();
    }
  }

  function getCalls () {
    var currentCalls = calls;
    calls = "";
    return currentCalls;
  }

  function elementFound (found) {
    shouldBeFound = found;
  }

  // Return the mocked instance as instance and helper method getCalls
  // to determine what was called.
  return {
    instance: mockJQ,
    getCalls: getCalls,
    elementFound: elementFound
  };
});
