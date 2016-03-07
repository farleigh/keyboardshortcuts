/*global define*/
define("locationHandler", function() {
  // Change location (window.location) based on values provided in the templated url.
  function changeLocation (isNewWindow, win, urlStrategy, url, values) {
    var encodedUrl, newWin;
    if(!urlStrategy) {
      throw {message: "Invalid url strategy. Something is wrong!"};
    }
    if(!url) {
      return false;
    }
    encodedUrl = encodeURI(urlStrategy.getUrl(url, values));
    if(isNewWindow) {
      newWin = win.open(encodedUrl, '_blank');
      newWin.focus();
    } else {
      win.location.href = encodedUrl;
    }
    return true;
  }

  return {
    change: changeLocation
  };
});
