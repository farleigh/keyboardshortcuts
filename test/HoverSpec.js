/*global define, describe, require, beforeEach, it, expect */
define(["hover", "test/lib/mocked-jq", "test/lib/mocked-doc"], function(hover, mockedJQ, mockedDoc) {
  "use strict";

  describe("Hover command", function() {
    it("should hover over the element with id myElement.", function() {
      mockedJQ.elementFound(true);
      expect(hover.handle(mockedJQ.instance, "hover(\"#myElement\")", { document: mockedDoc.instance })).toEqual({ handled: true, stop: false});
      expect(mockedJQ.getCalls()).toEqual("find(#myElement);first();blur();trigger(mouseenter);");
    });

    it("should hover over the element with id myElement when command has optional whitespace.", function() {
      mockedJQ.elementFound(true);
      expect(hover.handle(mockedJQ.instance, "hover ( \"#myElement\" )", { document: mockedDoc.instance })).toEqual({ handled: true, stop: false});
      expect(mockedJQ.getCalls()).toEqual("find(#myElement);first();blur();trigger(mouseenter);");
    });

    it("should hover over the first element with class myClass.", function() {
      mockedJQ.elementFound(true);
      expect(hover.handle(mockedJQ.instance, "hover(\".myClass\")", { document: mockedDoc.instance })).toEqual({ handled: true, stop: false});
      expect(mockedJQ.getCalls()).toEqual("find(.myClass);first();blur();trigger(mouseenter);");
    });

    it("should fail when element is not found.", function () {
      // Should this halt execution?  To consider later.
      mockedJQ.elementFound(false);
      expect(hover.handle(mockedJQ.instance, "hover(\".myClass\")", { document: mockedDoc.instance })).toEqual({ handled: false, stop: false});
      expect(mockedJQ.getCalls()).toEqual("find(.myClass);");
      mockedJQ.elementFound(true);
    });

    it("should not handle another command.", function() {
      mockedJQ.elementFound(true);
      expect(hover.handle(mockedJQ.instance, "focus(\".myClass\")", { document: mockedDoc.instance })).toEqual({ handled: false, stop: false});
      expect(mockedJQ.getCalls()).toEqual("");
    });

  });
});
