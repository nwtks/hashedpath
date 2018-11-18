const location = window.location

function forward(router) {
  const tos = router.tos
  const other = router.other
  const hash = location.hash
  router.path = hash
  if (hash) {
    const hp = hash.split('/')
    if (hp.length) {
      for (let i = 0; i < tos.length; i += 1) {
        const path = tos[i].path
        if (hp.length === path.length) {
          const param = Object.create(null)
          let found = true
          for (let j = 0; j < path.length; j += 1) {
            const p = path[j]
            if (p[0] === ':') {
              param[p.substring(1)] = hp[j]
            } else {
              if (p !== hp[j]) {
                found = false
                break
              }
            }
          }
          if (found) {
            tos[i].to(param, next)
            return
          }
        }
      }
    }
  }
  other({}, next)

  function next(f) {
    router.render = f
    router.render()
  }
}

function hashpath() {
  const router = {
    path: null,
    render: null,
    tos: [],
    other: null,
    hashchangeListener: null,
    route(path, to) {
      if (path && to) {
        if (path === '*') {
          router.other = to
        } else {
          router.tos.push({ path: path.split('/'), to: to })
        }
      }
      return router
    },
    redirect(path) {
      location.hash = path
    },
    start() {
      router.hashchangeListener = () => forward(router)
      window.addEventListener('hashchange', router.hashchangeListener)
      forward(router)
    },
    stop() {
      window.removeEventListener('hashchange', router.hashchangeListener)
    }
  }
  return router
}

export default hashpath
