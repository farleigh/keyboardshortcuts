/*global describe, require, beforeEach, it, expect */
define(["go", "test/lib/mocked-jq"], function(go, mockedJQ) {
    "use strict";

    describe("Go command", function() {
        it("should go to a full url.", function() {
            var location = {};
            go.setLocation(location);
            expect(go.handle(mockedJQ.instance, "go(\"https://www.google.com\")")).toEqual({ handled: true, stop: false});
            expect(mockedJQ.getCalls()).toEqual("first();html();"); // Should not call JQuery
            expect(location.href).toEqual("https://www.google.com");
        });

        it("should go to a relative url.", function() {
          var location = {};
          go.setLocation(location);
          expect(go.handle(mockedJQ.instance, "go(\"/relativeLocation\")")).toEqual({ handled: true, stop: false});
          expect(mockedJQ.getCalls()).toEqual("first();html();"); // Should not call JQuery
          expect(location.href).toEqual("/relativeLocation");
        });

        it("should go to a templated url.", function() {
          var location = {};
          go.setLocation(location);
          expect(go.handle(mockedJQ.instance, "go(\"/relativeLocation/${0}/${1}\", \"parameter1\", \"parameter2{attribute1}\")")).toEqual({ handled: true, stop: false});
          expect(mockedJQ.getCalls()).toEqual("first();html();first();attr(attribute1);"); // Should not call JQuery
          expect(location.href).toEqual("/relativeLocation/ELEMENT CONTENTS TO COPY/ATTRIBUTE VALUE TO COPY");
        });
    });
});
