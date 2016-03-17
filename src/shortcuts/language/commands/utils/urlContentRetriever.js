define("urlContentRetriever", function() {

  // Url expression format: url(/regex/flags), or url, or url()
  var urlRegex = /^\s*url(?:\s*\((?:\s*\/(.*)\/(.*))?\s*\))?\s*$/i;

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

  // Attempt to get content from the URL of matching regex.
  function getContent (jq, query, context) {
    var matches, regexp, value;
    matches = urlRegex.exec(query);
    if(!matches) {
      return { match: false };
    }
    var win = context && context.window;
    if(!win || !win.location || !win.location.href) {
      return { match: true, content: "" };
    }
    regexp = buildRegex( getItemSafely(matches, 1), getItemSafely(matches, 2));
    value = decodeURI(win.location.href).match(regexp);
    if(value && value.length) {
      value = value[0];
    }
    return { match: true, content: value };
  }

  return {
      getContent: getContent
  };
});
