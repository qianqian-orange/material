<template>
  <div
    class="elm-loading"
    :style="{ textAlign: align }"
  >
    <elm-icon
      name="loading"
      :font-size="size"
      :color="variable.elmInfoColor"
      stop-propagation
    />
    <p class="elm-loading-text">
      {{ text }}
    </p>
  </div>
</template>

<script>
import variable from 'material/ui/common/var.less'

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
  data() {
    return {
      variable,
    }
  },
}
</script>
