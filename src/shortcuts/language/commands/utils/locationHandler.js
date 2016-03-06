/*global define*/
define("locationHandler", function() {
  // Change location (window.location) based on values provided in the templated url.
  function changeLocation (location, urlStrategy, url, values) {
    if(!urlStrategy) {
      throw {message: "Invalid url strategy. Something is wrong!"};
    }
    if(!url) {
      return false;
    }
    location.href = encodeURI(urlStrategy.getUrl(url, values));
    return true;
  }

  return {
    change: changeLocation
  };
});
