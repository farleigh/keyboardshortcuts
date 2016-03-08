/*global define, describe, require, beforeEach, it, expect */
define(["elementContentRetriever", "test/lib/mocked-jq"], function(retriever, mockedJQ) {
  "use strict";
  describe("Element Content Retriever", function () {
    it("should get content from an element (old style with quotes).", function () {
        expect(retriever.getContent(mockedJQ.instance, "\"#myElement\"")).toEqual({match: true, content: "ELEMENT CONTENTS TO COPY"});
        expect(mockedJQ.getCalls()).toEqual("first();html();");
    });

    it("should get content from an element and attribute (old style with quotes).", function () {
        expect(retriever.getContent(mockedJQ.instance, "\"#myElement\", \"myAttribute\"")).toEqual({match: true, content: "ATTRIBUTE VALUE TO COPY"});
        expect(mockedJQ.getCalls()).toEqual("first();attr(myAttribute);");
    });

    it("should get content from an element (new el function style).", function () {
        expect(retriever.getContent(mockedJQ.instance, "el(\"#myElement\")")).toEqual({match: true, content: "ELEMENT CONTENTS TO COPY"});
        expect(mockedJQ.getCalls()).toEqual("first();html();");
    });

    it("should get content from an element and attribute (new el function style).", function () {
        expect(retriever.getContent(mockedJQ.instance, "el(\"#myElement\", \"myAttribute\")")).toEqual({match: true, content: "ATTRIBUTE VALUE TO COPY"});
        expect(mockedJQ.getCalls()).toEqual("first();attr(myAttribute);");
    });

    it("should get content from an element and regex (new el function style).", function () {
        expect(retriever.getContent(mockedJQ.instance, "el(\"#myElement\", /CONTENTS/i)")).toEqual({match: true, content: "CONTENTS"});
        expect(mockedJQ.getCalls()).toEqual("first();html();");
    });

    it("should get content from an element attribute, and regex (new el function style).", function () {
        expect(retriever.getContent(mockedJQ.instance, "el(\"#myElement\", \"myAttribute\", /VALUE/i)")).toEqual({match: true, content: "VALUE"});
        expect(mockedJQ.getCalls()).toEqual("first();attr(myAttribute);");
    });

    it("should not match a non-el request.", function () {
        expect(retriever.getContent(mockedJQ.instance, "url(\"test\")")).toEqual({match: false});
    });

    it("should get not content from an element attribute, and regex (new el function style).", function () {
        expect(retriever.getContent(mockedJQ.instance, "el(\"#myElement\", \"myAttribute\", /ASDFASFS/i)")).toEqual({match: true, content: null});
        expect(mockedJQ.getCalls()).toEqual("first();attr(myAttribute);");
    });
  });
});
