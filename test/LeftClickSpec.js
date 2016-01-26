/*global describe, require, beforeEach, it, expect */
define(["leftClick", "test/lib/mocked-jq"], function (leftClick, mockedJQ) {
    "use strict";

    describe("Left Click Command", function () {
        it("should left click on element with ID myElement.", function () {
            mockedJQ.elementFound(true);
            expect(leftClick.handle(mockedJQ.instance, "left-click(\"#myElement\")")).toEqual({ handled: true, stop: false});
            expect(mockedJQ.getCalls()).toEqual("blur();first();trigger(click);");
        });

        it("should left click on element with ID myElement when command has optional whitespace.", function () {
            mockedJQ.elementFound(true);
            expect(leftClick.handle(mockedJQ.instance, "left-click ( \"#myElement\" )")).toEqual({ handled: true, stop: false});
            expect(mockedJQ.getCalls()).toEqual("blur();first();trigger(click);");
        });

        it("should fail when element is not found.", function () {
            // Should this halt execution?  To consider later.
            mockedJQ.elementFound(false);
            expect(leftClick.handle(mockedJQ.instance, "left-click(\"#myElement\")")).toEqual({ handled: false, stop: false});
            expect(mockedJQ.getCalls()).toEqual("");
        });

        it("should not handle another command.", function () {
            mockedJQ.elementFound(false);
            expect(leftClick.handle(mockedJQ.instance, "focus(\"#myElement\")")).toEqual({ handled: false, stop: false});
            expect(mockedJQ.getCalls()).toEqual("");
        });
    });
});
