<template>
  <elm-mask
    position="fixed"
    background-color="#000"
  >
    <div class="picture-priview-header">
      <span>{{ current + 1 }}/{{ dataSource.length }}</span>
      <elm-button @click="close">
        关闭
      </elm-button>
    </div>
    <slider
      ref="slider"
      :data-source="dataSource"
      :loop="false"
      bounce
      @page-change="pageChange"
      @reset="reset"
    >
      <ul
        ref="list"
        class="picture-preview-list"
      >
        <li
          v-for="item in dataSource"
          :key="item"
          class="picture-preview-item"
        >
          <img
            :src="item"
            alt="preview-image"
          >
        </li>
      </ul>
    </slider>
  </elm-mask>
</template>

<script>
import Slider from 'material/components/slider/index.vue'

export default {
  name: 'PicturePreview',
  components: {
    Slider,
  },
  props: {
    dataSource: {
      type: Array,
      default: () => ([]),
    },
    active: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      current: 0,
    }
  },
  watch: {
    active(val) {
      this.current = val
    },
    dataSource() {
      this.$refs.list.style.width = '100%'
    },
  },
  mounted() {
    this.jump(this.active)
  },
  methods: {
    close() {
      this.$emit('close')
    },
    pageChange(val) {
      this.current = val
    },
    reset() {
      this.jump(this.active)
    },
    jump(index) {
      this.$refs.slider.jump(index)
    },
  },
}
</script>

<style lang="less" scoped>
  .slider-wrapper {
    height: 100%;
  }

  .picture-priview-header {
    position: absolute;
    .top(40);
    left: 0;
    z-index: 999;
    width: 100%;
    color: #fff;
    .font-size(32);
    .line-height(66);
    text-align: center;

    .elm-button {
      position: absolute;
      top: 0;
      .right(40);
      color: #fff;
      background-color: rgba(0, 0, 0, .3);
    }
  }

  .picture-preview-list {
    overflow: hidden;
    width: 100%;
    height: 100%;
  }

  .picture-preview-item {
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    color: #fff;
    .font-size(36);
    font-weight: 700;

    img {
      width: 100%;
    }
  }
</style>
