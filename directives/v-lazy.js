import Vue from 'vue'

let io = null

io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target
      img.src = img.dataset.src
      io.unobserve(img)
    }
  })
})

Vue.directive('lazy', {
  bind(el, binding) {
    el.dataset.src = binding.value
    io.observe(el)
  },
  update(el, binding) {
    el.dataset.src = binding.value
    if (el.src) el.src = binding.value
  },
  unbind(el) {
    io.unobserve(el)
  },
})

export default io
