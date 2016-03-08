/*global define*/
define("locationHandler", function() {
  // Change location (window.location) based on values provided in the templated url.
  function changeLocation (isNewWindow, win, url) {
    var encodedUrl, newWin;

    if(!url) {
      return false;
    }
    encodedUrl = encodeURI(url);
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
