/*global define*/
// Define result values
define("result", function() {

    // Build a result object
    // Parameters:
    //    handled: boolean - indicates whether command has handled the request
    //    stop: boolean - indicates whether execution should stop
    //    severity: string - provides a severity level.  Severity levels are defined in result.severities
    //    msg: string - provides a user friendly message
    function build (handled, stop, severity, msg) {
        var obj;
        handled = handled || false;
        stop = stop || false;
        severity = severity || "";
        msg = msg || "";
        obj = { handled: handled, stop: stop };
        if(severity && msg) {
            obj.message = { msg: msg, severity: severity };
        }
        return obj;
    }

    return {
        severities: { ok: "", warning: "warning", error: "error" },
        build: build,
        HANDLED: build(true),
        NOT_HANDLED: build(false)
    };
});
