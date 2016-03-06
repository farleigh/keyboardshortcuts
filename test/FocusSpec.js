/*global define, describe, require, beforeEach, it, expect */
define(["focus", "test/lib/mocked-jq"], function(focus, mockedJQ) {
    "use strict";

    describe("Focus command", function() {
        it("should set focus on the element with id myElement.", function() {
            mockedJQ.elementFound(true);
            expect(focus.handle(mockedJQ.instance, "focus(\"#myElement\")")).toEqual({ handled: true, stop: false});
            expect(mockedJQ.getCalls()).toEqual("first();trigger(focus);");
        });

        it("should set focus on the element with id myElement when command has optional whitespace.", function() {
            mockedJQ.elementFound(true);
            expect(focus.handle(mockedJQ.instance, "focus ( \"#myElement\" )")).toEqual({ handled: true, stop: false});
            expect(mockedJQ.getCalls()).toEqual("first();trigger(focus);");
        });

        it("should set focus on the first element with class myClass.", function() {
            mockedJQ.elementFound(true);
            expect(focus.handle(mockedJQ.instance, "focus(\".myClass\")")).toEqual({ handled: true, stop: false});
            expect(mockedJQ.getCalls()).toEqual("first();trigger(focus);");
        });

        it("should fail when element is not found.", function () {
            // Should this halt execution?  To consider later.
            mockedJQ.elementFound(false);
            expect(focus.handle(mockedJQ.instance, "focus(\".myClass\")")).toEqual({ handled: false, stop: false});
            expect(mockedJQ.getCalls()).toEqual("");
        });

        it("should not handle another command.", function() {
            mockedJQ.elementFound(true);
            expect(focus.handle(mockedJQ.instance, "copy(\".myClass\")")).toEqual({ handled: false, stop: false});
            expect(mockedJQ.getCalls()).toEqual("");
        });

    });
});
