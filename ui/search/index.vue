<template>
  <div class="elm-search">
    <input
      ref="input"
      :value="value"
      class="elm-search-input"
      type="text"
      :placeholder="placeholder"
      @focus="focus"
      @input="onInput"
      @compositionstart="onCompositionStart"
      @compositionend="onCompositionEnd"
    >
    <span class="elm-search-icon search">
      <elm-icon
        name="search"
        color="#999"
        :font-size="36"
      />
    </span>
    <span
      v-show="value"
      class="elm-search-icon clear"
      @click.stop="clear"
    >
      <elm-icon
        name="clear"
        color="#999"
        :font-size="36"
      />
    </span>
  </div>
</template>

<script>
import { throttle } from 'material/utils'

export default {
  name: 'Search',
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '请输入...',
    },
  },
  methods: {
    onInput: throttle(function (e) {
      if (e.target.composing) return
      this.$emit('input', e.target.value)
    }, 300),
    onCompositionStart(e) {
      e.target.composing = true
    },
    onCompositionEnd(e) {
      e.target.composing = false
      const event = new Event('input')
      this.$refs.input.dispatchEvent(event)
    },
    clear() {
      this.$emit('clear')
      this.$emit('input', '')
    },
    blur() {
      this.$refs.input.blur()
    },
    focus() {
      this.$emit('focus')
    },
  },
}
</script>
