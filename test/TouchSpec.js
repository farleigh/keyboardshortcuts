/*global define, describe, require, beforeEach, it, expect */
define(["touch", "test/lib/mocked-jq"], function (touch, mockedJQ) {
    "use strict";

    describe("Touch Command", function () {
        it("should touch element with ID myElement.", function () {
            mockedJQ.elementFound(true);
            expect(touch.handle(mockedJQ.instance, "touch(\"#myElement\")")).toEqual({ handled: true, stop: false});
            expect(mockedJQ.getCalls()).toEqual("blur();first();trigger(touchStart);");
        });

        it("should left click on element with ID myElement when command has optional whitespace.", function () {
            mockedJQ.elementFound(true);
            expect(touch.handle(mockedJQ.instance, "touch ( \"#myElement\")")).toEqual({ handled: true, stop: false});
            expect(mockedJQ.getCalls()).toEqual("blur();first();trigger(touchStart);");
        });

        it("should fail when element is not found.", function () {
            // Should this halt execution?  To consider later.
            mockedJQ.elementFound(false);
            expect(touch.handle(mockedJQ.instance, "touch(\"#myElement\")")).toEqual({ handled: false, stop: false});
            expect(mockedJQ.getCalls()).toEqual("");
        });

        it("should not handle another command.", function () {
            mockedJQ.elementFound(false);
            expect(touch.handle(mockedJQ.instance, "focus(\"#myElement\")")).toEqual({ handled: false, stop: false});
            expect(mockedJQ.getCalls()).toEqual("");
        });
    });
});
