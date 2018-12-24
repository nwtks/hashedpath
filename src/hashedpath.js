const { location } = window;

const forward = (hash, tos, other, next) => {
  if (hash) {
    const hashpath = hash.split('/');
    if (hashpath.length) {
      const found = tos.some((to) => {
        const path = to.path;
        if (hashpath.length !== path.length) {
          return false;
        }
        const param = Object.create(null);
        const matched = path.every((p, i) => {
          const hp = hashpath[i];
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

const createRouter = () => {
  const tos = [];
  let other = null;
  let listener = null;
  const router = {
    path: null,
    render: null,
    route: (path, to) => {
      if (path && to) {
        if (path === '*') {
          other = to;
        } else {
          tos.push({ path: path.split('/'), to: to });
        }
      }
      return router;
    },
    redirect: (path) => {
      location.hash = path;
    },
    start: () => {
      if (listener) {
        router.stop();
      }
      listener = () => {
        const hash = location.hash;
        router.path = hash;
        forward(hash, tos, other, next);
      };
      window.addEventListener('hashchange', listener);
      listener();
    },
    stop: () => {
      window.removeEventListener('hashchange', listener);
      listener = null;
    }
  };
  const next = (f) => {
    router.render = f;
    router.render();
  };
  return router;
};

export default createRouter;
