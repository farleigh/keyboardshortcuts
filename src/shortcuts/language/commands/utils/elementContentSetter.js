/*global define, RegExp*/
define("elementContentSetter", ["elementContentParser"], function(parser) {

  // Get the first element that matches query
  function getFirstMatchingElement (jq, query) {
    var elements = jq(query);
    if (elements && elements.length) {
      return elements.first();
    }
    return null;
  }

  // Get value from attribute of element
  function setValueToAttribute(element, attributeName, value) {
    var dataName;
    if (attributeName.indexOf("data-") > -1) {
       dataName = attributeName.substring(attributeName.indexOf("data-") + 5);
       element.data(dataName, value);
    } else {
       element.attr(attributeName, value);
    }
  }

  function setValue(element, attributeName, value) {
    if (attributeName && typeof attributeName != "undefined") {
       setValueToAttribute(element, attributeName, value);
    } else {
      element.html(value);
    }
  }

  // Set content to an attribute if attribute name is specified, otherwise
  // set content from innerHTML.
  function setContent (jq, query, value) {
    var exprObj = parser.parse(query), element;
    if(!value) {
      return false;
    }
    element = getFirstMatchingElement(jq, exprObj.elementQuery);
    if(!element) {
      return false;
    }
    setValue(element, exprObj.attributeName, value);
    // For now, the regular expression component of this expression will be ignored.
    // If it makes sense to add this as a way to replace part of the target string,
    // then will add this in later.
    return true;
  }

  return {
      setContent: setContent
  };
});
