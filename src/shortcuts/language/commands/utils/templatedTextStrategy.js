define("templatedTextStrategy", function() {
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
    }
    return text;
  }

  return {
    get: getResult
  };
});
