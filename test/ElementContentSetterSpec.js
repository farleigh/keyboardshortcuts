/*global define, describe, require, it, expect */
define(["elementContentSetter", "test/lib/mocked-jq"], function(setter, mockedJQ) {
  "use strict";
  describe("Element Content Setter", function () {
    it("should set content to an element innerHTML.", function () {
        setter.setContent(mockedJQ.instance, "el(\"#myElement\")", "content");
        expect(mockedJQ.getCalls()).toEqual("first();html(content);");
    });

    it("should set content to an element attribute.", function () {
        setter.setContent(mockedJQ.instance, "el(\"#myElement\", \"attributeName\")", "content");
        expect(mockedJQ.getCalls()).toEqual("first();attr(attributeName, content);");
    });

    it("should set content to an element data attribute.", function () {
        setter.setContent(mockedJQ.instance, "el(\"#myElement\", \"data-attributeName\")", "content");
        expect(mockedJQ.getCalls()).toEqual("first();data(attributeName, content);");
    });

    it("should set content with a regular expression - but ignore the regular expression (for now).", function () {
        setter.setContent(mockedJQ.instance, "el(\"#myElement\", \"data-attributeName\", /[^1]*/)", "content");
        expect(mockedJQ.getCalls()).toEqual("first();data(attributeName, content);");
    });
  });
});
