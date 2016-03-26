/*global define, describe, require, beforeEach, it, expect */
define(["copy", "test/lib/mocked-jq", "test/lib/mocked-doc"], function(copy, mockedJQ, mockedDoc) {
  "use strict";

  describe("Copy Command", function() {
    it("should copy the contents of element with id myElement.", function() {
        mockedJQ.elementFound(true);
        expect(copy.handle(mockedJQ.instance, "copy(\"#myElement\")", { document: mockedDoc.instance })).toEqual({ handled: true, stop: false });
        expect(mockedJQ.getCalls()).toEqual("find(#myElement);html();appendTo(body);val(ELEMENT CONTENTS TO COPY);select();execCommand();remove();");
    });

    it("should copy the contents of element with id myElement when command has optional whitespace.", function() {
        mockedJQ.elementFound(true);
        expect(copy.handle(mockedJQ.instance, "copy (\"#myElement\" )", { document: mockedDoc.instance })).toEqual({ handled: true, stop: false });
        expect(mockedJQ.getCalls()).toEqual("find(#myElement);html();appendTo(body);val(ELEMENT CONTENTS TO COPY);select();execCommand();remove();");
    });

    it("should copy the attribute of element with id myElement2.", function() {
        mockedJQ.elementFound(true);
        expect(copy.handle(mockedJQ.instance, "copy(\"#myElement2\", \"attribute\")", { document: mockedDoc.instance })).toEqual({ handled: true, stop: false });
        expect(mockedJQ.getCalls()).toEqual("find(#myElement2);attr(attribute);appendTo(body);val(ATTRIBUTE VALUE TO COPY);select();execCommand();remove();");
    });

    it("should copy the data attribute of element with class myClass1.", function() {
        mockedJQ.elementFound(true);
        expect(copy.handle(mockedJQ.instance, "copy(\".myClass1\", \"data-attribute\")", { document: mockedDoc.instance })).toEqual({ handled: true, stop: false });
        expect(mockedJQ.getCalls()).toEqual("find(.myClass1);data(attribute);appendTo(body);val(DATA ATTRIBUTE VALUE TO COPY);select();execCommand();remove();");
    });

    it("should fail when element is not found.", function () {
        // Should this halt execution?  To consider later.
        mockedJQ.elementFound(false);
        expect(copy.handle(mockedJQ.instance, "copy(\".myClass1\", \"data-attribute\")", { document: mockedDoc.instance })).toEqual({ handled: false, stop: false });
        expect(mockedJQ.getCalls()).toEqual("find(.myClass1);");
        mockedJQ.elementFound(true);
    });

    it("should not handle another command.", function() {
        expect(copy.handle(mockedJQ.instance, "focus(\".myClass\")", { document: mockedDoc.instance })).toEqual({ handled: false, stop: false });
        expect(mockedJQ.getCalls()).toEqual("");
    });
  });
});
