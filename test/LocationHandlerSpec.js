/*global define, describe, require, beforeEach, it, expect */
define("LocationHandlerSpec", ["locationHandler", "test/lib/mocked-window"], function(locationHandler, mockedWindow) {
  "use strict";

  describe("Location Handler", function() {
    it("should change location.", function() {
      expect(locationHandler.change(false, mockedWindow.instance, "https://www.google.com/")).toEqual(true);
      expect(mockedWindow.instance.location.href).toEqual("https://www.google.com/");
    });

    it("should change location in a new window.", function() {
      expect(locationHandler.change(true, mockedWindow.instance, "https://www.google.com/")).toEqual(true);
      expect(mockedWindow.instance.location.href).toEqual("https://www.google.com/");
      expect(mockedWindow.instance.target).toEqual("_blank");
    });

    it("should go to a relative url.", function() {
      expect(locationHandler.change(false, mockedWindow.instance, "/mylocation")).toEqual(true);
      expect(mockedWindow.instance.location.href).toEqual("/mylocation");
    });
  });
});
