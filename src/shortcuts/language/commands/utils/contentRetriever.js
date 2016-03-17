/*global define*/
define("contentRetriever", ["elementContentRetriever", "urlContentRetriever", "selectedContentRetriever"], function(elementContentRetriever, urlContentRetriever, selectedContentRetriever) {
  var retrievers = [
    elementContentRetriever,
    urlContentRetriever,
    selectedContentRetriever
  ];

  // Get content from the page using query.
  // Currently query may match 3 different things:
  // 1. el - Find an element in the document and retrieve text from its body or an attribute. Use a regular expresssion to
  //    match (if provided).
  // 2. url - Get the page url and perform a regular expression match on it. Return entire url if regular expression not provided.
  // 3. selected - Get text selected by the user and perform a regular expression match on it. Return all selected contents if regular
  //    expression not provided.
  function getContent(jq, query, context) {
    var i = 0, retriever, result;
    for(; i < retrievers.length; i += 1) {
      retriever = retrievers[i];
      if(retriever && retriever.getContent) {
        result = retriever.getContent(jq, query, context);
        if(result.match) {
          return result.content;
        }
      }
    }
    return "";
  }

  return {
      getContent: getContent
  };
});
