/*global describe, require, beforeEach, it, expect */
define(["hover", "test/lib/mocked-jq"], function(hover, mockedJQ) {
    "use strict";

    describe("Hover command", function() {
        it("should hover over the element with id myElement.", function() {
            mockedJQ.elementFound(true);
            expect(hover.handle(mockedJQ.instance, "hover(\"#myElement\")")).toEqual({ handled: true, stop: false});
            expect(mockedJQ.getCalls()).toEqual("first();trigger(mouseover);");
        });

        it("should hover over the element with id myElement when command has optional whitespace.", function() {
            mockedJQ.elementFound(true);
            expect(hover.handle(mockedJQ.instance, "hover ( \"#myElement\" )")).toEqual({ handled: true, stop: false});
            expect(mockedJQ.getCalls()).toEqual("first();trigger(mouseover);");
        });

        it("should hover over the first element with class myClass.", function() {
            mockedJQ.elementFound(true);
            expect(hover.handle(mockedJQ.instance, "hover(\".myClass\")")).toEqual({ handled: true, stop: false});
            expect(mockedJQ.getCalls()).toEqual("first();trigger(mouseover);");
        });

        it("should fail when element is not found.", function () {
            // Should this halt execution?  To consider later.
            mockedJQ.elementFound(false);
            expect(hover.handle(mockedJQ.instance, "hover(\".myClass\")")).toEqual({ handled: false, stop: false});
            expect(mockedJQ.getCalls()).toEqual("");
        });

        it("should not handle another command.", function() {
            mockedJQ.elementFound(true);
            expect(hover.handle(mockedJQ.instance, "focus(\".myClass\")")).toEqual({ handled: false, stop: false});
            expect(mockedJQ.getCalls()).toEqual("");
        });

    });
});
