/*global define, describe, require, beforeEach, it, expect */
define(["selectedContentRetriever", "test/lib/mocked-jq", "test/lib/mocked-window"], function(retriever, mockedJQ, mockedWindow) {
  "use strict";

  describe("User Selected Text Content Retriever", function () {
    beforeEach(function () {
      var win = mockedWindow.instance;
      win.selection = "IT IS BETTER TO LIVE";
      retriever.setWindow(win);
    });

    it("should get all content from selected text without regex.", function () {
      expect(retriever.getContent(mockedJQ.instance, "selected")).toEqual({match: true, content: "IT IS BETTER TO LIVE"});
    });

    it("should get all content from selected text without regex.", function () {
      expect(retriever.getContent(mockedJQ.instance, "selected()")).toEqual({match: true, content: "IT IS BETTER TO LIVE"});
    });

    it("should get content from the selected text with a regex.", function () {
      expect(retriever.getContent(mockedJQ.instance, "selected(/IS BETTER/i)")).toEqual({match: true, content: "IS BETTER"});
    });

    it("should not match a non-selected request.", function () {
      expect(retriever.getContent(mockedJQ.instance, "el(\"test\")")).toEqual({match: false});
    });

    it("should not get content from selected text with a regex that doesn't match.", function () {
      expect(retriever.getContent(mockedJQ.instance, "selected(/foo bar/i)")).toEqual({match: true, content: null});
    });
  });
});
