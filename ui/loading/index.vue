<template>
  <div
    class="elm-loading"
    :style="{ textAlign: align }"
  >
    <div
      :style="styleObj"
      class="elm-loading-icon"
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
    <p class="elm-loading-text">
      {{ text }}
    </p>
  </div>
</template>

<script>
import px2rem from 'material/utils/px2rem'

export default {
  name: 'ElmLoading',
  props: {
    size: {
      type: Number,
      default: 60,
    },
    text: {
      type: String,
      default: '加载中...',
    },
    align: {
      type: String,
      default: 'center',
    },
  },
  computed: {
    styleObj() {
      return {
        width: px2rem(this.size),
        height: px2rem(this.size),
      }
    },
  },
}
</script>
