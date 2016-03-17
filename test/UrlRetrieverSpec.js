/*global define, describe, require, beforeEach, it, expect */
define(["urlContentRetriever", "test/lib/mocked-jq", "test/lib/mocked-window"], function(retriever, mockedJQ, mockedWindow) {
  "use strict";

  describe("URL Content Retriever", function () {

    var win = mockedWindow.instance;

    beforeEach(function () {
      win.location.href = "/foo/bar?query=ONE%20DAY%20AS%20A%20LION";
    });

    it("should get all content from the url without regex.", function () {
      expect(retriever.getContent(mockedJQ.instance, "url", { window: win })).toEqual({match: true, content: "/foo/bar?query=ONE DAY AS A LION"});
    });

    it("should get all content from the url without regex.", function () {
        expect(retriever.getContent(mockedJQ.instance, "url()", { window: win })).toEqual({match: true, content: "/foo/bar?query=ONE DAY AS A LION"});
    });

    it("should get content from the url with a regex.", function () {
        expect(retriever.getContent(mockedJQ.instance, "url(/one day/i)", { window: win })).toEqual({match: true, content: "ONE DAY"});
    });

    it("should not match a non-url request.", function () {
        expect(retriever.getContent(mockedJQ.instance, "el(\"test\")", { window: win })).toEqual({match: false});
    });

    it("should not get content from the url with a regex that doesn't match.", function () {
        expect(retriever.getContent(mockedJQ.instance, "url(/foo bar/i)", { window: win })).toEqual({match: true, content: null});
    });
  });
});
