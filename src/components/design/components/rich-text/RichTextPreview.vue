<template>
  <div class="design-richtext-preview">
    <slot></slot>
    <div class="nodata" v-show="!value.htmlstr">点击编辑富文本</div>
    <div class="richtext-wrap"
      :style="wrapStyle"
      v-html="value.htmlstr">
     </div>
  </div>
</template>
<script>
import previewMixins from '../../mixins/previewMixins'
export default {
  name: 'RichTextPreview',
  mixins: [previewMixins],
  computed: {
    wrapStyle () {
      return {
        paddingLeft: this.value.padding + 'px',
        paddingRight: this.value.padding + 'px',
        backgroundColor: this.value.bgcolor
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .design-richtext-preview{
    background-color: #ffffff;
    position: relative;
    cursor: grab;
    .nodata{
      height: 100px;
      width: 100%;
      background: #bdf;
      color: #fff;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .richtext-wrap{
      width: 100%;
      table{
        width: 100%;
        margin-bottom: 10px;
        border-collapse: collapse;
        display: table;
        width: auto!important;
        td,th{
          padding: 5px 10px;
          border: 1px solid #ddd;
        }
      }
    }
  }
</style>
