/*global chrome */
define("storage", function storage () {
  "use strict";
  var storageArea;
  try {
    storageArea = chrome.storage.sync;
  } catch (err) {
    console.log("KeyboardShortcuts > could not initiate chrome storage: " + err);
  }
  return {
      get: function get (key, callback) {
        storageArea.get(key, callback);
      },
      set: function set (key, value) {
        var obj = {};
        obj[key] = value;
        storageArea.set(obj);
      },
      extractValue: function (key, obj) {
        return obj[key];
      }
  };
});
