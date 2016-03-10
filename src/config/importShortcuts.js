/*global chrome */
define("importShortcuts", function importShortcuts () {
  "use strict";

  function retrieve ($http, url, load, error) {
    $http({
      method: 'GET',
      url: url
    }).then(function success (response) {
      if(load && response && response.data) {
        load(response.data);
      }
    }).catch(function(response) {
      error("Unable to load anything from this URL: Status = {Status: " + response.status + ", Text: " + response.statusText + " }");
    });
  }

  return function importShortcuts ($http) {
    return {
      execute: function loadShortcuts (url, load, error) {
        if(!url) {
          error("Must specify a valid URL.");
          return;
        }
        retrieve($http, url, load, error);
      }
    };
  };
});
