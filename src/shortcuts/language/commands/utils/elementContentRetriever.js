/*global define */
define("elementContentRetriever", ["elementContentParser", "elementRetriever"], function(parser, retriever) {

  // Get the first element that matches query
  function getElements (jq, query, context) {
    return retriever.getAllInDocument(jq, query, context);
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

  function getValue(element, attributeName) {
    if (attributeName && typeof attributeName != "undefined") {
       return getValueFromAttribute(element, attributeName);
    } else {
      return element.html();
    }
  }

  // Get content from an attribute if attribute name is specified, otherwise
  // get content from innerHTML.
  function getContent (jq, query, context) {
    var exprObj = parser.parse(query),
        elements,
        matchedValue;
    if(!exprObj.match) {
      return { match: false };
    }
    elements = getElements(jq, exprObj.elementQuery, context);
    if(!elements || !elements.length) {
      return { match: true, content: "" };
    }
    elements.each(function(element) {
      var value = getValue(jq(this), exprObj.attributeName);
      if(value === "") {
        return;
      }
      value = value.match(exprObj.regex);
      if(value && value.length) {
        value = value[0];
      }
      if(value !== "" && !matchedValue) {
        matchedValue = value;
      }
    });
    if(matchedValue) {
      return { match: true, content: matchedValue };
    }
    return { match: true, content: "" };
  }

  return {
      getContent: getContent
  };
});
