import EventEmitter from '../eventEmitter'
import eventType from '../eventType'
// 用于匹配transfrom值
const regex = /matrix\((.*)\)/

class Slider {
  constructor({
    el,
    duration = 400,
    loop = true,
    bounce = true,
    click = true,
    stopPropagation = false,
    nested = false,
  } = {}) {
    // 这个的el传的是上面HTML文档结构中的div
    this.el = typeof el === 'string' ? document.querySelector(el) : el
    if (!this.el) {
      console.error('the el is not exist')
      return
    }
    this.click = click
    this.stopPropagation = stopPropagation
    this.nested = nested
    // 记录开始触碰div的触点的clientX, 即touches[0].clientX
    this.clientX = 0
    // 记录ul的当前偏移位置
    this.startX = 0
    // 当前页的索引
    this.index = 0
    // 当滑动距离超过该值时就滚动到下一页或上一页
    this.interval = null
    // 判断是否正在过渡过程中
    this.pending = false
    // 过渡时间
    this.duration = duration
    this.loop = loop
    this.bounce = bounce
    // 当滑动距离小于该值是不会触发trantionend事件的
    // 所以小于该值时就需要设置过渡时间了，同时pengding也要设置为false
    this.min = 20
    this.eventEmitter = new EventEmitter()
    this.init()
  }

  init() {
    this.reset()
    this.addEventListener()
  }

  reset() {
    if (this.el.children.length === 0) return
    this.ul = this.el.children[0]
    const children = this.ul.children
    this.size = children.length
    if (this.size === 0) return
    // li的宽度
    this.width = children[0].offsetWidth
    this.el.style.width = `${this.width}px`
    // 遍历li设置li的宽度，因为我们在设置li的宽度样式时可能不是使用px，
    // 而是使用width: 100%,那么需要设置成px, 因为我们接下在会修改ul的宽度
    // 如果li宽度样式依旧是100%的话那么不正确了
    for (let i = 0; i < children.length; i += 1) {
      children[i].style.width = `${this.width}px`
    }
    // 设置ul过渡样式
    this.ul.style.transition = 'transform 0ms ease'
    this.interval = this.width * 0.2
    if (this.loop) {
      this.startX = -this.width
      this.ul.style.width = `${this.width * (this.size + 2)}px`
      const children = this.ul.children
      const first = children[0]
      const last = children[children.length - 1]
      this.ul.appendChild(first.cloneNode(true))
      this.ul.insertBefore(last.cloneNode(true), first)
    } else {
      this.startX = 0
      this.ul.style.width = `${this.width * this.size}px`
    }
    this.to(this.startX)
  }

  to(x) {
    if (this.bounce || this.loop) {
      this.ul.style.transform = `translateX(${x}px)`
      return
    }
    // bounce需要在loop为false的情况下才能工作
    if (x > 0) x = 0
    else if (x < -this.width * (this.size - 1)) x = -this.width * (this.size - 1)
    this.ul.style.transform = `translateX(${x}px)`
  }

  addEventListener() {
    this.bindStart = this.start.bind(this)
    this.bindMove = this.move.bind(this)
    this.bindEnd = this.end.bind(this)
    this.el.addEventListener(eventType.touchstart, this.bindStart, false)
    this.el.addEventListener(eventType.touchmove, this.bindMove, false)
    this.el.addEventListener(eventType.touchend, this.bindEnd, false)
    this.bindTransitionEnd = this.transitionEnd.bind(this)
    this.ul.addEventListener(eventType.transitionend, this.bindTransitionEnd, false)
  }

  start(e) {
    e.preventDefault()
    if (this.stopPropagation) e.stopPropagation()
    // 这个判断逻辑分支后面讲
    if (this.pending) this.stop()
    this.clientX = e.touches[0].clientX
    this.eventEmitter.emit(eventType.beforeScrollStart)
  }

  move(e) {
    e.preventDefault()
    if (this.stopPropagation) e.stopPropagation()
    this.to(e.touches[0].clientX - this.clientX + this.startX)
  }

