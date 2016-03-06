/*global define, describe, require, beforeEach, it, expect */
define(["rightClick", "test/lib/mocked-jq"], function (rightClick, mockedJQ) {
    "use strict";

    describe("Right Click Command", function () {
        it("should right click on element with ID myElement.", function () {
            mockedJQ.elementFound(true);
            expect(rightClick.handle(mockedJQ.instance, "right-click(\"#myElement\")")).toEqual({ handled: true, stop: false});
            expect(mockedJQ.getCalls()).toEqual("blur();first();get(0);ownerDocument.createEvent();event.initMouseEvent();ownerDocument.dispatchEvent();");
        });

        it("should right click on element with ID myElement when command has optional whitespace.", function () {
            mockedJQ.elementFound(true);
            expect(rightClick.handle(mockedJQ.instance, "right-click ( \"#myElement\")")).toEqual({ handled: true, stop: false});
            expect(mockedJQ.getCalls()).toEqual("blur();first();get(0);ownerDocument.createEvent();event.initMouseEvent();ownerDocument.dispatchEvent();");
        });

        it("should fail when element is not found.", function () {
            // Should this halt execution?  To consider later.
            mockedJQ.elementFound(false);
            expect(rightClick.handle(mockedJQ.instance, "right-click(\"#myElement\")")).toEqual({ handled: false, stop: false});
            expect(mockedJQ.getCalls()).toEqual("");
        });

        it("should not handle another command.", function () {
            mockedJQ.elementFound(false);
            expect(rightClick.handle(mockedJQ.instance, "focus(\"#myElement\")")).toEqual({ handled: false, stop: false});
            expect(mockedJQ.getCalls()).toEqual("");
        });
    });
});
