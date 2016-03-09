/*global define, describe, require, beforeEach, it, expect */
define(["set", "test/lib/mocked-jq", "test/lib/mocked-window"], function(set, mockedJQ, mockedWindow) {
  "use strict";

  var win = mockedWindow.instance;

  describe("Set command", function() {
    beforeEach(function () {
      win.location.href = "/foo/bar?query=ONE%20DAY%20AS%20A%20LION";
      win.selection = "ONE HUNDRED YEARS AS A SHEEP";
      set.setWindow(win);
      mockedJQ.elementFound(true);
    });

    it("should set value into an element.", function() {
        expect(set.handle(mockedJQ.instance, "set(el(\"#myElement\"), \"${0}, ${1}\", el(\"#myOtherElement\"), el(\"#myOtherElement\", \"myAttribute\"))")).toEqual({ handled: true, stop: false});
        expect(mockedJQ.getCalls()).toEqual("first();html();first();attr(myAttribute);first();html(ELEMENT CONTENTS TO COPY, ATTRIBUTE VALUE TO COPY);");
    });

    it("should set value into an element's attribute.", function() {
        expect(set.handle(mockedJQ.instance, "set(el(\"#myElement\", \"myAttr\"), \"${0}, ${1}\", el(\"#myOtherElement\"), el(\"#myOtherElement\", \"myAttribute\"))")).toEqual({ handled: true, stop: false});
        expect(mockedJQ.getCalls()).toEqual("first();html();first();attr(myAttribute);first();attr(myAttr, ELEMENT CONTENTS TO COPY, ATTRIBUTE VALUE TO COPY);");
    });

    it("should set value into an element (ignoring regex).", function() {
        expect(set.handle(mockedJQ.instance, "set(el(\"#myElement\", /test/), \"${0}\", url())")).toEqual({ handled: true, stop: false});
        expect(mockedJQ.getCalls()).toEqual("first();html(/foo/bar?query=ONE DAY AS A LION);");
    });

    it("should set value into an element's attribute (ignoring regex).", function() {
        expect(set.handle(mockedJQ.instance, "set(el(\"#myElement\", \"attribute\", /test/), \"${0}\", selected(/years/i))")).toEqual({ handled: true, stop: false});
        expect(mockedJQ.getCalls()).toEqual("first();attr(attribute, YEARS);");
    });


  });
});
