/*global define, describe, require, beforeEach, it, expect */
define(["contentRetriever", "test/lib/mocked-jq"], function(retriever, mockedJQ) {
  "use strict";
  describe("Content Retriever", function () {
    beforeEach(function () {
      var location = { href: "/foo/bar?query=ONE%20DAY%20AS%20A%20LION"};
      retriever.setLocation(location);
      var win = { getSelection: function () { return "IT IS BETTER TO LIVE"; } };
      retriever.setWindow(win);
    });

    it("should get all content from selected text without regex.", function () {
      expect(retriever.getContent(mockedJQ.instance, "selected()")).toEqual("IT IS BETTER TO LIVE");
    });

    it("should get all content from the url without regex.", function () {
      expect(retriever.getContent(mockedJQ.instance, "url")).toEqual("/foo/bar?query=ONE DAY AS A LION");
    });

    it("should get content from an element (new el function style).", function () {
        expect(retriever.getContent(mockedJQ.instance, "el(\"#myElement\")")).toEqual("ELEMENT CONTENTS TO COPY");
        expect(mockedJQ.getCalls()).toEqual("first();html();");
    });

    it("should get content from an element (old style with quotes).", function () {
        expect(retriever.getContent(mockedJQ.instance, "\"#myElement\"")).toEqual("ELEMENT CONTENTS TO COPY");
        expect(mockedJQ.getCalls()).toEqual("first();html();");
    });

    it("should get not get content from a non-matching request.", function () {
      expect(retriever.getContent(mockedJQ.instance, "foo()")).toEqual("");
    });

  });
});
