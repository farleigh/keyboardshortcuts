/*global define */
// Perform a copy operation (copy). If an attribute is specified, the value
// of the attribute will be copied. If nothing is specified, the content of
// the first element matching the query will be copied.
define("copy", ["contentRetriever", "result"], function(contentRetriever, result) {

  // Usage copy(el('el selector', 'attr', /regex/flags) | url(/regex/flags) | selected(/regex/flags))
  var handle, regex = /^copy\s*\(\s*(.*?)\s*\)\s*$/i;

  // Push content into the clipboard
  // TODO: Refactor this to be more compliant with interacting with
  // the DOM via what comes through context.
  function performCopy (jq, content, context) {
    var input = jq("<textarea />");
    if(!context.document) {
      return false;
    }
    input.appendTo("body");
    input.val(content);
    input.select();
    jq(context.document)[0].execCommand("copy");
    input.remove();
    return true;
  }

  // Get content from element and perform copy
  function copy (jq, query, context) {
    var value = contentRetriever.getContent(jq, query, context);
    if (!value) {
      return false;
    }
    return performCopy(jq, value, context);
  }

  // Can this command handle the statement?
  function canHandle (statement, context) {
    return regex.test(statement);
  }

  // Return true if copy can handle this command.
  function handleCopy (jq, statement, context) {
    var success,
        attribute,
        matches = regex.exec(statement);
    if(!matches) {
      return result.NOT_HANDLED;
    }
    success = copy(jq, matches[1], context);
    return success ? result.HANDLED : result.NOT_HANDLED;
  }

  function usage () {
    return "Usage: copy('query', 'attribute'); Copies a value from the content or attribute of an element on the page.  If attribute name is missing then copies innerHTML of the element.";
  }

  return {
    handle: handleCopy,
    canHandle: canHandle,
    execute: copy,
    toString: usage
  };
});
