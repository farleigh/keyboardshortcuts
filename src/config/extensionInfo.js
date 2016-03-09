/*global chrome */
define("extensionInfo", function storage() {
  "use strict";

  function getExtensionVersion () {
    if(chrome && chrome.runtime && chrome.runtime.getManifest()) {
      return chrome.runtime.getManifest().version;
    }
    return "unknown";
  }

  return {
    getVersion: getExtensionVersion
  };
});
