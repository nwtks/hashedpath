function forward(router) {
  const tos = router.tos
  const other = router.other
  const hash = window.location.hash
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
            const f = tos[i].to(param)
            if (f.then) {
              f.then(r => {
                router.render = r
                router.render()
              })
            } else {
              router.render = f
              router.render()
            }
            return
          }
        }
      }
    }
  }
  if (other.then) {
    other.then(r => {
      router.render = r
      router.render()
    })
  } else {
    router.render = other
    router.render()
  }
}

function hashpath() {
  const router = {
    path: null,
    render: null,
    tos: [],
    other: null,
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
      window.location.hash = path
    },
    start() {
      window.addEventListener('hashchange', () => forward(router))
      forward(router)
    }
  }
  return router
}

export default hashpath
