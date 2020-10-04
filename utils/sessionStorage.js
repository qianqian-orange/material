import { Notify } from 'material/ui'

export function set(key, val) {
  try {
    sessionStorage.setItem(key, JSON.stringify(val))
  } catch (e) {
    Notify({ type: 'danger', message: '数据异常' })
  }
}

export function get(key) {
  try {
    return JSON.parse(sessionStorage.getItem(key))
  } catch (e) {
    Notify({ type: 'danger', message: '数据异常' })
    return null
  }
}

export function remove(key) {
  return sessionStorage.removeItem(key)
}

export function clear() {
  sessionStorage.clear()
}
