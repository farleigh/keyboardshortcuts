/*global define, describe, require, beforeEach, it, expect */
define(["elementContentRetriever", "test/lib/mocked-jq", "test/lib/mocked-doc"], function(retriever, mockedJQ, mockedDoc) {
  "use strict";
  describe("Element Content Retriever", function () {
    it("should get content from an element (old style with quotes).", function () {
        expect(retriever.getContent(mockedJQ.instance, "\"#myElement\"", { document: mockedDoc.instance })).toEqual({match: true, content: "ELEMENT CONTENTS TO COPY"});
        expect(mockedJQ.getCalls()).toEqual("find(#myElement);html();");
    });

    it("should get content from an element and attribute (old style with quotes).", function () {
        expect(retriever.getContent(mockedJQ.instance, "\"#myElement\", \"myAttribute\"", { document: mockedDoc.instance })).toEqual({match: true, content: "ATTRIBUTE VALUE TO COPY"});
        expect(mockedJQ.getCalls()).toEqual("find(#myElement);attr(myAttribute);");
    });

    it("should get content from an element (new el function style).", function () {
        expect(retriever.getContent(mockedJQ.instance, "el(\"#myElement\")", { document: mockedDoc.instance })).toEqual({match: true, content: "ELEMENT CONTENTS TO COPY"});
        expect(mockedJQ.getCalls()).toEqual("find(#myElement);html();");
    });

    it("should get content from an element and attribute (new el function style).", function () {
        expect(retriever.getContent(mockedJQ.instance, "el(\"#myElement\", \"myAttribute\")", { document: mockedDoc.instance })).toEqual({match: true, content: "ATTRIBUTE VALUE TO COPY"});
        expect(mockedJQ.getCalls()).toEqual("find(#myElement);attr(myAttribute);");
    });

    it("should get content from an element and regex (new el function style).", function () {
        expect(retriever.getContent(mockedJQ.instance, "el(\"#myElement\", /CONTENTS/i)", { document: mockedDoc.instance })).toEqual({match: true, content: "CONTENTS"});
        expect(mockedJQ.getCalls()).toEqual("find(#myElement);html();");
    });

    it("should get content from an element attribute, and regex (new el function style).", function () {
        expect(retriever.getContent(mockedJQ.instance, "el(\"#myElement\", \"myAttribute\", /VALUE/i)", { document: mockedDoc.instance })).toEqual({match: true, content: "VALUE"});
        expect(mockedJQ.getCalls()).toEqual("find(#myElement);attr(myAttribute);");
    });

    it("should not match a non-el request.", function () {
        expect(retriever.getContent(mockedJQ.instance, "url(\"test\")", { document: mockedDoc.instance })).toEqual({match: false});
    });

    it("should not get content from an element attribute, and regex (new el function style).", function () {
        expect(retriever.getContent(mockedJQ.instance, "el(\"#myElement\", \"myAttribute\", /ASDFASFS/i)", { document: mockedDoc.instance })).toEqual({match: true, content: ''});
        expect(mockedJQ.getCalls()).toEqual("find(#myElement);attr(myAttribute);");
    });
  });
});
