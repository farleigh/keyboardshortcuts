/*global define, document */
define("elementRetriever", function() {

  var currentPointRegex = /^\s*(?:current-element|)\s*$/i;

  // Get the element
  function getElement (jq, query, context) {
    var point = context && context.point,
        doc = context && context.document,
        el = queryForElement(jq, jq(doc), query, context);
    // If element does not exist in the main page, check any iframes.
    if(!el || !el.length) {
      // Note: Querying within iframes may blow up if the iframe is
      // from a different URL. There is nothing I can do about this.
      queryEach(jq("iframe"), function (element) {
        return queryForElement(jq, element.contents(), query, context);
      });
    }
    return el && el.first();
  }

  function queryEach(elements, find) {
    var el, i = 0;
    if(elements && elements.length) {
      for(; i < elements.length; i += 1) {
        el = find(elements.eq(i));
        if(el) {
          return el;
        }
      }
    }
  }

  // Query for the element
  function queryForElement (jq, root, query, context) {
    var el;
    if(currentPointRegex.test(query)) {
      el = getCurrentElement(jq, context.document, context.position);
    } else {
      el = root.find(query);
    }
    return el;
  }

  // Get the current element
  function getCurrentElement(jq, doc, position) {
    if(!position || !position.x || !position.y) {
      return;
    }
    return jq(doc.elementFromPoint(position.x, position.y));
  }

  return {
    get: getElement
  };
});
