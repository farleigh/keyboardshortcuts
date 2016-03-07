/*global define, describe, require, beforeEach, it, expect */
define(["hide", "test/lib/mocked-jq"], function(hide, mockedJQ) {
    "use strict";

    describe("Hide command", function() {
        it("Should hide an element", function() {
            mockedJQ.elementFound(true);
            expect(hide.handle(mockedJQ.instance, "hide(\"#myElement\")")).toEqual({ handled: true, stop: false});
            expect(mockedJQ.getCalls()).toEqual("first();hide();");
        });
    });
});
