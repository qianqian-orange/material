<template>
  <scroll-view
    ref="scroll"
    :probe-type="probeType"
  >
    <div
      :style="{
        minHeight: `${parentHeight}px`,
        paddingBottom: dataSource.length && finish ? `${px2rem(112)}` : 0,
      }"
      class="list-container"
    >
      <slot />
      <elm-loading v-show="loading" />
      <elm-empty v-if="!dataSource.length && !loading" />
      <elm-finish v-show="dataSource.length && finish" />
    </div>
  </scroll-view>
</template>

<script>
import loadmoreMixin from 'material/mixins/loadmore'
import ScrollView from 'material/components/scrollView/index.vue'
import ElmFinish from 'material/components/finish/index.vue'
import px2rem from 'material/utils/px2rem'

export default {
  name: 'ListScrollView',
  components: {
    ScrollView,
    ElmFinish,
  },
  mixins: [loadmoreMixin],
  props: {
    dataSource: {
      type: Array,
      default: () => [],
    },
    probeType: {
      type: Number,
      default: 1,
    },
    interval: {
      type: Number,
      default: 300,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    finish: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      px2rem,
    }
  },
  watch: {
    dataSource() {
      this.reset()
    },
    loading() {
      this.reset()
    },
  },
  mounted() {
    this.$refs.scroll.on('scroll', ({ y }) => {
      if (this.parentHeight >= this.contentHeight) return
      if ((this.parentHeight + this.interval >= this.contentHeight + y) && !this.loading && !this.finish) {
        this.$emit('loadmore')
      }
    })
  },
  methods: {
    scrollTo({ x, y }, duration) {
      this.$refs.scroll.scrollTo({ x, y }, duration)
    },
    getScroll() {
      return this.$refs.scroll
    },
  },
}
</script>

<style lang="less" scoped>
  .list-container {
    box-sizing: border-box;
    position: relative;
  }

  .elm-finish {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
  }
</style>
