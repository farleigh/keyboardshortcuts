/*global chrome */
define("exportShortcuts", function exportShortcuts () {
  "use strict";

  // A way to export text content to a file in a chrome extension.
  function downloadContentAsFile(filename, contentDisposition, content) {
    var blob = new Blob([ content ], {type : contentDisposition});
    chrome.downloads.download({
      url: window.URL.createObjectURL(blob),
      filename: filename,
      saveAs: true
    });
  }

  function execute (shortcuts) {
    var content = JSON.stringify(shortcuts);
    downloadContentAsFile("keyboard_shortcuts.json", "application/json;charset=UTF-8", content);
  }

  return function exportShortcuts () {
    return {
      execute: execute
    };
  };
});