  end(e) {
    e.preventDefault()
    if (this.stopPropagation) e.stopPropagation()
    this.pending = true
    this.ul.style.transitionDuration = `${this.duration}ms`
    // 先把当前的startX值保留起来
    const startX = this.startX
    // 如果在过渡过程中触碰了div, 那么会调用stop函数，会修改starX的值
    // 修改后的值不是li宽度的整数倍，所以需要根据index值重新计算
    if (this.loop) this.startX = -this.width * (this.index + 1)
    else this.startX = -this.width * this.index
    const interval = e.changedTouches[0].clientX - this.clientX
    this.lessThanInterval(Math.abs(interval), startX)
    this.notLessThanInterval(interval)
    if (Math.abs(interval) >= this.min) {
      // 这里之所以要派发transitionend的事件是因为trantionend函数中有处理loop为true时才有的
      // 边界处理，就没要在这里添加边界处理的逻辑
      if (!this.duration) {
        const event = new Event(eventType.transitionend)
        this.ul.dispatchEvent(event)
        return
      }
      // 对于bounce为false的情况，只需要判断ul当前的transform的偏移值是否已到边界即可
      if (!this.loop && !this.bounce) {
        regex.test(window.getComputedStyle(this.ul, null).transform)
        const x = +RegExp.$1.split(', ')[4]
        if (x === 0 || x === -this.width * (this.size - 1)) {
          this.pending = false
          this.ul.style.transitionDuration = '0ms'
          this.eventEmitter.emit(eventType.scrollEnd)
        }
      }
    }
    // 这里处理click事件
    if (this.pending || this.nested) return
    if (this.click && Math.abs(e.changedTouches[0].clientX - this.clientX) <= 8) {
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

  // 负责处理没有触发touchmove的情况
  lessThanInterval(interval, startX) {
    if (interval < this.interval) {
      this.to(this.startX)
      // 过渡过程中没有触发touchmove的情况不用处理
      if (interval < this.min && startX === this.startX) {
        this.pending = false
        this.ul.style.transitionDuration = '0ms'
      }
    }
  }

  notLessThanInterval(interval) {
    if (Math.abs(interval) >= this.interval) {
      if (interval < 0) {
        this.index += 1
        this.startX -= this.width
      } else {
        this.index -= 1
        this.startX += this.width
      }
      if (!this.loop) {
        if (this.index === -1) {
          this.index += 1
          this.startX -= this.width
        } else if (this.index === this.size) {
          this.index -= 1
          this.startX += this.width
        }
      }
      this.to(this.startX)
    }
  }

  transitionEnd(e) {
    e.stopPropagation()
    this.ul.style.transitionDuration = '0ms'
    this.pending = false
    if (this.index === -1) {
      this.index = this.size - 1
      this.startX = -this.width * this.size
    } else if (this.index === this.size) {
      this.index = 0
      this.startX = -this.width
    }
    this.to(this.startX)
    this.eventEmitter.emit(eventType.scrollEnd)
  }

  stop() {
    // 获取ul当前transfrom的值
    regex.test(window.getComputedStyle(this.ul, null).transform)
    const x = +RegExp.$1.split(', ')[4]
    // 这里需要先把index值保留，因为后面派发transitionend事件时
    // 可能会修改index值
    const index = this.index
    // 这里手动派发transitionend事件
    const event = new Event(eventType.transitionend)
    this.ul.dispatchEvent(event)
    if (index === -1) this.startX += x
    else if (index === this.size) this.startX += x + this.width * (this.size + 1)
    else this.startX = x
    this.to(this.startX)
  }

  destroy() {
    this.el.removeEventListener(eventType.touchstart, this.bindStart, false)
    this.el.removeEventListener(eventType.touchmove, this.bindMove, false)
    this.el.removeEventListener(eventType.touchend, this.bindEnd, false)
    this.ul.removeEventListener(eventType.transitionend, this.bindTransitionEnd, false)
  }

  on(type, fn) {
    this.eventEmitter.on(type, fn)
  }

  transition() {
    this.pending = true
    this.ul.style.transitionDuration = `${this.duration}ms`
    this.to(this.startX)
  }

  prev() {
    this.index -= 1
    this.startX += this.width
    this.transition()
  }

  next() {
    this.index += 1
    this.startX -= this.width
    this.transition()
  }

  getCurrentPage() {
    return this.index
  }

  jump(index) {
    if (this.index === index) return
    this.startX -= (index - this.index) * this.width
    this.index = index
    this.transition()
  }
}

export default Slider
