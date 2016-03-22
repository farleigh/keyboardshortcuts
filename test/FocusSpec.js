/*global define, describe, require, beforeEach, it, expect */
define("FocusSpec", ["focus", "test/lib/mocked-jq", "test/lib/mocked-doc"], function(focus, mockedJQ, mockedDoc) {
    "use strict";

    describe("Focus command", function() {
        it("should set focus on the element with id myElement.", function() {
            mockedJQ.elementFound(true);
            expect(focus.handle(mockedJQ.instance, "focus(\"#myElement\")"), { document: mockedDoc.instance }).toEqual({ handled: true, stop: false});
            expect(mockedJQ.getCalls()).toEqual("find(#myElement);first();blur();trigger(focus);");
        });

        it("should set focus on the element with id myElement when command has optional whitespace.", function() {
            mockedJQ.elementFound(true);
            expect(focus.handle(mockedJQ.instance, "focus ( \"#myElement\" )", { document: mockedDoc.instance })).toEqual({ handled: true, stop: false});
            expect(mockedJQ.getCalls()).toEqual("find(#myElement);first();blur();trigger(focus);");
        });

        it("should set focus on the first element with class myClass.", function() {
            mockedJQ.elementFound(true);
            expect(focus.handle(mockedJQ.instance, "focus(\".myClass\")", { document: mockedDoc.instance })).toEqual({ handled: true, stop: false});
            expect(mockedJQ.getCalls()).toEqual("find(.myClass);first();blur();trigger(focus);");
        });

        it("should fail when element is not found.", function () {
            // Should this halt execution?  To consider later.
            mockedJQ.elementFound(false);
            expect(focus.handle(mockedJQ.instance, "focus(\".myClass\")", { document: mockedDoc.instance })).toEqual({ handled: false, stop: false});
            expect(mockedJQ.getCalls()).toEqual("find(.myClass);");
            mockedJQ.elementFound(true);
        });

        it("should not handle another command.", function() {
            mockedJQ.elementFound(true);
            expect(focus.handle(mockedJQ.instance, "copy(\".myClass\")", { document: mockedDoc.instance })).toEqual({ handled: false, stop: false});
            expect(mockedJQ.getCalls()).toEqual("");
        });

    });
});
