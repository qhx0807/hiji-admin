<template>
  <div class="design-notice-preview" :style="{backgroundColor: value.bgcolor}">
    <slot></slot>
    <Icon size="18" :color="value.color" type="ios-notifications-outline" />
    <p :style="{color: value.color}" class="design-notice-preview-content">{{value.content}}</p>
  </div>
</template>
<script>
import previewMixins from '../../mixins/previewMixins'
export default {
  name: 'NoticePreview',
  mixins: [previewMixins]
}
</script>
<style lang="less" scoped>
  .design-notice-preview{
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    &-content{
      font-size: 12px;
      padding-left: 2px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
</style>
