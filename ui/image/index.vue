<template>
  <div
    :class="[
      `${prefix}-container`,
      round ? `${prefix}--round` : '',
    ]"
    :style="styleObj"
  >
    <div :class="`${prefix}-content`">
      <img
        v-lazy="src"
        :alt="alt"
        @load="load"
        @error="handleError"
        @click="handleClick"
      >
      <div
        v-if="loading || error"
        :class="`${prefix}-icon`"
      >
        <elm-icon
          v-if="loading"
          name="image"
          :font-size="fontSize"
          color="#969799"
          stop-propagation
        />
        <elm-icon
          v-if="error"
          name="damage-image"
          :font-size="fontSize"
          color="#969799"
          stop-propagation
        />
      </div>
    </div>
  </div>
</template>

<script>
import px2rem from 'material/utils/px2rem'

export default {
  name: 'ElmImage',
  props: {
    src: {
      type: String,
      default: '',
    },
    alt: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '',
    },
    fontSize: {
      type: Number,
      default: 64,
    },
    round: {
      type: Boolean,
      default: false,
    },
    stopPropagation: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      prefix: 'elm-image',
      loading: true,
      error: false,
    }
  },
  computed: {
    styleObj() {
      const width = this.width ? (this.width.includes('%') ? this.width : px2rem(+this.width)) : '100%'
      let height, paddingTop
      if (this.height) {
        paddingTop = 0
        height = this.height.includes('%') ? this.height : px2rem(+this.height)
      } else {
        paddingTop = width
        height = 'auto'
      }
      return {
        width,
        height,
        paddingTop,
      }
    },
  },
  methods: {
    load() {
      this.loading = false
    },
    handleError() {
      this.loading = false
      this.error = true
    },
    handleClick(e) {
      if (this.stopPropagation) {
        e.stopPropagation()
      }
      this.$emit('click', e)
    },
  },
}
</script>
