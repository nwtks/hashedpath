function forward(router) {
  const tos = router.tos
  const other = router.other
  const hash = window.location.hash
  if (!hash) {
    return other()
  }
  const hp = hash.split('/')
  if (!hp.length) {
    return other()
  }
  for (let i = 0; i < tos.length; i += 1) {
    const path = tos[i].path
    if (hp.length === path.length) {
      const param = Object.create(null)
      let found = true
      for (let j = 0; j < path.length; j += 1) {
        const p = path[j]
        if (p.charAt(0) === ':') {
          param[p.substring(1)] = hp[j]
        } else {
          if (p !== hp[j]) {
            found = false
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
  const router = {
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
      return forward(router)
    },
    start() {
      window.addEventListener('hashchange', () => forward(router))
      return forward(router)
    }
  }
  return router
}

export default hashpath
