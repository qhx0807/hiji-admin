<template>
  <div class="design-line" :style="{paddingLeft: value.padding, paddingRight: value.padding,}">
    <div class="design-line-border" :style="{borderTopColor: value.color,borderTopStyle: value.style}" ></div>
    <slot></slot>
  </div>
</template>
<script>
import previewMixins from '../../mixins/previewMixins'
export default {
  name: 'Line',
  mixins: [previewMixins]
}
</script>
<style lang="less" scoped>
  .design-line{
    padding: 20px 0;
    position: relative;
    cursor: grab;
    &-border{
      border: none;
      border-top-width: 1px;
      border-top-color: #eeeeee;
      border-top-style: solid;
    }
  }
</style>
