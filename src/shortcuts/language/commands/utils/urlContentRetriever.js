define("urlContentRetriever", function() {

  // Url expression format: url(/regex/flags), or url, or url()
  var urlRegex = /^\s*url(?:\s*\((?:\s*\/(.*)\/(.*))?\s*\))?\s*$/i;

  var currWin = window;

  function setWindow(win) {
    currWin = win;
  }

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
  function getContent (jq, query) {
    var matches, regexp, value;
    matches = urlRegex.exec(query);
    if(!matches) {
      return { match: false };
    }
    if(!currWin || !currWin.location || !currWin.location.href) {
      return { match: true, content: "" };
    }
    regexp = buildRegex( getItemSafely(matches, 1), getItemSafely(matches, 2));
    value = decodeURI(currWin.location.href).match(regexp);
    if(value && value.length) {
      value = value[0];
    }
    return { match: true, content: value };
  }

  return {
      getContent: getContent,
      setWindow: setWindow
  };
});
