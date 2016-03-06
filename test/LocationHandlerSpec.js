/*global define, describe, require, beforeEach, it, expect */
define(["locationHandler", "test/lib/mocked-location-strategy"], function(locationHandler, locationStrategy) {
    "use strict";

    describe("Location Handler", function() {
        it("should change location.", function() {
            var mockedLocation = {};
            expect(locationHandler.change(mockedLocation, locationStrategy.instance, "https://www.google.com")).toEqual(true);
            expect(locationStrategy.getCalls()).toEqual("getUrl(https://www.google.com, );");
            expect(mockedLocation.href).toEqual("https://www.google.com/transformed");
        });

        it("should go to a relative url.", function() {
          var mockedLocation = {};
          expect(locationHandler.change(mockedLocation, locationStrategy.instance, "/mylocation")).toEqual(true);
          expect(locationStrategy.getCalls()).toEqual("getUrl(/mylocation, );");
          expect(mockedLocation.href).toEqual("/mylocation/transformed");
        });

        it("should go to a templated url.", function() {
          var mockedLocation = {};
          expect(locationHandler.change(mockedLocation, locationStrategy.instance, "/mylocation/${0}/${1}", ["parameter1", "parameter2"])).toEqual(true);
          expect(locationStrategy.getCalls()).toEqual("getUrl(/mylocation/${0}/${1}, { 0: parameter1, 1: parameter2,  });");
          expect(mockedLocation.href).toEqual("/mylocation/$%7B0%7D/$%7B1%7D/transformed"); // Replacement does not happen in this test.
        });
    });
});
