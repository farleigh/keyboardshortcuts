define("ElementContentParserSpec", ["elementContentParser"], function(parser) {
  "use strict";
  describe("Element Content Parser", function () {
    it("parses element query in quotes", function () {
        expect(parser.parse("\"#myElement\"")).toEqual({match: true, elementQuery: "#myElement", attributeName: undefined, regex:/.*/});
    });

    it("parses element query and attribute name in quotes", function () {
        expect(parser.parse("\"#myElement\", \"attributeName\"")).toEqual({match: true, elementQuery: "#myElement", attributeName: "attributeName", regex:/.*/});
    });

    it("parses element query in element expression", function () {
        expect(parser.parse("el(\"#myElement\")")).toEqual({match: true, elementQuery: "#myElement", attributeName: undefined, regex:/.*/});
    });

    it("parses element query and attribute name in element expression", function () {
        expect(parser.parse("el(\"#myElement\", \"attributeName\")")).toEqual({match: true, elementQuery: "#myElement", attributeName: "attributeName", regex:/.*/});
    });

    it("parses element query and attribute name and regular expression in element expression", function () {
        expect(parser.parse("el(\"#myElement\", \"attributeName\", /^[^a]+/i)")).toEqual({match: true, elementQuery: "#myElement", attributeName: "attributeName", regex:/^[^a]+/i});
    });

    it("parses element query and regular expression in element expression", function () {
        expect(parser.parse("el(\"#myElement\", /^[^a]+/i)")).toEqual({match: true, elementQuery: "#myElement", attributeName: undefined, regex:/^[^a]+/i});
    });
  });
});
