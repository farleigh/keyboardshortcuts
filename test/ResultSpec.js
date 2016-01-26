/*global describe, require, beforeEach, it, expect */
define(["result"], function(result) {
  "use strict";

  describe("Result", function() {
    // Test buld method
    it("Should build a result with an error message", function() {
      var value = result.build(false, true, result.severities.error, "This is an error message");
      expect(value).toEqual({ handled: false, stop: true, message: { msg: "This is an error message", severity: result.severities.error}});
    });

    it("Should build a result with a warning message", function() {
      var value = result.build(true, false, result.severities.warning, "This is a warning message");
      expect(value).toEqual({ handled: true, stop: false, message: { msg: "This is a warning message", severity: result.severities.warning}});
    });

    it("Should build a result with a handled message", function() {
      var value = result.build(true);
      expect(value).toEqual({ handled: true, stop: false });
    });

    it("Should build a result with a non-handled message", function() {
      var value = result.build();
      expect(value).toEqual({ handled: false, stop: false });
    });
  });
});
