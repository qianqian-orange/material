import Translate from './translate'
import Transition from './transition'
import EventEmitter from '../eventEmitter'
import eventType from '../eventType'
import { add, remove, destroy } from './scheduler'
import { compose } from 'material/utils'

function trigger(type, e) {
  switch (type) {
    case eventType.touchstart:
      this.start(e)
      break
    case eventType.touchmove:
      this.move(e)
      break
    case eventType.touchend:
      this.end(e)
      break
    default:
      throw new TypeError('illegal type value')
  }
}

function move() {
  const fns = []
  fns.push((e) => {
    e.preventDefault()
    if (this.nested && !this.stop) return
    if (this.stopPropagation) e.stopPropagation()
    this.origins.forEach((origin) => {
      trigger.call(origin, eventType.touchmove, e)
    })
  })
  if (this.nested) {
    fns.push((e) => {
      if (!this.toggle) {
        this.toggle = true
        const intervalX = Math.abs(parseInt(e.touches[0].clientX, 10) - this.clientX)
        const intervalY = Math.abs(parseInt(e.touches[0].clientY, 10) - this.clientY)
        if (this.scrollX && intervalX < intervalY) this.stop = false
        if (this.scrollY && intervalY < intervalX) this.stop = false
      }
      if (this.stop) e.stopPropagation()
      return e
    })
  }
  return compose(...fns)
}

// TODO: 由于调用了e.preventDefault方法，如果当前页面处于浏览器原生滚动状态的话会报错
// 需要监听当前页面是否滚动判断是否调用e.preventDefault
// 对于内嵌的scroll，点击它内部的元素的话外层的scroll是不会派发click事件的
// nested的优先级要比stopPropagtion要高
class Scroll {
  constructor({
    el,
    probeType = 0,
    click = true,
    stopPropagation = false,
    scrollY = true,
    scrollX = false,
    nested = false,
  } = {}) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el
    if (!this.el) {
      console.error('the element is not exist')
      return
    }
    add(this)
    this.probeType = probeType
    this.click = click
    this.stopPropagation = stopPropagation
    this.nested = nested
    this.stop = true
    this.toggle = false
    this.scrollX = scrollX
    this.scrollY = scrollY
    this.eventEmitter = new EventEmitter()
    this.translate = new Translate({
      el: this.el,
      probeType: probeType,
      eventEmitter: this.eventEmitter,
      scrollX,
      scrollY,
    })
    this.transition = new Transition({
      el: this.el,
      probeType: probeType,
      eventEmitter: this.eventEmitter,
      translate: this.translate,
      scrollX,
      scrollY,
    })
    this.clientY = 0
    this.clientX = 0
    // 滑动距离小于该值时判定为click
    this.min = 8
    this.pending = false
    this.origins = [this.translate, this.transition]
    this.init()
  }

  init() {
    this.move = move.call(this)
    this.el.style.transitionProperty = 'transform'
    this.el.style.transitionTimingFunction = 'cubic-bezier(0.165, 0.84, 0.44, 1)'
    this.el.style.transitionDuration = '0ms'
    this.el.style.transform = 'translate(0, 0)'
    // this.el.style.willChange = 'transform'
    this.bindStart = this.start.bind(this)
    this.bindEnd = this.end.bind(this)
    this.transition.addEventListener()
    this.el.addEventListener(eventType.touchstart, this.bindStart, false)
    this.el.addEventListener(eventType.touchmove, this.move, false)
    this.el.addEventListener(eventType.touchend, this.bindEnd, false)
  }

  start(e) {
    e.preventDefault()
    this.pending = this.transition.run()
    this.clientY = parseInt(e.touches[0].clientY, 10)
    this.clientX = parseInt(e.touches[0].clientX, 10)
    this.origins.forEach((origin) => {
      trigger.call(origin, eventType.touchstart, e)
    })
  }

  end(e) {
    e.preventDefault()
    this.toggle = false
    if (this.nested) {
      if (!this.stop) {
        this.stop = true
        return
      }
      e.stopPropagation()
    }
    if (this.stopPropagation) e.stopPropagation()
    this.origins.forEach((origin) => {
      trigger.call(origin, eventType.touchend, e)
    })
    // 如果处于过渡状态那么不触发点击事件
    // console.log(this.pending)
    if (this.pending) return
    const clientY = parseInt(e.changedTouches[0].clientY, 10)
    const clientX = parseInt(e.changedTouches[0].clientX, 10)
    if (this.click && Math.abs(clientY - this.clientY) <= this.min &&
      Math.abs(clientX - this.clientX) <= this.min) {
      const event = new Event('click')
      let stop = false
      event.stopPropagation = function () {
        stop = true
      }
      let el = e.target
      while (el !== this.el) {
        el.dispatchEvent(event)
        if (stop) break
        el = el.parentNode
      }
    }
  }

  destroy() {
    remove(this)
    this.transition.destroy()
    this.el.removeEventListener(eventType.touchstart, this.bindStart, false)
    this.el.removeEventListener(eventType.touchmove, this.move, false)
    this.el.removeEventListener(eventType.touchend, this.bindEnd, false)
  }

  scrollToElement(el, duration = 0) {
    duration = duration < 0 ? 0 : duration
    let node = el
    let y = 0
    let x = 0
    do {
      y += node.offsetTop
      x += node.offsetLeft
      node = node.offsetParent
    } while (node !== this.el && node !== null)
    this.transition.to({ x: -x, y: -y }, duration)
  }

  scrollTo({ x, y }, duration = 0) {
    duration = duration < 0 ? 0 : duration
    this.transition.to({ x, y }, duration)
  }

  reset() {
    this.translate.reset()
  }

  on(type, fn) {
    this.eventEmitter.on(type, fn)
  }

  off(type, fn) {
    this.eventEmitter.off(type, fn)
  }

  getCurrent() {
    return this.translate.getCurrent()
  }
}

export { destroy }

export default Scroll
