export function merge () {
  const args = [].slice.call(arguments)
  let target = args.shift()
  if (!target) target = {}
  args.forEach(obj => {
    for (let key in obj) {
      target[key] = obj[key]
    }
  })
  return target
}

export function noop () {}

export function createElement (tagName, attrs) {
  var node = document.createElement(tagName)
  for (var attr in attrs) {
    if (attrs.hasOwnProperty(attr)) {
      node[attr] = attrs[attr]
    }
  }
  return node
}

export function delegate (el, className, eventName, callback, stop) {
  el.addEventListener(eventName, (e) => {
    let target = e.target
    while (target && target !== el) {
      if (target.classList.contains(className)) {
        callback(target)
        if (stop) e.stopPropagation()
      }
      target = target.parentNode
    }
  })
}
