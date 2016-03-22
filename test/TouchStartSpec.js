/*global define, describe, require, beforeEach, it, expect */
define(["touchStart", "test/lib/mocked-jq", "test/lib/mocked-doc"], function (touch, mockedJQ, mockedDoc) {
    "use strict";

    describe("Touch Start Command", function () {
        it("should touch element with ID myElement.", function () {
            //mockedJQ.elementFound(true);
            //expect(touch.handle(mockedJQ.instance, "touch-start(\"#myElement\")"), { document: mockedDoc.instance }).toEqual({ handled: true, stop: false});
            //expect(mockedJQ.getCalls()).toEqual("find(#myElement);first();blur();");
        });

        it("should left click on element with ID myElement when command has optional whitespace.", function () {
            //mockedJQ.elementFound(true);
            //expect(touch.handle(mockedJQ.instance, "touch-start ( \"#myElement\")", { document: mockedDoc.instance })).toEqual({ handled: true, stop: false});
            //expect(mockedJQ.getCalls()).toEqual("find(#myElement);first();blur();");
        });

        it("should fail when element is not found.", function () {
            // Should this halt execution?  To consider later.
            //mockedJQ.elementFound(false);
            //expect(touch.handle(mockedJQ.instance, "touch-start(\"#myElement\")", { document: mockedDoc.instance })).toEqual({ handled: false, stop: false});
            //expect(mockedJQ.getCalls()).toEqual("find(#myElement);");
            //mockedJQ.elementFound(true);
        });

        it("should not handle another command.", function () {
            //mockedJQ.elementFound(false);
            //expect(touch.handle(mockedJQ.instance, "focus(\"#myElement\")", { document: mockedDoc.instance })).toEqual({ handled: false, stop: false});
            //expect(mockedJQ.getCalls()).toEqual("");
            //mockedJQ.elementFound(true);
        });
    });
});
