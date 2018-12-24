'use strict';

var location = window.location;

var forward = function (hash, tos, other, next) {
  if (hash) {
    var hashpath = hash.split('/');
    if (hashpath.length) {
      var found = tos.some(function (to) {
        var path = to.path;
        if (hashpath.length !== path.length) {
          return false;
        }
        var param = Object.create(null);
        var matched = path.every(function (p, i) {
          var hp = hashpath[i];
          if (p[0] === ':') {
            param[p.substring(1)] = hp;
            return true;
          }
          return p === hp;
        });
        if (matched) {
          to.to(param, next);
        }
        return matched;
      });
      if (found) {
        return;
      }
    }
  }
  if (other) {
    other({}, next);
  }
};

var createRouter = function () {
  var tos = [];
  var other = null;
  var listener = null;
  var router = {
    path: null,
    render: null,
    route: function (path, to) {
      if (path && to) {
        if (path === '*') {
          other = to;
        } else {
          tos.push({ path: path.split('/'), to: to });
        }
      }
      return router;
    },
    redirect: function (path) {
      location.hash = path;
    },
    start: function () {
      if (listener) {
        router.stop();
      }
      listener = function () {
        var hash = location.hash;
        router.path = hash;
        forward(hash, tos, other, next);
      };
      window.addEventListener('hashchange', listener);
      listener();
    },
    stop: function () {
      window.removeEventListener('hashchange', listener);
      listener = null;
    }
  };
  var next = function (f) {
    router.render = f;
    router.render();
  };
  return router;
};

module.exports = createRouter;
