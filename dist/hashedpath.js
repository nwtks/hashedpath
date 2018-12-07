'use strict';

var location = window.location;

var forward = function (router, next, hash) {
  var tos = router.tos;
  var other = router.other;
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
            var h = hp[j];
            if (p[0] === ':') {
              param[p.substring(1)] = h;
            } else {
              if (p !== h) {
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
};

var createRouter = function () {
  var router = {
    path: null,
    render: null,
    tos: [],
    other: null,
    lstnr: null,
    route: function (path, to) {
      if (path && to) {
        if (path === '*') {
          router.other = to;
        } else {
          router.tos.push({ path: path.split('/'), to: to });
        }
      }
      return router
    },
    redirect: function (path) { return (location.hash = path); },
    start: function () {
      if (router.lstnr) {
        router.stop();
      }
      router.lstnr = function () { return forward(router, next, location.hash); };
      window.addEventListener('hashchange', router.lstnr);
      forward(router, next, location.hash);
    },
    stop: function () {
      window.removeEventListener('hashchange', router.lstnr);
      router.lstnr = null;
    }
  };
  var next = function (f) {
    router.render = f;
    router.render();
  };
  return router
};

module.exports = createRouter;
