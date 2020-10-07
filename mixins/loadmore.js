import { debounce } from 'material/utils'

export default {
  data() {
    return {
      parentHeight: 0,
      contentHeight: 0,
    }
  },
  activated() {
    window.addEventListener('resize', this.resize, false)
  },
  // 当离开缓存页面时，绑定的resize事件去除掉
  // 因为缓存页面的el没有挂载在页面上，那么获取el的数据是不正确的
  deactivated() {
    window.removeEventListener('resize', this.resize, false)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize, false)
  },
  mounted() {
    // 这里需要留意，如果元素的display为none，那么是取不到高度的
    const el = this.$refs.scroll.$el
    this.contentHeight = el.offsetHeight
    this.parentHeight = el.parentNode.offsetHeight
    // 高度改变时需要重新获取parentHeight
    this.resize = debounce(() => {
      this.parentHeight = el.parentNode.offsetHeight
    }, 300, false)
    window.addEventListener('resize', this.resize, false)
  },
  methods: {
    reset() {
      this.$refs.scroll.reset()
      this.computedHeight()
    },
    computedHeight() {
      this.$nextTick(() => {
        const el = this.$refs.scroll.$el
        this.contentHeight = el.offsetHeight
        this.parentHeight = el.parentNode.offsetHeight
      })
    },
  },
}
