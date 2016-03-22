/*global define */
// Perform a set operation (set) on the element specified by query value.
define("set", ["result", "contentRetriever", "elementContentSetter", "templatedTextStrategy"], function(result, retriever, setter, textStrategy) {
  "use strict";

  var regex = /^set\s*\(([^\)]*\))\s*,\s*"([^"]*)"(?:\s*,\s*(.*))?\s*\)$/i;
  var queryRegex = /[a-z]+\(.*?\)(?=(?:\s*,\s*)|)/gi;

  // Get all values
  function getValues (jq, queries, context) {
    var i = 0, values = [], query;
    if(!queries) {
      return values;
    }
    for(; i < queries.length; i += 1) {
      query = queries[i];
      if(typeof query === "undefined") {
        continue;
      }
      values.push(retriever.getContent(jq, query, context));
    }
    return values;
  }

  function getItemSafely (matches, position) {
    return matches && matches.length > position ? matches[position] : "";
  }

  // Perform a set operation.
  function set (jq, query, value, context) {
    return setter.setContent(jq, query, value, context);
  }

  function canHandle (statement, context) {
    return regex.test(statement);
  }

  // Handle intepreting the set operation.
  function handleSet (jq, statement, context) {
    var matches = regex.exec(statement),
        targetQuery,
        queries,
        text,
        value,
        values,
        success;
    if(!matches) {
      return result.NOT_HANDLED;
    }
    targetQuery = getItemSafely(matches, 1);
    text = getItemSafely(matches, 2);
    queries = getItemSafely(matches, 3);
    if(queries) {
      queries = queries.match(queryRegex);
    }
    values = getValues(jq, queries, context);
    value = textStrategy.get(text, values);
    success = set(jq, targetQuery, value, context);
    return success ? result.HANDLED : result.NOT_HANDLED;
  }

  function usage () {
    return 'Usage: set(el("query", "attribute"), "templatedText", el("query", attribute", /regex/flags) | url(/regex/flags) | selected(/regex/flags)); Hides an element specified by query.  If more than one element matches query then uses the first.';
  }

  return {
    handle: handleSet,
    canHandle: canHandle,
    execute: set,
    toString: usage
  };
});
