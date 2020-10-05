<template>
  <span
    :style="styleObj"
    class="elm-tag"
  >
    <slot />
  </span>
</template>

<script>
import px2rem from 'material/utils/px2rem'

export default {
  name: 'ElmTag',
  props: {
    color: {
      type: String,
      default: '#007fff',
    },
    fontSize: {
      type: Number,
      default: 24,
    },
  },
  computed: {
    styleObj() {
      return {
        fontSize: px2rem(this.fontSize),
        color: this.color,
      }
    },
  },
}
</script>
