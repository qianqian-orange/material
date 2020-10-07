<template>
  <div
    class="elm-finish"
  >
    {{ title }}
  </div>
</template>

<script>
export default {
  name: 'ElmFinish',
  props: {
    title: {
      type: String,
      default: '我是有底线的',
    },
  },
}
</script>

<style lang="less" scoped>
  .elm-finish {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .padding(32, 30, 32, 30);
    color: #999;
    .font-size(28);
    font-weight: 200;
    .line-height(48);

    &::after,
    &::before {
      content: "";
      flex-basis: 36%;
      height: 1px;
      background-color: #ccc;
    }
  }
</style>
