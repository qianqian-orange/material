<template>
  <div class="elm-empty">
    <img
      class="elm-empty-bg"
      :src="require('./image/bg.png')"
      alt="backgroundImage"
    >
    <p class="elm-empty-title">
      {{ title }}
    </p>
  </div>
</template>

<script>
export default {
  name: 'ElmEmpty',
  props: {
    title: {
      type: String,
      default: '暂无相关数据',
    },
  },
}
</script>
