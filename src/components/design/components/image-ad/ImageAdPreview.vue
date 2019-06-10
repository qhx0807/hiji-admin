<template>
  <div class="design-imagead-preview">
    <div class="design-imagead-preview-nodata" v-show="value.items.length === 0">点击编辑图片广告</div>
    <slot></slot>
    <div class="design-imagead-preview-wrap1" v-show="value.template === 1" :style="{paddingLeft: value.padding+'px', paddingRight: value.padding+'px'}">
      <img v-for="(item, index) in value.items"
        :src="item.imageurl" alt=""
        :style="{marginBottom: value.spacing+'px'}">
    </div>
    <div class="design-imagead-preview-wrap2" v-show="value.template === 2" :style="{paddingLeft: value.padding+'px', paddingRight: value.padding+'px'}">
      <img v-for="(item, index) in value.items"
        :src="item.imageurl" alt=""
        :style="{marginBottom: value.spacing+'px', marginRight: value.padding+'px'}">
    </div>
    <div class="design-imagead-preview-wrap3" v-show="value.template === 3" :style="{paddingLeft: value.padding+'px', paddingRight: value.padding+'px'}">
      <img v-for="(item, index) in value.items"
        :src="item.imageurl" alt=""
        :style="{marginRight: value.spacing+'px', width: value.width+'%'}">
    </div>
  </div>
</template>
<script>
import previewMixins from '../../mixins/previewMixins'
export default {
  name: 'ImageAdPreview',
  mixins: [previewMixins]
}
</script>
<style lang="less" scoped>
  .design-imagead-preview{
    position: relative;
    cursor: grab;
    min-height: 110px;
    &-nodata{
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
      background: #bdf;
      color: #fff;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    &-wrap1{
      display: flex;
      flex-wrap: nowrap;
      flex-direction: column;
      img{
        width: 100%;
        &:last-child{
          margin-bottom: 0!important;
        }
      }
    }
    &-wrap2{
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
      overflow: hidden;
      img{
        width: 50%;
        &:nth-child(odd){
          margin-right: 0!important;
        }
      }
    }
    &-wrap3{
      width: 100%;
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
      overflow: hidden;
      img{
        &:last-child{
          margin-right: 0!important;
        }
      }
    }
  }
</style>
