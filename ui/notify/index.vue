<template>
  <div :class="[prefix, `${prefix}-${type}`].join(' ')">
    <slot />
  </div>
</template>

<script>
import { delay } from 'material/utils'

export default {
  name: 'ElmNotify',
  props: {
    type: {
      type: String,
      default: 'danger',
    },
    duration: {
      type: Number,
      default: 3000,
    },
    value: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      hidden: false,
      prefix: 'elm-notify',
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.$el.style.display = 'block'
        this.transition()
      }
    },
  },
  mounted() {
    this.init()
    if (this.value) {
      this.transition()
      return
    }
    this.$el.style.display = 'none'
  },
  beforeDestroy() {
    this.$el.removeEventListener('transitionend', this.bindTransitionEnd, false)
  },
  methods: {
    transitionEnd() {
      if (this.hidden) {
        this.$el.style.display = 'none'
        this.$emit('input', false)
      }
    },
    init() {
      this.bindTransitionEnd = this.transitionEnd.bind(this)
      this.$el.addEventListener('transitionend', this.bindTransitionEnd, false)
    },
    transition() {
      setTimeout(async () => {
        this.hidden = false
        this.$el.style.transform = 'translateY(0)'
        await delay(this.duration)
        this.hidden = true
        this.$el.style.transform = 'translateY(-100%)'
      })
    },
  },
}
</script>
