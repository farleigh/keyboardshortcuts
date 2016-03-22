/*global define, describe, require, beforeEach, it, expect */
define("SetSpec", ["set", "test/lib/mocked-jq", "test/lib/mocked-window", "test/lib/mocked-doc"], function(set, mockedJQ, mockedWindow, mockedDoc) {
  "use strict";

  describe("Set command", function() {

    var win = mockedWindow.instance;

    beforeEach(function () {
      win.location.href = "/foo/bar?query=ONE%20DAY%20AS%20A%20LION";
      win.selection = "ONE HUNDRED YEARS AS A SHEEP";
      mockedJQ.elementFound(true);
    });

    it("should set value into an element.", function() {

        expect(set.handle(mockedJQ.instance, "set(el(\"#myElement\"), \"${0}, ${1}\", el(\"#myOtherElement\"), el(\"#myOtherElement\", \"myAttribute\"))", { window: win, document: mockedDoc.instance })).toEqual({ handled: true, stop: false});
        expect(mockedJQ.getCalls()).toEqual("find(#myOtherElement);first();html();find(#myOtherElement);first();attr(myAttribute);find(#myElement);first();html(ELEMENT CONTENTS TO COPY, ATTRIBUTE VALUE TO COPY);");
    });

    it("should set value into an element's attribute.", function() {
        expect(set.handle(mockedJQ.instance, "set(el(\"#myElement\", \"myAttr\"), \"${0}, ${1}\", el(\"#myOtherElement\"), el(\"#myOtherElement\", \"myAttribute\"))", { window: win, document: mockedDoc.instance })).toEqual({ handled: true, stop: false});
        expect(mockedJQ.getCalls()).toEqual("find(#myOtherElement);first();html();find(#myOtherElement);first();attr(myAttribute);find(#myElement);first();attr(myAttr, ELEMENT CONTENTS TO COPY, ATTRIBUTE VALUE TO COPY);");
    });

    it("should set value into an element (ignoring regex).", function() {
        expect(set.handle(mockedJQ.instance, "set(el(\"#myElement\", /test/), \"${0}\", url())", { window: win, document: mockedDoc.instance })).toEqual({ handled: true, stop: false});
        expect(mockedJQ.getCalls()).toEqual("find(#myElement);first();html(/foo/bar?query=ONE DAY AS A LION);");
    });

    it("should set value into an element's attribute (ignoring regex).", function() {
        expect(set.handle(mockedJQ.instance, "set(el(\"#myElement\", \"attribute\", /test/), \"${0}\", selected(/years/i))", { window: win, document: mockedDoc.instance })).toEqual({ handled: true, stop: false});
        expect(mockedJQ.getCalls()).toEqual("find(#myElement);first();attr(attribute, YEARS);");
    });

  });
});
