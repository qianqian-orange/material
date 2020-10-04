<template>
  <i
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
        'solid-arrow': 'icon-arrowdown-copy',
      },
    }
  },
  computed: {
    icon() {
      return this.icons[this.name] ? this.icons[this.name] : this.name
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
