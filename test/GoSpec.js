/*global define, describe, require, beforeEach, it, expect */
define(["go", "test/lib/mocked-jq", "test/lib/mocked-window", "test/lib/mocked-doc"], function(go, mockedJQ, mockedWindow, mockedDoc) {
  "use strict";

  describe("Go command", function() {

    var win = mockedWindow.instance;

    beforeEach(function () {
      win.location.href = "/foo/bar?query=ONE%20DAY%20AS%20A%20LION";
      win.selection = "ONE HUNDRED YEARS AS A SHEEP";
    });

    it("should go to a full url.", function() {
      expect(go.handle(mockedJQ.instance, "go(false, \"https://www.google.com\")", { window: win, document: mockedDoc.instance } )).toEqual({ handled: true, stop: false});
      expect(mockedJQ.getCalls()).toEqual(""); // Should not call JQuery
      expect(win.location.href).toEqual("https://www.google.com");
    });

    it("should go to a relative url.", function() {
      expect(go.handle(mockedJQ.instance, "go(false, \"/relativeLocation\")", { window: win, document: mockedDoc.instance } )).toEqual({ handled: true, stop: false});
      expect(mockedJQ.getCalls()).toEqual(""); // Should not call JQuery
      expect(win.location.href).toEqual("/relativeLocation");
    });

    it("should go to a templated url while getting data from elements.", function() {
      expect(go.handle(mockedJQ.instance, "go(false, \"/relativeLocation/${0}/${1}/${2}?query=${3}\", el(\"element0\"), el(\"element1\", \"attribute1\"), el(\"element2\", /ELEMENT/i), el(\"element3\", \"attribute2\", /VALUE TO COPY/))", { window: win, document: mockedDoc.instance })).toEqual({ handled: true, stop: false});
      expect(mockedJQ.getCalls()).toEqual("find(element0);first();html();find(element1);first();attr(attribute1);find(element2);first();html();find(element3);first();attr(attribute2);");
      expect(win.location.href).toEqual("/relativeLocation/ELEMENT%20CONTENTS%20TO%20COPY/ATTRIBUTE%20VALUE%20TO%20COPY/ELEMENT?query=VALUE%20TO%20COPY");
    });

    it("should go to a templated url while getting data from the current url.", function() {
      expect(go.handle(mockedJQ.instance, "go(false, \"${0}&test=${1}\", url(), url(/ONE DAY/i))", { window: win, document: mockedDoc.instance })).toEqual({ handled: true, stop: false});
      expect(mockedJQ.getCalls()).toEqual(""); // Should not call JQuery
      expect(win.location.href).toEqual("/foo/bar?query=ONE%20DAY%20AS%20A%20LION&test=ONE%20DAY");
    });

    it("should go to a templated url while getting data from text the user has selected.", function() {
      expect(go.handle(mockedJQ.instance, "go(false, \"/foo/bar?query=${0}&test=${1}\", selected(), selected(/ONE HUNDRED/i))", { window: win, document: mockedDoc.instance })).toEqual({ handled: true, stop: false});
      expect(mockedJQ.getCalls()).toEqual(""); // Should not call JQuery
      expect(win.location.href).toEqual("/foo/bar?query=ONE%20HUNDRED%20YEARS%20AS%20A%20SHEEP&test=ONE%20HUNDRED");
    });

    it("should replace a template position signal with empty when no value available.", function() {
      expect(go.handle(mockedJQ.instance, "go(false, \"/foo/bar?query=${0}\", selected(/ONE MILLION/))", { window: win, document: mockedDoc.instance })).toEqual({ handled: true, stop: false});
      expect(mockedJQ.getCalls()).toEqual(""); // Should not call JQuery
      expect(win.location.href).toEqual("/foo/bar?query=");
    });
  });
});
