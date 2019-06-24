<template>
  <div class="design-landscape-review" >
    <slot></slot>
    <div class="nodata" :style="{backgroundImage: 'url('+value.imgurl+')'}">
      <h6>点击编辑压屏窗</h6>
      <p>手机上会在打开页面时弹窗</p>
    </div>
  </div>
</template>
<script>
import previewMixins from '../../mixins/previewMixins'
export default {
  name: 'LandscapePreview',
  mixins: [previewMixins]
}
</script>
<style lang="less" scoped>
  .design-landscape-review{
    background-color: #ffffff;
    position: relative;
    cursor: grab;
    .nodata{
      height: 100px;
      width: 100%;
      background: #bdf;
      color: #fff;
      font-size: 14px;
      text-align: center;
      padding-top: 30px;
      background-repeat: no-repeat;
      background-size: contain;
      h6{
        font-size: 14px;
        font-weight: normal;
      }
      p{
        font-size: 12px;
      }
    }
  }
</style>
