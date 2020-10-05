import eventType from '../eventType'
import { compose } from 'material/utils'

const regex = /matrix\((.*)\)/

function move(scrollX, scrollY) {
  const fns = []
  if (scrollX) {
    fns.push((e) => {
      const clientX = parseInt(e.touches[0].clientX, 10)
      const instance = Math.abs(clientX - this.startClientX)
      if (instance >= this.instanceX) this.instanceX = instance
      else {
        this.timeStampX = Date.now()
        this.startClientX = clientX
        this.instanceX = 0
      }
      return e
    })
  }
  if (scrollY) {
    fns.push((e) => {
      const clientY = parseInt(e.touches[0].clientY)
      const instance = Math.abs(clientY - this.startClientY)
      if (instance >= this.instanceY) this.instanceY = instance
      else {
        this.timeStampY = Date.now()
        this.startClientY = clientY
        this.instanceY = 0
      }
      return e
    })
  }
  return compose(...fns)
}

function end(scrollX, scrollY) {
  const fns = [() => {
    if (!this.pending) {
      this.eventEmitter.emit(eventType.scrollEnd, this.coordinate())
      return
    }
    this.el.style.transitionDuration = `${this.duration}ms`
    if (this.probeType) {
      this.id = window.requestAnimationFrame(() => {
        this.step()
      })
    }
  }]
  if (scrollY) {
    fns.push((e) => {
      if (!this.translate.canScrollY()) {
        this.instanceY = 0
        return e
      }
      let speed = 0
      const time = Date.now() - this.timeStampY
      if (this.instanceY && time) speed = +(this.instanceY / time).toFixed(2)
      this.instanceY = 0
      if (speed < this.lowestSpeed) return e
      const clientY = e.changedTouches[0].clientY
      speed = clientY < this.startClientY ? -speed : speed
      this.translate.offsetY(parseInt(speed * this.seconds), 10)
      this.pending = true
      return e
    })
  }
  if (scrollX) {
    fns.push((e) => {
      if (!this.translate.canScrollX()) {
        this.instanceX = 0
        return e
      }
      let speed = 0
      const time = Date.now() - this.timeStampX
      if (this.instanceX && time) speed = +(this.instanceX / time).toFixed(2)
      this.instanceX = 0
      if (speed < this.lowestSpeed) return e
      const clientX = e.changedTouches[0].clientX
      speed = clientX < this.startClientX ? -speed : speed
      this.translate.offsetX(parseInt(speed * this.seconds), 10)
      this.pending = true
      return e
    })
  }
  return compose(...fns)
}

class Transition {
  constructor({
    el,
    probeType,
    eventEmitter,
    translate,
    scrollX,
    scrollY,
  }) {
    this.el = el
    this.probeType = probeType
    this.eventEmitter = eventEmitter
    this.translate = translate
    this.startClientY = 0
    this.timeStampY = 0
    this.instanceY = 0
    this.startClientX = 0
    this.timeStampX = 0
    this.instanceX = 0
    this.lowestSpeed = 3
    this.seconds = 600
    this.duration = 1000
    this.pending = false
    this.id = null
    this.move = move.call(this, scrollX, scrollY)
    this.end = end.call(this, scrollX, scrollY)
  }

  coordinate() {
    regex.test(window.getComputedStyle(this.el, null).transform)
    const [, , , , x, y] = RegExp.$1.split(', ')
    return { x: parseInt(+x, 10), y: parseInt(+y, 10) }
  }

  stop() {
    this.translate.to(this.coordinate())
    const event = new Event(eventType.transitionend)
    this.el.dispatchEvent(event)
  }

  start(e) {
    if (this.pending) this.stop()
    this.startClientX = parseInt(e.touches[0].clientX, 10)
    this.startClientY = parseInt(e.touches[0].clientY, 10)
    this.timeStampX = this.timeStampY = Date.now()
  }

  to({ x, y }, duration) {
    const previous = this.translate.getCurrent()
    this.el.style.transitionDuration = `${duration}ms`
    this.translate.to({ x, y })
    if (duration === 0) return
    if (this.pending) return
    const current = this.translate.getCurrent()
    // 如果目标位置和当前位置相同，那什么都不用做
    if (previous.x === current.x && previous.y === current.y) {
      this.el.style.transitionDuration = '0ms'
      return
    }
    this.pending = true
    if (this.probeType) {
      this.id = window.requestAnimationFrame(() => {
        this.step()
      })
    }
  }

  step() {
    this.eventEmitter.emit(eventType.scroll, this.coordinate())
    this.id = window.requestAnimationFrame(() => {
      this.step()
    })
  }

  transitionEnd(e) {
    e.stopPropagation()
    this.pending = false
    this.el.style.transitionDuration = '0ms'
    window.cancelAnimationFrame(this.id)
    this.eventEmitter.emit(eventType.scrollEnd, this.coordinate())
  }

  addEventListener() {
    this.bindTransitionEnd = this.transitionEnd.bind(this)
    this.el.addEventListener(eventType.transitionend, this.bindTransitionEnd, false)
  }

  removeEventListener() {
    this.el.removeEventListener(eventType.transitionend, this.bindTransitionEnd, false)
  }

  run() {
    return this.pending
  }

  destroy() {
    // 如果在过渡过程中组件销毁，那么会调用destroy方法，那么需要调用stop方法
    // 否则step函数会执行，那么由于scroll已经销毁，会报错
    this.stop()
    this.removeEventListener()
  }
}

export default Transition
