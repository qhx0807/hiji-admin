<template>
  <div class="design-magicbox-preview" >
    <div class="design-magicbox-preview-nodata" v-show="value.items.length === 0">点击编辑魔方</div>
    <slot></slot>
    <ul :class="'template' + value.template" class="design-magicbox-preview-wrap" :style="{paddingLeft: value.padding+'px', paddingRight: value.padding+'px'}">
      <li v-for="(item, index) in value.items" :key="index" >
        <img :src="item.imageurl" alt="">
      </li>
    </ul>
  </div>
</template>
<script>
import previewMixins from '../../mixins/previewMixins'
export default {
  name: 'MagicBoxPreview',
  mixins: [previewMixins]
}
</script>
<style lang="less" scoped>
  .design-magicbox-preview{
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
    &-wrap{
      list-style: none;
      padding: 0px;
      overflow: hidden;
      box-sizing: border-box;
      li{
        float: left;
        width: 50%;
        font-size: 0;
      }
      img{
        width: 100%;
      }
      &.template1{
        li{
          width: 50%;
        }
      }
      &.template2{
        li{
          width: 33.3333%;
        }
      }
      &.template3{
        li{
          width: 25%;
        }
      }
      &.template4{
        li{
          width: 50%;
        }
      }
      &.template5{
        li{
          width: 50%;
        }
      }
      &.template6{
        li{
          width: 50%;
          &:nth-child(3){
            width: 25%;
          }
          &:nth-child(4){
            width: 25%;
          }
        }
      }
    }
  }
</style>
