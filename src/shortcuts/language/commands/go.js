/*global define */
define("go", ["locationHandler", "templatedUrlStrategy", "contentHelper", "result"], function(locationHandler, urlStrategy, contentHelper, result) {
    "use strict";

    var regex = /^go\s*\(\s*"([^"]+)"((?:\s*,\s*"(?:[^"]+)")*)\s*\)$/i;
    var queryRegex = /"\s*,\s*"/i;
    var startRegex = /^,\s*"/i;
    var endRegex = /"$/i;
    var location = window.location;

    function setLocation(loc) {
      location = loc;
    }

    // Get all values
    function getValues(jq, queries) {
      var i = 0, values = [], query;
      if(!queries) {
        return values;
      }
      for(; i < queries.length; i += 1) {
        query = queries[i];
        if(typeof query === "undefined") {
          continue;
        }
        values.push(contentHelper.getContent(jq, query));
      }
      return values;
    }

    // Perform the goToUrl operation (go). Force the current page to go do a different URL.
    function go (jq, url, queries) {
        var values = [];
        // get values from strategies
        if(queries && queries.length) {
          values = getValues(jq, queries);
        }
        return locationHandler.change(location, urlStrategy, url, values);
    }

    function handleGo (jq, statement) {
        var success = false, matches = regex.exec(statement), queries;
        if(!matches) {
          return result.NOT_HANDLED;
        }

        if(matches.length < 3) {
          success = go(jq, matches[1]);
        } else if(matches.length > 1) {
          queries = matches[2];
          queries = queries.replace(startRegex, "");
          queries = queries.replace(endRegex, "");
          success = go(jq, matches[1], queries.split(queryRegex));
        }
        return success ? result.HANDLED : result.NOT_HANDLED;
    }

    function usage () {
        return 'Usage: go("templated-url", "query1", "query2",...,"queryN"); Go to a url that is generated by inserting the result of query 1..N.';
    }

    return {
        handle: handleGo,
        execute: go,
        toString: usage,
        setLocation: setLocation /* Allow for replacing window.location for testing */
    };
});
