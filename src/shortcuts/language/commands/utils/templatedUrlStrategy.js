define("templatedUrlStrategy", function() {
  function getUrl (url, valueObject) {
    var key, regex;
    if(!url) {
      return "";
    }
    if(valueObject) {
      for(key in valueObject) {
        regex = new RegExp("\\$\\{" + key + "\\}", "gi");
        url = url.replace(regex, valueObject[key]);
      }
    }
    return url;
  }

  return {
    getUrl: getUrl
  };
});
