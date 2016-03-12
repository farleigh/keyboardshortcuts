/*global chrome */
define("angularStorage", ["storage"], function (storage) {
  return function angularStorage ($q) {
    return {
      get: function (key) {
        var deferred = $q.defer();
        storage.get(key, function(data) {
          var value = storage.extractValue(key, data);
          deferred.resolve(value);
        });
        return deferred.promise;
      },
      set: function (key, value) {
        if (!key || !value) {
          return;
        }
        storage.set(key, value);
      }
    };
  };
});
