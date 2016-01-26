/*global define */
// Perform a copy operation (copy). If an attribute is specified, the value
// of the attribute will be copied. If nothing is specified, the content of
// the first element matching the query will be copied.
define("copy", ["result"], function(result) {
    var regex, handle;
    regex = /^copy\s*\(\s*(?:")([^"]+)(?:")\s*(?:,\s*(?:")([^"]+)(?:"))?\s*\)$/i;

    // Get content from an attribute if attribute name is specified, otherwise
    // get content from innerHTML.
    function getContent (jq, query, attributeName) {
        var elements = jq(query);
        if (elements && elements.length) {
            var element = elements.first();
            if (attributeName) {
             if (attributeName.indexOf("data-") > -1) {
                 var dataName = attributeName.substring(attributeName
                         .indexOf("data-") + 5);
                 return element.data(dataName);
             } else {
                 return element.attr(attributeName);
             }
            } else {
                return element.html();
            }
        }
    }

    // Push content into the clipboard
    function performCopy (jq, content) {
        var input = jq("<textarea />");
        input.appendTo("body");
        input.val(content);
        input.select();
        jq(document)[0].execCommand("copy");
        input.remove();
        return true;
    }

    // Get content from element and perform copy
    function copy (jq, query, attribute) {
        var value = getContent(jq, query, attribute);
        if (!value) {
         return false;
        }
        return performCopy(jq, value);
    }

    // Return true if copy can handle this command.
    function handleCopy (jq, statement) {
        var attribute;
        var matches = regex.exec(statement);
        if(!matches) {
         return result.NOT_HANDLED;
        }
        attribute = matches.length == 3 ? matches[2] : undefined;
        var success = copy(jq, matches[1], attribute);
        return success ? result.HANDLED : result.NOT_HANDLED;
    }

    function usage () {
        return "Usage: copy('query', 'attribute'); Copies a value from the content or attribute of an element on the page.  If attribute name is missing then copies innerHTML of the element.";
    }

    return {
        handle: handleCopy,
        execute: copy,
        toString: usage
    };
});
