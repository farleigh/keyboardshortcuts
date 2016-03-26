/*global define, describe, require, beforeEach, it, expect */
define(["contentRetriever", "test/lib/mocked-jq", "test/lib/mocked-window", "test/lib/mocked-doc"], function(retriever, mockedJQ, mockedWindow, mockedDoc) {
  "use strict";
  describe("Content Retriever", function () {

    var win;

    beforeEach(function () {
      win = mockedWindow.instance;
      win.location.href = "/foo/bar?query=ONE%20DAY%20AS%20A%20LION";
      win.selection = "IT IS BETTER TO LIVE";
    });

    it("should get all content from selected text without regex.", function () {
      expect(retriever.getContent(mockedJQ.instance, "selected()", { window: win, document: mockedDoc.instance })).toEqual("IT IS BETTER TO LIVE");
    });

    it("should get all content from the url without regex.", function () {
      expect(retriever.getContent(mockedJQ.instance, "url", { window: win, document: mockedDoc.instance })).toEqual("/foo/bar?query=ONE DAY AS A LION");
    });

    it("should get content from an element (new el function style).", function () {
        expect(retriever.getContent(mockedJQ.instance, "el(\"#myElement\")", { window: win, document: mockedDoc.instance })).toEqual("ELEMENT CONTENTS TO COPY");
        expect(mockedJQ.getCalls()).toEqual("find(#myElement);html();");
    });

    it("should get content from an element (old style with quotes).", function () {
        expect(retriever.getContent(mockedJQ.instance, "\"#myElement\"", { window: win, document: mockedDoc.instance })).toEqual("ELEMENT CONTENTS TO COPY");
        expect(mockedJQ.getCalls()).toEqual("find(#myElement);html();");
    });

    it("should get not get content from a non-matching request.", function () {
      expect(retriever.getContent(mockedJQ.instance, "foo()", { window: win, document: mockedDoc.instance })).toEqual("");
    });

  });
});
