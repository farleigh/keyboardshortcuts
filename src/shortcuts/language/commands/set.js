/*global define */
// Perform a set operation (set) on the element specified by query value.
define("set", ["result", "contentRetriever", "elementContentSetter", "templatedTextStrategy"], function(result, retriever, setter, textStrategy) {
  "use strict";

  var regex = /^set\s*\(([^\)]*\))\s*,\s*"([^"]*)"(?:\s*,\s*(.*))?\s*\)$/i;
  var queryRegex = /[a-z]+\(.*?\)(?=(?:\s*,\s*)|)/gi;

  function setWindow(win) {
    retriever.setWindow(win);
  }

  // Get all values
  function getValues (jq, queries) {
    var i = 0, values = [], query;
    if(!queries) {
      return values;
    }
    for(; i < queries.length; i += 1) {
      query = queries[i];
      if(typeof query === "undefined") {
        continue;
      }
      values.push(retriever.getContent(jq, query));
    }
    return values;
  }

  function getItemSafely (matches, position) {
    return matches && matches.length > position ? matches[position] : "";
  }

  // Perform a set operation.
  function set (jq, query, value) {
    return setter.setContent(jq, query, value);
  }

  // Handle intepreting the set operation.
  function handleSet (jq, statement) {
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
    values = getValues(jq, queries);
    value = textStrategy.get(text, values);
    success = set(jq, targetQuery, value);
    return success ? result.HANDLED : result.NOT_HANDLED;
  }

  function usage () {
    return 'Usage: set(el("query", "attribute" /regex/flags), "templatedText", el("query", attribute", /regex/flags) | url(/regex/flags) | selected(/regex/flags)); Hides an element specified by query.  If more than one element matches query then uses the first.';
  }

  return {
    handle: handleSet,
    execute: set,
    toString: usage,
    setWindow: setWindow
  };
});
