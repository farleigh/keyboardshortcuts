/*global define, RegExp*/
define("elementContentRetriever", function() {

  // Element expression format: el("element", "attribute", /regex/flags). Will also match "element", "attribute" for backwards compatibility.
  // Also matches el("element"), el("element", "attribute"), or el("element", /regex/flags).
  var elRegex = /^\s*el\(\s*"([^"]*)"(?:\s*,\s*"([^"]*)"\s*)?(?:\s*,\s*\/(.*)\/(.*)\s*)?\)\s*$/i;
  var oldElRegex = /^\s*"([^"]*)"(?:\s*,\s*"([^"]*)"\s*)?\s*$/i;

  // Get the first element that matches query
  function getFirstMatchingElement (jq, query) {
    var elements = jq(query);
    if (elements && elements.length) {
      return elements.first();
    }
    return null;
  }

  // Get value from attribute of element
  function getValueFromAttribute(element, attributeName) {
    var dataName;
    if (attributeName.indexOf("data-") > -1) {
       dataName = attributeName.substring(attributeName.indexOf("data-") + 5);
       return element.data(dataName);
    } else {
       return element.attr(attributeName);
    }
  }

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

  function getValue(element, attributeName) {
    if (attributeName && typeof attributeName != "undefined") {
       return getValueFromAttribute(element, attributeName);
    } else {
      return element.html();
    }
  }

  // Get content from an attribute if attribute name is specified, otherwise
  // get content from innerHTML.
  function getContent (jq, query) {
    var matches, elementQuery, attributeName, regex, flags, element, value;
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
    element = getFirstMatchingElement(jq, elementQuery);
    if(!element) {
      return { match: true, content: "" };
    }
    value = getValue(element, attributeName);
    if(!value) {
      return { match: true, content: "" };
    }
    value = value.match(buildRegex(regex, flags));
    if(value && value.length) {
      value = value[0];
    }
    return { match: true, content: value };
  }

  return {
      getContent: getContent
  };
});
