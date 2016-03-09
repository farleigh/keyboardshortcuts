/*global chrome */
define("exportShortcuts", function storage() {
  "use strict";

  // A way to export text content to a file in a chrome extension.
  function downloadContentAsFile(filename, content) {
    var blob = new Blob([ content ], {type : "application/json;charset=UTF-8"});
    chrome.downloads.download({
      url: window.URL.createObjectURL(blob),
      filename: filename
    });
  }

  function execute (shortcuts) {
    var content = JSON.stringify(shortcuts);
    downloadContentAsFile("keyboard_shortcuts.json", content);
  }

  return {
    execute: execute
  };
});
