<template>
  <div class="design-white-space" :style="{height: value.height + 'px', backgroundColor: value.bgcolor}">
    <slot></slot>
  </div>
</template>
<script>
import previewMixins from '../../mixins/previewMixins'
export default {
  name: 'WhitespacePreview',
  mixins: [previewMixins]
}
</script>
<style lang="less" scoped>
  .design-white-space{
    background-color: #ffffff;
    position: relative;
    cursor: grab;
  }
</style>
