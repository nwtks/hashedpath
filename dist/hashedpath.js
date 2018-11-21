'use strict';

var location = window.location;

function forward(router) {
  var tos = router.tos;
  var other = router.other;
  var hash = location.hash;
  router.path = hash;
  if (hash) {
    var hp = hash.split('/');
    if (hp.length) {
      for (var i = 0; i < tos.length; i += 1) {
        var to = tos[i];
        var path = to.path;
        if (hp.length === path.length) {
          var param = Object.create(null);
          var found = true;
          for (var j = 0; j < path.length; j += 1) {
            var p = path[j];
            if (p[0] === ':') {
              param[p.substring(1)] = hp[j];
            } else {
              if (p !== hp[j]) {
                found = false;
                break
              }
            }
          }
          if (found) {
            to.to(param, next);
            return
          }
        }
      }
    }
  }
  other({}, next);

  function next(f) {
    router.render = f;
    router.render();
  }
}

function hashedpath() {
  var router = {
    path: null,
    render: null,
    tos: [],
    other: null,
    lstnr: null,
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
    redirect: function redirect(path) {
      location.hash = path;
    },
    start: function start() {
      router.lstnr = function () { return forward(router); };
      window.addEventListener('hashchange', router.lstnr);
      forward(router);
    },
    stop: function stop() {
      window.removeEventListener('hashchange', router.lstnr);
      router.lstnr = null;
    }
  };
  return router
}

module.exports = hashedpath;
