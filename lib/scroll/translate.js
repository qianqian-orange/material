import eventType from '../eventType'
import { compose } from 'material/utils'

function move(scrollX, scrollY) {
  const fns = [() => {
    if (this.probeType) this.eventEmitter.emit(eventType.scroll, { x: this.curScrollWidth, y: this.curScrollHeight })
  }]
  if (scrollX) {
    fns.push((e) => {
      const clientX = parseInt(e.touches[0].clientX, 10)
      this.curScrollWidth = this.ensureX(this.preScrollWidth + clientX - this.startClientX)
      this.el.style.transform = `translateX(${this.curScrollWidth}px)`
      return e
    })
  }
  if (scrollY) {
    fns.push((e) => {
      const clientY = parseInt(e.touches[0].clientY, 10)
      this.curScrollHeight = this.ensureY(this.preScrollHeight + clientY - this.startClientY)
      this.el.style.transform = `translateY(${this.curScrollHeight}px)`
      return e
    })
  }
  return compose(...fns)
}

function to(scrollX, scrollY) {
  const fns = []
  if (scrollX) {
    fns.push(({ x }) => {
      this.toX(x)
    })
  }
  if (scrollY) {
    fns.push(({ y }) => {
      this.toY(y)
    })
  }
  return compose(...fns)
}

function reset(scrollX, scrollY) {
  const fns = []
  if (scrollY) {
    fns.push(() => {
      this.wrapperHeight = this.el.parentNode.offsetHeight
      this.contentHeight = this.el.offsetHeight
      const residue = this.contentHeight + this.preScrollHeight - this.wrapperHeight
      if (residue >= 0) return
      this.toY(this.preScrollHeight - residue)
    })
  }
  if (scrollX) {
    fns.push(() => {
      this.wrapperWidth = this.el.parentNode.offsetWidth
      this.contentWidth = this.el.offsetWidth
      const residue = this.contentWidth + this.preScrollWidth - this.wrapperWidth
      if (residue >= 0) return
      this.toX(this.preScrollWidth - residue)
    })
  }
  return compose(...fns)
}

class Translate {
  constructor({
    el,
    probeType,
    eventEmitter,
    scrollX,
    scrollY,
  }) {
    this.el = el
    this.probeType = probeType
    this.eventEmitter = eventEmitter
    this.wrapperHeight = el.parentNode.offsetHeight
    this.contentHeight = el.offsetHeight
    this.preScrollHeight = 0
    this.curScrollHeight = 0
    this.startClientY = 0
    this.wrapperWidth = el.parentNode.offsetWidth
    this.contentWidth = el.offsetWidth
    this.preScrollWidth = 0
    this.curScrollWidth = 0
    this.startClientX = 0
    this.move = move.call(this, scrollX, scrollY)
    this.to = to.call(this, scrollX, scrollY)
    this.reset = reset.call(this, scrollX, scrollY)
  }

  start(e) {
    this.startClientY = parseInt(e.touches[0].clientY, 10)
    this.startClientX = parseInt(e.touches[0].clientX, 10)
    this.eventEmitter.emit(eventType.beforeScrollStart, { x: this.preScrollWidth, y: this.preScrollHeight })
  }

  end() {
    this.preScrollWidth = this.curScrollWidth
    this.preScrollHeight = this.curScrollHeight
  }

  toX(x) {
    x = this.ensureX(x)
    this.preScrollWidth = this.curScrollWidth = x
    this.el.style.transform = `translateX(${x}px)`
  }

  toY(y) {
    y = this.ensureY(y)
    this.preScrollHeight = this.curScrollHeight = y
    this.el.style.transform = `translateY(${y}px)`
  }

  ensureX(x) {
    if (this.wrapperWidth >= this.contentWidth || x > 0) return 0
    if (x < this.wrapperWidth - this.contentWidth) return this.wrapperWidth - this.contentWidth
    return x
  }

  ensureY(y) {
    if (this.wrapperHeight >= this.contentHeight || y > 0) return 0
    if (y < this.wrapperHeight - this.contentHeight) return this.wrapperHeight - this.contentHeight
    return y
  }

  canScrollY() {
    return this.preScrollHeight < 0 && this.preScrollHeight > this.wrapperHeight - this.contentHeight
  }

  canScrollX() {
    return this.preScrollWidth < 0 && this.preScrollWidth > this.wrapperWidth - this.contentWidth
  }

  offsetY(offset) {
    this.preScrollHeight = this.curScrollHeight = this.ensureY(this.preScrollHeight + offset)
    this.el.style.transform = `translateY(${this.preScrollHeight}px)`
  }

  offsetX(offset) {
    this.preScrollWidth = this.curScrollWidth = this.ensureX(this.preScrollWidth + offset)
    this.el.style.transform = `translateX(${this.preScrollWidth}px)`
  }

  getCurrent() {
    return { x: this.preScrollWidth, y: this.preScrollHeight }
  }
}

export default Translate
