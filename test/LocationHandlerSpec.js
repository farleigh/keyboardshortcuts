/*global define, describe, require, beforeEach, it, expect */
define(["locationHandler", "test/lib/mocked-location-strategy", "test/lib/mocked-window"], function(locationHandler, mockedLocationStrategy, mockedWindow) {
  "use strict";

  describe("Location Handler", function() {

    it("should change location in a new window.", function() {
      expect(locationHandler.change(false, mockedWindow.instance, mockedLocationStrategy.instance, "https://www.google.com")).toEqual(true);
      expect(mockedLocationStrategy.getCalls()).toEqual("getUrl(https://www.google.com, );");
      expect(mockedWindow.instance.location.href).toEqual("https://www.google.com/transformed");
    });

    it("should change location.", function() {
      expect(locationHandler.change(false, mockedWindow.instance, mockedLocationStrategy.instance, "https://www.google.com")).toEqual(true);
      expect(mockedLocationStrategy.getCalls()).toEqual("getUrl(https://www.google.com, );");
      expect(mockedWindow.instance.location.href).toEqual("https://www.google.com/transformed");
    });

    it("should go to a relative url.", function() {
      expect(locationHandler.change(false, mockedWindow.instance, mockedLocationStrategy.instance, "/mylocation")).toEqual(true);
      expect(mockedLocationStrategy.getCalls()).toEqual("getUrl(/mylocation, );");
      expect(mockedWindow.instance.location.href).toEqual("/mylocation/transformed");
    });

    it("should go to a templated url.", function() {
      expect(locationHandler.change(true, mockedWindow.instance, mockedLocationStrategy.instance, "/mylocation/${0}/${1}", ["parameter1", "parameter2"])).toEqual(true);
      expect(mockedLocationStrategy.getCalls()).toEqual("getUrl(/mylocation/${0}/${1}, { 0: parameter1, 1: parameter2,  });");
      expect(mockedWindow.instance.location.href).toEqual("/mylocation/$%7B0%7D/$%7B1%7D/transformed"); // Replacement does not happen in this test.
      expect(mockedWindow.instance.target).toEqual("_blank");
    });
  });
});
