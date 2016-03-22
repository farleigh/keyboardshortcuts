/*global define, describe, require, beforeEach, it, expect */
define("SelectedRetrieverSpec", ["selectedContentRetriever", "test/lib/mocked-jq", "test/lib/mocked-window", "test/lib/mocked-doc"], function(retriever, mockedJQ, mockedWindow, mockedDoc) {
  "use strict";

  describe("User Selected Text Content Retriever", function () {

    var win = mockedWindow.instance;

    beforeEach(function () {
      win.selection = "IT IS BETTER TO LIVE";
    });

    it("should get all content from selected text without regex.", function () {
      expect(retriever.getContent(mockedJQ.instance, "selected", { window: win, document: mockedDoc.instance })).toEqual({match: true, content: "IT IS BETTER TO LIVE"});
    });

    it("should get all content from selected text without regex.", function () {
      expect(retriever.getContent(mockedJQ.instance, "selected()", { window: win, document: mockedDoc.instance })).toEqual({match: true, content: "IT IS BETTER TO LIVE"});
    });

    it("should get content from the selected text with a regex.", function () {
      expect(retriever.getContent(mockedJQ.instance, "selected(/IS BETTER/i)", { window: win, document: mockedDoc.instance })).toEqual({match: true, content: "IS BETTER"});
    });

    it("should not match a non-selected request.", function () {
      expect(retriever.getContent(mockedJQ.instance, "el(\"test\")", { window: win, document: mockedDoc.instance })).toEqual({match: false});
    });

    it("should not get content from selected text with a regex that doesn't match.", function () {
      expect(retriever.getContent(mockedJQ.instance, "selected(/foo bar/i)", { window: win, document: mockedDoc.instance })).toEqual({match: true, content: null});
    });
  });
});
