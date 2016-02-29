/*global describe, require, beforeEach, it, expect */
define(["templatedUrlStrategy", "test/lib/mocked-jq"], function (urlStrategy, mockedJQ) {
    "use strict";

    describe("GetUrl", function () {
        it("should return expected url with no values.", function () {
            expect(urlStrategy.getUrl("https://www.google.com")).toEqual("https://www.google.com");
        });

        it("Should return url with first value in array.", function () {
            expect(urlStrategy.getUrl("https://www.google.com/${0}", ["adwords"])).toEqual("https://www.google.com/adwords");
        });

        it("Should return url generated using values in object.", function () {
            expect(urlStrategy.getUrl("https://www.${google}.com/${adwords}", {adwords: "adwords", google: "google"})).toEqual("https://www.google.com/adwords");
        });

        it("Should empty string when no parameters.", function () {
            expect(urlStrategy.getUrl()).toEqual("");
        });

    });
});
