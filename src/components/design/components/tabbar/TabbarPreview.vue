<template>
  <div class="design-tabbar-preview">
    <div class="nodata" v-show="value.items.length === 0">点击编辑标签栏</div>
    <slot></slot>
    <div class="tabbar-wrap" v-show="value.items.length > 0" :style="wrapStyle">
      <span v-for="(item, index) in value.items" :key="index">
        <img :src="item.imageurl" alt="">
      </span>
    </div>
  </div>
</template>
<script>
import previewMixins from '../../mixins/previewMixins'
export default {
  name: 'TabbarPreview',
  mixins: [previewMixins],
  computed: {
    wrapStyle () {
      return {
        backgroundColor: this.value.bgcolor,
        backgroundImage: `url(${this.value.bgimg}`,
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .design-tabbar-preview{
    background-color: #ffffff;
    position: relative;
    cursor: grab;
    .nodata{
      height: 50px;
      line-height: 50px;
      text-align: center;
      background: #bdf;
      color: #fff;
      font-size: 14px;
    }
    .tabbar-wrap{
      height: 50px;
      display: flex;
      flex-wrap: nowrap;
      flex-direction: row;
      border-top: 1px solid #e5e5e5;
      background-repeat: no-repeat;
      background-size: cover;
      span{
        height: 100%;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
          max-height: 100%;
        }
      }
    }
  }
</style>
