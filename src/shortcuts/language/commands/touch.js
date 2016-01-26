/*global define */
define("touch", ["triggerEvent", "result"], function (trigger, result) {
    "use strict";

    var regex = /^touch\s*\(\s*(?:")([^"]+)(?:")\s*\)$/i;

    // Perform the left click operation (click). Do a blur on the focused
    // element before the left click is performed (but after the element is
    // found).
    function touch (jq, query) {
        return trigger.execute(jq, query, "touchStart");
    }

    function handleTouch (jq, statement) {
        var matches = regex.exec(statement);
        if(!matches) {
          return result.NOT_HANDLED;
        }
        var success = touch(jq, matches[1]);
        return success ? result.HANDLED : result.NOT_HANDLED;
    }

    function usage () {
        return 'Usage: touch("query"); Touch element that matches query. If more than one element matches query then uses the first.';
    }

    return {
        handle: handleTouch,
        execute: touch,
        toString: usage
    };
});
