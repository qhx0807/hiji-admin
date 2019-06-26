<template>
  <div class="design-icon-preview">
    <div class="design-icon-preview-nodata" v-show="value.items.length === 0">点击编辑ICON</div>
    <div class="icon-box" v-show="value.items.length > 0" :style="{backgroundImage:'url('+value.bgimg+')'}">
      <div class="item" :style="{width: iconItemWidth}" v-for="(item, index) in value.items" :key="index">
        <img :src="item.imageurl" alt="">
        <p>{{item.name}}</p>
      </div>
    </div>
    <slot></slot>
  </div>
</template>
<script>
import previewMixins from '../../mixins/previewMixins'
export default {
  name: 'SwiperPreview',
  mixins: [previewMixins],
  computed: {
    iconItemWidth () {
      return (100 / this.value.rownum).toFixed(2) + '%'
    }
  }
}
</script>
<style lang="less" scoped>
  .design-icon-preview{
    position: relative;
    cursor: grab;
    box-sizing: border-box;
    &-nodata{
      min-height: 110px;
      width: 100%;
      background: #bdf;
      color: #fff;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-box{
      box-sizing: border-box;
      margin-top: -1px;
      padding: 15px;
      padding-bottom: 2px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      background-repeat: no-repeat;
      background-size: cover;
      background-color: #fff;
      .item{
        width: 20%;
        text-align: center;
        padding-bottom: 10px;
        height: 70px;
        img{
          height: 36px;
          width: 36px;
          margin: 0 auto;
        }
        p{
          font-size: 10px;
          margin-top: 1px;
          margin-bottom: 8px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
  }
</style>
