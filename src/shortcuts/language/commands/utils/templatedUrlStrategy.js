define("templatedUrlStrategy", function() {
  function getUrl (url, valueObject) {
    var key, regex, value;
    if(!url) {
      return "";
    }
    if(valueObject) {
      for(key in valueObject) {
        value = valueObject[key];
        if(value == null) {
          value = "";
        }
        regex = new RegExp("\\$\\{" + key + "\\}", "gi");
        url = url.replace(regex, value);
      }
    }
    return url;
  }

  return {
    getUrl: getUrl
  };
});
