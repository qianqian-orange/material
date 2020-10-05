import ElmNotify from './index.vue'

const types = {
  success: 'success',
  primary: 'primary',
  warning: 'warning',
  danger: 'danger',
}

const prefix = 'elm-notify'
let hidden = false
let pending = false
let id = null

function core(type, message, duration) {
  const el = createElement(type, message)
  transition(el, duration)
  // eslint-disable-next-line
  core = function (type, message, duration) {
    // 修改文本内容
    el.innerText = message
    // 修改样式
    Object.keys(types).some((key) => {
      if (el.classList.contains(`${prefix}-${key}`)) {
        el.classList.replace(`${prefix}-${key}`, `${prefix}-${type}`)
        return true
      }
      return false
    })
    // 如果当前已有notify，那么重置定时后直接返回
    if (pending) {
      clearTimeout(id)
      id = setTimeout(() => {
        hidden = true
        el.style.transform = 'translateY(-100%)'
      }, duration)
      return
    }
    el.style.display = 'block'
    transition(el, duration)
  }
}

function notify({ type, message, duration = 3000 }) {
  core(type, message, duration)
}

async function transition(el, duration) {
  pending = true
  setTimeout(() => {
    hidden = false
    el.style.transform = 'translateY(0)'
    id = setTimeout(() => {
      hidden = true
      el.style.transform = 'translateY(-100%)'
    }, duration)
  })
}

function createElement(type, message) {
  const el = document.createElement('div')
  el.innerText = message
  el.classList.add(prefix)
  el.classList.add(`${prefix}-${type}`)
  el.addEventListener('transitionend', () => {
    if (hidden) {
      pending = false
      el.style.display = 'none'
    }
  })
  document.body.appendChild(el)
  return el
}

function install(Vue) {
  Vue.prototype.$notify = notify
  Vue.component('ElmNotify', ElmNotify)
}

notify.install = install

export const Notify = notify
