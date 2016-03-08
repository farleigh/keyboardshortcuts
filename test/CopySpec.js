/*global define, describe, require, beforeEach, it, expect */
define(["copy", "test/lib/mocked-jq"], function(copy, mockedJQ) {
  "use strict";

  describe("Copy Command", function() {
    it("should copy the contents of element with id myElement.", function() {
        mockedJQ.elementFound(true);
        expect(copy.handle(mockedJQ.instance, "copy(\"#myElement\")")).toEqual({ handled: true, stop: false});
        expect(mockedJQ.getCalls()).toEqual("first();html();appendTo(body);val(ELEMENT CONTENTS TO COPY);select();execCommand();remove();");
    });

    it("should copy the contents of element with id myElement when command has optional whitespace.", function() {
        mockedJQ.elementFound(true);
        expect(copy.handle(mockedJQ.instance, "copy (\"#myElement\" )")).toEqual({ handled: true, stop: false});
        expect(mockedJQ.getCalls()).toEqual("first();html();appendTo(body);val(ELEMENT CONTENTS TO COPY);select();execCommand();remove();");
    });

    it("should copy the attribute of element with id myElement2.", function() {
        mockedJQ.elementFound(true);
        expect(copy.handle(mockedJQ.instance, "copy(\"#myElement2\", \"attribute\")")).toEqual({ handled: true, stop: false});
        expect(mockedJQ.getCalls()).toEqual("first();attr(attribute);appendTo(body);val(ATTRIBUTE VALUE TO COPY);select();execCommand();remove();");
    });

    it("should copy the data attribute of element with class myClass1.", function() {
        mockedJQ.elementFound(true);
        expect(copy.handle(mockedJQ.instance, "copy(\".myClass1\", \"data-attribute\")")).toEqual({ handled: true, stop: false});
        expect(mockedJQ.getCalls()).toEqual("first();data(attribute);appendTo(body);val(DATA ATTRIBUTE VALUE TO COPY);select();execCommand();remove();");
    });

    it("should fail when element is not found.", function () {
        // Should this halt execution?  To consider later.
        mockedJQ.elementFound(false);
        expect(copy.handle(mockedJQ.instance, "copy(\".myClass1\", \"data-attribute\")")).toEqual({ handled: false, stop: false});
        expect(mockedJQ.getCalls()).toEqual("");
    });

    it("should not handle another command.", function() {
        mockedJQ.elementFound(true);
        expect(copy.handle(mockedJQ.instance, "focus(\".myClass\")")).toEqual({ handled: false, stop: false});
        expect(mockedJQ.getCalls()).toEqual("");
    });
  });
});
