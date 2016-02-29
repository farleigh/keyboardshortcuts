/*global define */
// Perform a hover operation on element specified with query.
define("hover", ["result"], function(result) {
    "use strict";

    var regex = /^hover\s*\(\s*(?:")([^"]+)(?:")\s*\)$/i;

    // Perform a hover operation (hover).
    function hover(jq, query) {
        var value = jq(query);
        if (value && value.length > 0) {
            var first = value.first();
            first.trigger("mouseenter");
            return true;
        }
        return false;
    }

    function handleHover (jq, statement) {
        var matches = regex.exec(statement);
        if(!matches) {
          return result.NOT_HANDLED;
        }
        var success = hover(jq, matches[1]);
        return success ? result.HANDLED : result.NOT_HANDLED;
    }

    function usage () {
        return 'Usage: hover("query"); Enable hover over element that matches query. If more than one element matches query then uses the first.';
    }

    return {
        handle: handleHover,
        execute: hover,
        toString: usage
    };
});
