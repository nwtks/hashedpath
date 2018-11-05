'use strict';

function forward(router) {
  var tos = router.tos;
  var other = router.other;
  var hash = window.location.hash;
  router.path = hash;
  if (hash) {
    var hp = hash.split('/');
    if (hp.length) {
      for (var i = 0; i < tos.length; i += 1) {
        var path = tos[i].path;
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
            var f = tos[i].to(param);
            if (f.then) {
              f.then(function (r) {
                router.render = r;
                router.render();
              });
            } else {
              router.render = f;
              router.render();
            }
            return
          }
        }
      }
    }
  }
  if (other.then) {
    other.then(function (r) {
      router.render = r;
      router.render();
    });
  } else {
    router.render = other;
    router.render();
  }
}

function hashpath() {
  var router = {
    path: null,
    render: null,
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
    redirect: function redirect(path) {
      window.location.hash = path;
    },
    start: function start() {
      window.addEventListener('hashchange', function () { return forward(router); });
      forward(router);
    }
  };
  return router
}

module.exports = hashpath;
