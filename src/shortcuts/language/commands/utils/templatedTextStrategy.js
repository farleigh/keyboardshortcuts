define("templatedTextStrategy", function() {
  var anyTemplateRegex = /\$\{\d+\}/gi;

  function getResult (text, valueObject) {
    var key, regex, value;
    if(!text) {
      return "";
    }
    if(valueObject) {
      for(key in valueObject) {
        value = valueObject[key];
        if(value == null) {
          value = "";
        }
        regex = new RegExp("\\$\\{" + key + "\\}", "gi");
        text = text.replace(regex, value);
      }
      text = text.replace(anyTemplateRegex, "");
    }
    return text;
  }

  return {
    get: getResult
  };
});
