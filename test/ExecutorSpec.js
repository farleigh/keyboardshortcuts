/*global describe, require, beforeEach, it, expect, JSON */
define(["executor", "result", "test/lib/mocked-jq"], function (executor, result, mockedJQ) {
    "use strict";

    var handled, notHandled, handlers;

    // Create a constructor for a simple mock handler object.
    function MockHandler (returnResult) {
        var self = this instanceof MockHandler ? this : new MockHandler();
        self.calls = "";
        self.returnResult = returnResult;
    }

    // Add one method to the constructor's prototype
    MockHandler.prototype.handle = function (jq, statement, remainingStatements) {
        this.calls += "handle({ statement: \"" + statement + "\", result: " + JSON.stringify(this.returnResult) + " });";
        this.statement = statement;
        this.remainingStatements = remainingStatements;
        return this.returnResult;
    };

    describe("Executor", function () {
        it("should execute a single statement.", function () {
            var handled = new MockHandler(result.HANDLED);
            expect(executor.execute(mockedJQ.instance, { handled: handled }, ["handle(\"#myElement\")"])).toEqual(true);
            expect(handled.calls).toEqual("handle({ statement: \"handle(\"#myElement\")\", result: {\"handled\":true,\"stop\":false} });");
        });

        it("should execute multiple statements.", function () {
            var handled = new MockHandler(result.HANDLED);
            expect(executor.execute(mockedJQ.instance, { handled: handled }, ["handle1(\"#myElement\")", "handle2(\"#myElement2\")"])).toEqual(true);
            expect(handled.calls).toEqual("handle({ statement: \"handle1(\"#myElement\")\", result: {\"handled\":true,\"stop\":false} });handle({ statement: \"handle2(\"#myElement2\")\", result: {\"handled\":true,\"stop\":false} });");
        });

        it("should not execute a single statement with no handler.", function () {
            var notHandled = new MockHandler(result.NOT_HANDLED);
            expect(executor.execute(mockedJQ.instance, { notHandled: notHandled }, ["handle1(\"#myElement\")"])).toEqual(true);
            expect(notHandled.calls).toEqual("handle({ statement: \"handle1(\"#myElement\")\", result: {\"handled\":false,\"stop\":false} });");
        });
    });
});
