<template>
  <div
    :class="[
      prefix,
      `${prefix}--${type}`,
      `${prefix}--${size}`,
      plain ? `${prefix}--plain` : '',
      disabled ? `${prefix}--disabled` : '',
      round ? `${prefix}--round` : '',
    ]"
    @click="handleClick"
  >
    <div :class="`${prefix}-content`">
      <slot name="icon" />
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'ElmButton',
  props: {
    type: {
      type: String,
      default: 'default',
    },
    size: {
      type: String,
      default: 'normal',
    },
    plain: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
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
      prefix: 'elm-button',
    }
  },
  methods: {
    handleClick(e) {
      if (this.stopPropagation) e.stopPropagation()
      this.$emit('click', e)
    },
  },
}
</script>
