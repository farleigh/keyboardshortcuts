/*global define, describe, require, beforeEach, it, expect */
define("HideSpec", ["hide", "test/lib/mocked-jq", "test/lib/mocked-doc"], function(hide, mockedJQ, mockedDoc) {
    "use strict";

    describe("Hide command", function() {
        it("Should hide an element", function() {
            expect(hide.handle(mockedJQ.instance, "hide(\"#myElement\")", { document: mockedDoc.instance })).toEqual({ handled: true, stop: false});
            expect(mockedJQ.getCalls()).toEqual("find(#myElement);first();hide();");
        });
    });
});
