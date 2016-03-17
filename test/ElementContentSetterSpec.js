/*global define, describe, require, it, expect */
define(["elementContentSetter", "test/lib/mocked-jq", "test/lib/mocked-doc"], function(setter, mockedJQ, mockedDoc) {
  "use strict";
  describe("Element Content Setter", function () {
    it("should set content to an element innerHTML.", function () {
      setter.setContent(mockedJQ.instance, "el(\"#myElement\")", "content", { document: mockedDoc.instance });
      expect(mockedJQ.getCalls()).toEqual("find(#myElement);first();html(content);");
    });

    it("should set content to an element attribute.", function () {
      setter.setContent(mockedJQ.instance, "el(\"#myElement\", \"attributeName\")", "content", { document: mockedDoc.instance });
      expect(mockedJQ.getCalls()).toEqual("find(#myElement);first();attr(attributeName, content);");
    });

    it("should set content to an element data attribute.", function () {
      setter.setContent(mockedJQ.instance, "el(\"#myElement\", \"data-attributeName\")", "content", { document: mockedDoc.instance });
      expect(mockedJQ.getCalls()).toEqual("find(#myElement);first();data(attributeName, content);");
    });

    it("should set content with a regular expression - but ignore the regular expression (for now).", function () {
      setter.setContent(mockedJQ.instance, "el(\"#myElement\", \"data-attributeName\", /[^1]*/)", "content", { document: mockedDoc.instance });
      expect(mockedJQ.getCalls()).toEqual("find(#myElement);first();data(attributeName, content);");
    });
  });
});
