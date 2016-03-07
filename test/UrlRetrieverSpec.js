/*global define, describe, require, beforeEach, it, expect */
define(["urlContentRetriever", "test/lib/mocked-jq", "test/lib/mocked-window"], function(retriever, mockedJQ, mockedWindow) {
  "use strict";

  describe("URL Content Retriever", function () {

    beforeEach(function () {
      var win = mockedWindow.instance;
      win.location.href = "/foo/bar?query=ONE%20DAY%20AS%20A%20LION";
      retriever.setWindow(win);
    });

    it("should get all content from the url without regex.", function () {
      expect(retriever.getContent(mockedJQ.instance, "url")).toEqual({match: true, content: "/foo/bar?query=ONE DAY AS A LION"});
    });

    it("should get all content from the url without regex.", function () {
        expect(retriever.getContent(mockedJQ.instance, "url()")).toEqual({match: true, content: "/foo/bar?query=ONE DAY AS A LION"});
    });

    it("should get content from the url with a regex.", function () {
        expect(retriever.getContent(mockedJQ.instance, "url(/one day/i)")).toEqual({match: true, content: "ONE DAY"});
    });

    it("should not match a non-url request.", function () {
        expect(retriever.getContent(mockedJQ.instance, "el(\"test\")")).toEqual({match: false});
    });

    it("should not get content from the url with a regex that doesn't match.", function () {
        expect(retriever.getContent(mockedJQ.instance, "url(/foo bar/i)")).toEqual({match: true, content: null});
    });
  });
});
