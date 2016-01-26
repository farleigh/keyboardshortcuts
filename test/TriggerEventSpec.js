/*global describe, require, beforeEach, it, expect */
define(["triggerEvent", "test/lib/mocked-jq"], function (trigger, mockedJQ) {
    "use strict";

    describe("Trigger Event", function () {
        it("should call a function on an element with ID myElement.", function () {
            var returnVal = "";
            mockedJQ.elementFound(true);
            expect(trigger.execute(mockedJQ.instance, "#myElement", function(val) { returnVal = val; })).toEqual(true);
            // Check the usage of the jquery dependency
            expect(mockedJQ.getCalls()).toEqual("blur();first();");
            // Check whether the anonymous function parameter was called
            // In this case I'm going to cheat and just compare the property
            // keys in the two objects to determine equality.  All we really want
            // to know is that we get back an object that looks like the mocked
            // JQuery guy.
            expect(returnVal.keys).toEqual(mockedJQ.instance()[0].keys);
        });

        it("should fail when element is not found.", function () {
            // Should this halt execution?  To consider later.
            mockedJQ.elementFound(false);
            expect(trigger.execute(mockedJQ.instance, "#myElement", "myevent")).toEqual(false);
            expect(mockedJQ.getCalls()).toEqual("");
        });

        it("should trigger event string on element with ID myElement.", function () {
            mockedJQ.elementFound(true);
            expect(trigger.execute(mockedJQ.instance, "#myElement", "myevent")).toEqual(true);
            // Check the usage of the jquery dependency
            expect(mockedJQ.getCalls()).toEqual("blur();first();trigger(myevent);");
        });
    });
});
