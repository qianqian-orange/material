<template>
  <div
    :style="{
      position,
      backgroundColor,
    }"
    class="elm-mask"
    @click.self.stop="handleClick"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'ElmMask',
  props: {
    position: {
      type: String,
      default: 'absolute',
    },
    backgroundColor: {
      type: String,
      default: 'rgba(0,0,0,.3)',
    },
  },
  methods: {
    handleClick() {
      this.$emit('click')
    },
  },
}
</script>
