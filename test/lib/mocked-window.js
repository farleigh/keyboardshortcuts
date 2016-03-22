// Mock the url strategy - we don't really want to test it.
define("mocked-window", function(result) {
  "use strict";

  var mockedWindow = {
    location: {
      href: ""
    },
    selection: "",
    focus: false,
    open: function (url, target) {
      this.location.href = url;
      this.target = target;
      return {
        focus: function() {
          this.focus = true;
        }
      };
    },
    getSelection: function () {
      return this.selection;
    }
  };

  // Return the mocked instance as instance
  return {
    instance: mockedWindow
  };
});
