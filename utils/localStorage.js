import { Notify } from 'material/ui'

export function set(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch (e) {
    Notify({ type: 'danger', message: '数据异常' })
  }
}

export function get(key) {
  try {
    return JSON.parse(localStorage.getItem(key))
  } catch (e) {
    Notify({ type: 'danger', message: '数据异常' })
    return null
  }
}

export function remove(key) {
  return localStorage.removeItem(key)
}

export function clear() {
  localStorage.clear()
}
