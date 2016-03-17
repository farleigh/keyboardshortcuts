/*global define, RegExp, window*/
define("selectedContentRetriever", function() {

  // Selected expression format: selected(/regex/flags), or selected, or selected()
  var selectedRegex = /^\s*selected(?:\s*\((?:\s*\/(.*)\/(.*))?\s*\))?\s*$/i;

  function getItemSafely (matches, position) {
    return matches && matches.length > position ? matches[position] : "";
  }

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

  function getValue(win) {
    var value = win && win.getSelection && typeof win.getSelection === "function" && win.getSelection();
    if(typeof value === "object") {
      value = value.toString();
    }
    return value;
  }

  // Attempt to get content from the URL of matching regex.
  function getContent (jq, query, context) {
    var matches, regexp, value, content;
    matches = selectedRegex.exec(query);
    if(!matches) {
      return { match: false };
    }
    value = getValue(context.window);
    if(!value) {
      return { match: true, content: "" };
    }
    regexp = buildRegex( getItemSafely(matches, 1), getItemSafely(matches, 2));
    content = value.match(regexp);
    if(content && content.length) {
      content = content[0];
    }
    return { match: true, content: content };
  }

  return {
      getContent: getContent
  };
});
