<template>
  <div class="design-search-preview" >
    <slot></slot>
    <div class="wrap" :style="{backgroundColor: value.bgcolor, backgroundImage: 'url('+value.bgimg+')'}">
      <div class="prefix" v-show="value.prefix" :style="{color: value.color}">邻水</div>
      <div class="search">
        <Icon type="ios-search-outline" />
        <input type="text" :placeholder="value.placeholder">
      </div>
      <div class="append" v-show="value.scan" :style="{color: value.color}">
        <Icon type="md-qr-scanner" />
      </div>
    </div>
  </div>
</template>
<script>
import previewMixins from '../../mixins/previewMixins'
export default {
  name: 'SearchPreview',
  mixins: [previewMixins]
}
</script>
<style lang="less" scoped>
  .design-search-preview{
    background-color: #ffffff;
    position: relative;
    cursor: grab;
    .wrap{
      height: 60px;
      background-color: #fff;
      display: flex;
      background-repeat: no-repeat;
      background-size: cover;
      z-index: 9;
      flex-direction: row;
      padding: 0 12px;
      .prefix{
        width: 30px;
        height: 100%;
        line-height: 60px;
        text-align: center;
        font-size: 12px;
        color: #888;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .search{
        flex: 1;
        height: 100%;
        display: flex;
        align-items: center;
        position: relative;
        padding: 0 5px;
        transition: all .3s ease;
        i{
          font-size: 18px;
          position: absolute;
          left: 10px;
          top: 20px;
        }
        input{
          background-color: #fff;
          height: 30px;
          outline: none;
          border: 1px solid #e5e5e5;
          border-radius: 15px;
          width: 100%;
          padding-left: 30px;
        }
      }
      .append{
        width: 30px;
        height: 100%;
        line-height: 60px;
        font-size: 20px;
        color: #888;
        text-align: center;
      }
    }
  }
</style>
