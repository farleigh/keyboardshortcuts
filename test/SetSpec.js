/*global define, describe, require, beforeEach, it, expect */
define(["set", "test/lib/mocked-jq", "test/lib/mocked-window"], function(set, mockedJQ, mockedWindow) {
  "use strict";

  var win = mockedWindow.instance;

  describe("Set command", function() {
    beforeEach(function () {
      win.location.href = "/foo/bar?query=ONE%20DAY%20AS%20A%20LION";
      win.selection = "ONE HUNDRED YEARS AS A SHEEP";
      set.setWindow(win);
    });

    it("should set value into an element.", function() {
        expect(set.handle(mockedJQ.instance, "set(el(\"#myElement\"), \"${0}, ${1}\", el(\"#myOtherElement\"), el(\"#myOtherElement\", \"myAttribute\"))")).toEqual({ handled: true, stop: false});
        expect(mockedJQ.getCalls()).toEqual("first();html();first();attr(myAttribute);first();html(ELEMENT CONTENTS TO COPY, ATTRIBUTE VALUE TO COPY);");
    });

  });
});
