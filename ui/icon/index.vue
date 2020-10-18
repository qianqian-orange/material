<template>
  <div
    v-if="name === 'loading'"
    class="elm-icon elm-icon-loading"
    :style="{
      width: px2rem(fontSize),
      height: px2rem(fontSize),
      color,
    }"
  >
    <!-- 前两个参数指定图标的x,y 后两个参数指定图标的width, height -->
    <svg viewBox="0 0 50 50">
      <circle
        cx="25"
        cy="25"
        r="20"
      />
    </svg>
  </div>
  <i
    v-else
    :style="styleObj"
    :class="icon"
    class="elm-icon iconfont"
    @click="handleClick"
  />
</template>

<script>
import px2rem from 'material/utils/px2rem'

export default {
  name: 'ElmIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
    fontSize: {
      type: Number,
      default: 24,
    },
    color: {
      type: String,
      default: '#fff',
    },
    rotate: {
      type: Number,
      default: 0,
    },
    stopPropagation: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      icons: {
        search: 'icon-search',
        clear: 'icon-clear',
        arrow: 'icon-arrowon',
        location: 'icon-location',
        filter: 'icon-shaixuan',
        star: 'icon-star',
        omit: 'icon-shenglvehao',
        success: 'icon-success',
        trash: 'icon-laji2',
        car: 'icon-cart',
        increase: 'icon-add',
        decrease: 'icon-remove',
        'solid-arrow': 'icon-arrowup',
        good: 'icon-good',
        chat: 'icon-liaotian',
        loading: 'icon-loading',
        image: 'icon-image',
        'damage-image': 'icon-financial_fail',
      },
      px2rem,
    }
  },
  computed: {
    icon() {
      return this.icons[this.name] || this.name
    },
    styleObj() {
      return {
        fontSize: px2rem(this.fontSize),
        color: this.color,
        transform: `rotate(${this.rotate}deg)`,
      }
    },
  },
  methods: {
    handleClick(e) {
      if (this.stopPropagation) e.stopPropagation()
      this.$emit('click', e)
    },
  },
}
</script>
