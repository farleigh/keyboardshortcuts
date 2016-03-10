/*global chrome */
define("extensionInfo", function extensionInfo () {
  "use strict";
  function getExtensionVersion () {
    if(chrome && chrome.runtime && chrome.runtime.getManifest()) {
      return chrome.runtime.getManifest().version;
    }
    return "unknown";
  }

  return function extensionInfo () {
    return {
      getVersion: getExtensionVersion
    };
  };
});
