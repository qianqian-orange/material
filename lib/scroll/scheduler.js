import { debounce } from 'material/utils'

const queue = []

const resize = debounce(() => {
  queue.forEach((scroll) => {
    scroll.reset()
  })
}, 300, false)

// 在手机端，由于页面的高度很容易改变，所以需要监听resize事件触发reset
// 这样才能恢复正常的滚动效果
window.addEventListener('resize', resize, false)

export function add(scroll) {
  if (queue.includes(scroll)) return
  queue.push(scroll)
}

export function remove(scroll) {
  const index = queue.findIndex(item => item === scroll)
  if (index !== -1) queue.splice(index, 1)
}

export function destroy() {
  window.removeEventListener('resize', resize, false)
}
