/*global define, describe, require, it, expect */
define("ElementRetrieverSpec", ["elementRetriever", "test/lib/mocked-jq", "test/lib/mocked-doc"], function(retriever, mockedJQ, mockedDoc) {
  "use strict";

  describe("Element Retriever", function () {

    it("should get element using a query.", function () {
        expect(retriever.get(mockedJQ.instance, "#myElement", { document: mockedDoc.instance })).not.toBeNull();
        expect(mockedJQ.getCalls()).toEqual("find(#myElement);first();");
    });

    it("should get element at current position.", function () {
        expect(retriever.get(mockedJQ.instance,
                             "",
                             { document: mockedDoc.instance,
                               position: { x: 100, y: 100 } })).not.toBeNull();
        expect(mockedJQ.getCalls()).toEqual("first();");
    });

    it("should get element at current cursor position.", function () {
        expect(retriever.get(mockedJQ.instance,
                            "current-element",
                            { document: mockedDoc.instance,
                              position: { x: 100, y: 100 } })).not.toBeNull();
        expect(mockedJQ.getCalls()).toEqual("first();");
    });

  });
});
