/*global define */
define("elementContentRetriever", ["elementContentParser", "elementRetriever"], function(parser, retriever) {

  // Get the first element that matches query
  function getFirstMatchingElement (jq, query, context) {
    return retriever.get(jq, query, context);
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
        element, value;
    if(!exprObj.match) {
      return { match: false };
    }
    element = getFirstMatchingElement(jq, exprObj.elementQuery, context);
    if(!element) {
      return { match: true, content: "" };
    }
    value = getValue(element, exprObj.attributeName);
    if(!value) {
      return { match: true, content: "" };
    }
    value = value.match(exprObj.regex);
    if(value && value.length) {
      value = value[0];
    }
    return { match: true, content: value };
  }

  return {
      getContent: getContent
  };
});
