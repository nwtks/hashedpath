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
        const to = tos[i]
        const path = to.path
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
            to.to(param, next)
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

function hashedpath() {
  const router = {
    path: null,
    render: null,
    tos: [],
    other: null,
    lstnr: null,
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
      if (router.lstnr) {
        router.stop()
      }
      router.lstnr = () => forward(router)
      window.addEventListener('hashchange', router.lstnr)
      forward(router)
    },
    stop() {
      window.removeEventListener('hashchange', router.lstnr)
      router.lstnr = null
    }
  }
  return router
}

export default hashedpath
