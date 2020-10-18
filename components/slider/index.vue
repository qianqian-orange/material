<template>
  <div class="slider-wrapper">
    <slot />
    <slot
      name="dot"
      :current="current"
    />
  </div>
</template>

<script>
import Slider from 'material/lib/slider'

const strategy = {
  autoPlay() {
    this.slider.on('beforeScrollStart', () => {
      clearTimeout(this.id)
    })
    this.slider.on('scrollEnd', () => {
      this.autoGoNext()
    })
    this.autoGoNext()
  },
}

export default {
  name: 'Slider',
  props: {
    dataSource: {
      type: Array,
      default: () => [],
    },
    duration: {
      type: Number,
      default: 400,
    },
    loop: {
      type: Boolean,
      default: true,
    },
    // 当滚动超过边缘的时候会有一小段回弹动画
    // 注意bounce需要在loop为false的情况下才能工作
    bounce: {
      type: Boolean,
      default: true,
    },
    autoPlay: {
      type: Boolean,
      default: false,
    },
    // 定时器触发时间
    interval: {
      type: Number,
      default: 3000,
    },
    nested: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      id: null,
      current: 0,
    }
  },
  watch: {
    dataSource() {
      this.$nextTick(() => {
        this.slider.reset()
        this.$emit('reset')
      })
    },
    current(val) {
      this.$emit('page-change', val)
    },
  },
  mounted() {
    this.slider = new Slider({
      el: this.$el,
      duration: this.duration,
      loop: this.loop,
      bounce: this.bounce,
      nested: this.nested,
    })
    this.slider.on('scrollEnd', () => {
      this.current = this.slider.getCurrentPage()
    })
    if (this.autoPlay) strategy.autoPlay.call(this)
  },
  beforeDestroy() {
    clearInterval(this.id)
    if (this.slider) this.slider.destroy()
  },
  activated() {
    if (this.autoPlay) this.autoGoNext()
  },
  deactivated() {
    clearTimeout(this.id)
  },
  methods: {
    autoGoNext() {
      clearTimeout(this.id)
      this.id = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    },
    jump(index) {
      this.slider.jump(index)
    },
  },
}
</script>

<style lang="less" scoped>
  .slider-wrapper {
    position: relative;
    overflow: hidden;
    width: 100%;
  }
</style>
