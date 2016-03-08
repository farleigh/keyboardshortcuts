/*global define, RegExp*/
define("elementContentParser", function() {
  // Element expression format: el("element", "attribute", /regex/flags). Will also match "element", "attribute" for backwards compatibility.
  // Also matches el("element"), el("element", "attribute"), or el("element", /regex/flags).
  var elRegex = /^\s*el\(\s*"([^"]*)"(?:\s*,\s*"([^"]*)"\s*)?(?:\s*,\s*\/(.*)\/(.*)\s*)?\)\s*$/i;
  var oldElRegex = /^\s*"([^"]*)"(?:\s*,\s*"([^"]*)"\s*)?\s*$/i;

  // Get an item if it is available in the matches array. Otherwise return undefined.
  function getItemSafely (matches, position) {
    return matches && matches.length > position ? matches[position] : undefined;
  }

  // Build a regular expression. If no regular expression is provided then match everything.
  function buildRegex (regex, flags) {
    if(!regex) {
      // match everything on default
      return new RegExp(".*");
    }
    if(flags) {
      return new RegExp(regex, flags);
    }
    return new RegExp(regex);
  }

  function parse(query) {
    var matches, elementQuery, attributeName, regex, flags;
    matches = elRegex.exec(query);
    if(!matches) {
      matches = oldElRegex.exec(query);
      if(!matches) {
        return { match: false };
      }
    }
    elementQuery = getItemSafely(matches, 1);
    attributeName = getItemSafely(matches, 2);
    regex = getItemSafely(matches, 3);
    flags = getItemSafely(matches, 4);

    return {
      match: true,
      elementQuery: elementQuery,
      attributeName: attributeName,
      regex: buildRegex(regex, flags)
    };
  }

  return {
    parse: parse
  };
});
