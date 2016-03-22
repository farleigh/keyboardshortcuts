/*global define, describe, require, beforeEach, it, expect */
define("RightClickSpec", ["rightClick", "test/lib/mocked-jq", "test/lib/mocked-doc"], function (rightClick, mockedJQ, mockedDoc) {
  "use strict";

  describe("Right Click Command", function () {

    var position = { x: 100, y: 100 };

    it("should right click on element with ID myElement.", function () {
        mockedJQ.elementFound(true);
        expect(rightClick.handle(mockedJQ.instance,
                                 "right-click(\"#myElement\")",
                                 { document: mockedDoc.instance, position: position })).toEqual({ handled: true, stop: false});
        expect(mockedJQ.getCalls()).toEqual("find(#myElement);first();blur();get(0);ownerDocument.dispatchEvent();");
    });

    it("should right click on element with ID myElement when command has optional whitespace.", function () {
        mockedJQ.elementFound(true);
        expect(rightClick.handle(mockedJQ.instance,
                                 "right-click ( \"#myElement\")",
                                 { document: mockedDoc.instance, position: position })).toEqual({ handled: true, stop: false});
        expect(mockedJQ.getCalls()).toEqual("find(#myElement);first();blur();get(0);ownerDocument.dispatchEvent();");
    });

    it("should fail when element is not found.", function () {
        // Should this halt execution?  To consider later.
        mockedJQ.elementFound(false);
        expect(rightClick.handle(mockedJQ.instance,
                                 "right-click(\"#myElement\")",
                                 { document: mockedDoc.instance, position: position })).toEqual({ handled: false, stop: false});
        expect(mockedJQ.getCalls()).toEqual("find(#myElement);");
        mockedJQ.elementFound(true);
    });

    it("should not handle another command.", function () {
        mockedJQ.elementFound(false);
        expect(rightClick.handle(mockedJQ.instance,
                                 "focus(\"#myElement\")",
                                 { document: mockedDoc.instance, position: position })).toEqual({ handled: false, stop: false});
        expect(mockedJQ.getCalls()).toEqual("");
        mockedJQ.elementFound(true);
    });
  });
});
