<template>
  <div
    ref="scroll-container"
    :style="{
      display: scrollX ? 'inline-block' : 'block',
    }"
  >
    <slot />
  </div>
</template>

<script>
import Scroll from 'material/lib/scroll'
import { add, remove } from 'material/lib/scroll/scheduler'

export default {
  name: 'ScrollView',
  props: {
    probeType: {
      type: Number,
      default: 0,
    },
    click: {
      type: Boolean,
      default: true,
    },
    stopPropagation: {
      type: Boolean,
      default: false,
    },
    scrollX: {
      type: Boolean,
      default: false,
    },
    scrollY: {
      type: Boolean,
      default: true,
    },
    nested: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scroll: null,
    }
  },
  // 当使用keep-alive组件时，scroll会被缓存, 当切回到其它页面时，由于el元素没有挂载在页面上
  // 那么如果执行reset函数的话，那么获取的数据是不正确的，导致滚动出现问题，所以需要手动移除
  // 在需要的时候在手动插入添加即可
  activated() {
    add(this.scroll)
  },
  deactivated() {
    remove(this.scroll)
  },
  mounted() {
    this.scroll = new Scroll({
      el: this.$refs['scroll-container'],
      probeType: this.probeType,
      click: this.click,
      stopPropagation: this.stopPropagation,
      scrollX: this.scrollX,
      scrollY: this.scrollY,
      nested: this.nested,
    })
  },
  beforeDestroy() {
    this.scroll.destroy()
  },
  methods: {
    reset() {
      this.$nextTick(() => {
        this.scroll.reset()
      })
    },
    getCurrent() {
      return this.scroll.getCurrent()
    },
    scrollTo({ x, y }, duration) {
      this.scroll.scrollTo({ x, y }, duration)
    },
    scrollToElement(el, duration = 0) {
      this.scroll.scrollToElement(el, duration)
    },
    on(type, fn) {
      this.scroll.on(type, fn)
    },
    off(type, fn) {
      this.scroll.off(type, fn)
    },
  },
}
</script>
