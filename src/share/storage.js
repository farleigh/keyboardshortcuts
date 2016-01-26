/*global chrome */
define("storage", function storage() {
    "use strict";
    var key = "configuration";
    var storageArea = null;
    try {
        storageArea = chrome.storage.sync;
    } catch (err) {
        console.log("KeyboardShortcuts > could not initiate chrome storage: " + err);
    }
    return {
        get : function(callback) {
            storageArea.get(key, callback);
        },
        set : function(value) {
            var obj = {};
            obj[key] = value;
            storageArea.set(obj);
        },
        extractValue : function(obj) {
            return obj[key];
        }
    };
});
