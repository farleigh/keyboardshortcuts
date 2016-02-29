define("contentHelper", function() {

  var attributeRegex = /^([^\{]*)(?:\{\s*)?([^\}]*)?(?:\}\s*)?$/i;

  function getValueFromAttribute(element, attributeName) {
    var dataName;
    if (attributeName.indexOf("data-") > -1) {
       dataName = attributeName.substring(attributeName.indexOf("data-") + 5);
       return element.data(dataName);
    } else {
       return element.attr(attributeName);
    }
  }

  function getFirstMatchingElement(jq, query) {
    var elements = jq(query);
    if (elements && elements.length) {
      return elements.first();
    }
    return null;
  }

  function getQueryFromMatches(matches) {
    return matches[1].trim();
  }

  function getAttributeNameFromMatches(matches) {
    return (matches.length > 2 && typeof matches[2] !== "undefined") ? matches[2].trim() : undefined;
  }

  // Get content from an attribute if attribute name is specified, otherwise
  // get content from innerHTML.
  function getContent (jq, query, attributeName) {
    var matches, element;
    if(!attributeName) {
      // Attempt to get attribute name from query.
      matches = attributeRegex.exec(query);
      if(matches && matches.length) {
        query = getQueryFromMatches(matches);
        attributeName = getAttributeNameFromMatches(matches);
      }
    }
    element = getFirstMatchingElement(jq, query);
    if(!element) {
      return "";
    }
    if (attributeName && typeof attributeName != "undefined") {
      return getValueFromAttribute(element, attributeName);
    } else {
      return element.html();
    }
  }

  return {
      getContent: getContent
  };
});
