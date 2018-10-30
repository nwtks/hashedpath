'use strict';

function forward(router) {
  var tos = router.tos;
  var other = router.other;
  var hash = window.location.hash;
  if (!hash) {
    return other()
  }
  var hp = hash.split('/');
  if (!hp.length) {
    return other()
  }
  for (var i = 0; i < tos.length; i += 1) {
    var path = tos[i].path;
    if (hp.length === path.length) {
      var param = Object.create(null);
      var found = true;
      for (var j = 0; j < path.length; j += 1) {
        var p = path[j];
        if (p.charAt(0) === ':') {
          param[p.substring(1)] = hp[j];
        } else {
          if (p !== hp[j]) {
            found = false;
            break
          }
        }
      }
      if (found) {
        return tos[i].to(param)
      }
    }
  }
  return other()
}

function hashpath() {
  var router = {
    tos: [],
    other: null,
    route: function route(path, to) {
      if (path && to) {
        if (path === '*') {
          router.other = to;
        } else {
          router.tos.push({ path: path.split('/'), to: to });
        }
      }
      return router
    },
    start: function start() {
      window.addEventListener('hashchange', function () { return forward(router); });
      return forward(router)
    }
  };
  return router
}

module.exports = hashpath;
