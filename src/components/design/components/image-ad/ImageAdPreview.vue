<template>
  <div class="design-imagead-preview">
    <div class="design-imagead-preview-nodata" v-show="value.items.length === 0">点击编辑图片广告</div>
    <slot></slot>
    <ul :class="'template'+value.template" class="image-ad-wrap" :style="wrapStyle">
      <li v-for="(item, index) in value.items" :key="index" :style="{margin: value.spacing/2 + 'px'}" >
        <img :src="item.imageurl" alt="">
      </li>
    </ul>
  </div>
</template>
<script>
import previewMixins from '../../mixins/previewMixins'
export default {
  name: 'ImageAdPreview',
  mixins: [previewMixins],
  computed: {
    wrapStyle () {
      return {
        paddingLeft: this.value.padding + 'px',
        paddingRight: this.value.padding + 'px',
        marginLeft: -this.value.spacing / 2 + 'px',
        marginRight: -this.value.spacing / 2 + 'px'
      }
    },
  }
}
</script>
<style lang="less" scoped>
  .design-imagead-preview{
    position: relative;
    cursor: grab;
    &-nodata{
      min-height: 120px;
      width: 100%;
      background: #bdf;
      color: #fff;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .image-ad-wrap{
      list-style: none;
      padding: 0px;
      overflow: hidden;
      box-sizing: border-box;
      li{
        float: left;
        width: 100%;
      }
      img{
        width: 100%;
      }
      &.template1{
        li{
          width: 100%;
        }
      }
      &.template2{
        li{
          width: 50%;
        }
      }
      &.template3{
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
      }
      &.template4{
        display: flex;
        flex-wrap: nowrap;
        flex-direction: row;
      }
    }
  }
</style>
