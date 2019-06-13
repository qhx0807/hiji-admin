<template>
  <div class="design-share-preview">
    <h6>分享功能</h6>
    <p>页面上不会显示此模块</p>
    <slot></slot>
  </div>
</template>
<script>
import previewMixins from '../../mixins/previewMixins'
export default {
  name: 'SharePreview',
  mixins: [previewMixins]
}
</script>
<style lang="less" scoped>
  .design-share-preview{
    background-color: #bdf;
    position: relative;
    cursor: grab;
    height: 50px;
    box-sizing: border-box;
    padding-top: 6px;
    h6{
      font-size: 14px;
      font-weight: normal;
      color: #fff;
      text-align: center;
    }
    p{
      font-size: 10px;
      text-align: center;
      color: rgba(255, 255, 255, .8);
    }
  }
</style>
