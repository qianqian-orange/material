// options: { leading, trailing }
// leading为true立即触发一次
// trailing为true触发最后一次
export function throttle(fn, delay = 300, options = { leading: true, trailing: true }) {
  let previous = 0
  let timer = null

  function throttled() {
    const current = Date.now()
    if (!previous && !options.leading) previous = current
    const residue = delay - (current - previous)
    if (residue <= 0 || residue > delay) {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      previous = current
      fn.apply(this, arguments)
    } else if (!timer && options.trailing) {
      timer = setTimeout(() => {
        timer = null
        previous = options.leading ? Date.now() : 0
        fn.apply(this, arguments)
      }, residue)
    }
  }

  throttle.cancel = function () {
    if (timer) clearTimeout(timer)
    timer = null
    previous = 0
  }

  return throttled
}

export function debounce(fn, delay = 300, immediate = true) {
  let timer = null

  function debounced() {
    if (timer) clearTimeout(timer)
    if (immediate) {
      const callNow = !timer
      timer = setTimeout(() => {
        timer = null
      }, delay)
      callNow && fn.apply(this.arguments)
    } else {
      timer = setTimeout(() => {
        timer = null
        fn.apply(this, arguments)
      }, delay)
    }
  }

  debounced.cancel = function () {
    if (timer) clearTimeout(timer)
    timer = null
  }

  return debounced
}

export function delay(duration) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, duration)
  })
}

function curryed(fn, ...args) {
  return function () {
    return fn.apply(this, args.concat(Array.prototype.slice.call(arguments)))
  }
}

export function curry(fn, length) {
  length = length || fn.length
  return function () {
    if (arguments.length < length) {
      return curry(curryed.apply(this, [fn].concat(Array.prototype.slice.call(arguments))), length - arguments.length)
    } else {
      return fn.apply(this, arguments)
    }
  }
}

export const compose = (...fns) => fns.reduce((pre, cur) => (...args) => pre(cur(...args)))
