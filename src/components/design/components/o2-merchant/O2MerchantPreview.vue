<template>
  <div class="design-o2merchant">
    <slot></slot>
    <div class="nodata" v-show="value.items.length === 0">点击编辑商户页入口</div>
    <ul class="design-o2merchant-preview">
      <li v-for="(item, index) in value.items" :key="index">
        <div class="left" :style="{backgroundImage: 'url('+item.img+')'}">
        </div>
        <div class="right">
          <h2 class="name">{{item.name}}</h2>
          <p class="address">
            地址：{{item.addres}}
            咨询电话：{{item.tel}}
          </p>
          <div class="tags" v-if="item.tags">
            <span class="badge">团</span>
            <span class="tag" v-for="tag in item.tags" :key="item">{{tag}}</span>
          </div>
          <div class="menus" v-if="item.menus">
            <span class="menu">{{item.menus}}</span>
          </div>
          <div class="buybtn">立即抢购</div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import previewMixins from '../../mixins/previewMixins'
export default {
  name: 'Line',
  mixins: [previewMixins]
}
</script>
<style lang="less" scoped>
  .design-o2merchant{
    position: relative;
    cursor: grab;
    .nodata{
      height: 80px;
      text-align: center;
      line-height: 80px;
      background-color: #BBDDFF;
      color: #fff;
    }
    &-preview{
      list-style: none;
      padding: 0;
      margin: 0;
      li{
        height: 120px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        box-sizing: border-box;
        padding: 0 10px;
        position: relative;
        &:last-child{
          margin-bottom: 0;
        }
        .left{
          width: 120px;
          height: 100%;
          flex-shrink: 0;
          background-size: cover;
          background-repeat: no-repeat;
          border-radius: 5px;
          img{
            max-width: 100%;
            max-height: 100%;
          }
        }
        .right{
          flex: 1;
          padding: 5px;
          position: relative;
          .name{
            font-size: 14px;
            color: #444;
          }
          .address{
            font-size: 12px;
            color: #666;
            margin-top: 5px;
            line-height: 16px;
            height: 32px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .tags{
            padding-top: 8px;
            height: 25px;
            overflow: hidden;
            text-overflow: ellipsis;
            .badge{
              background-color: #F54820;
              color: #fff;
              font-size: 10px;
              padding: 2px 3px;
              line-height: 1;
            }
            .tag{
              font-size: 10px;
              display: inline-block;
              padding: 2px 3px;
              border: 1px solid #f5f5f5;
              border-radius: 2px;
              margin-right: 4px;
              line-height: 1;
            }
          }
          .menus{
            position: absolute;
            left: 0;
            bottom: 0;
            right: 0;
            height: 30px;
            padding: 0 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding-right: 50px;
            padding-top: 10px;
            .menu{
              color: #F65E3D;
              font-size: 10px;
            }
          }
          .buybtn{
            position: absolute;
            bottom: 4px;
            right: 0px;
            width: 50px;
            height: 16px;
            color: #fff;
            border-radius: 5px;
            font-size: 10px;
            text-align: center;
            background-image: linear-gradient(top, #F55A44, #EC3549);
          }
        }
      }
    }
  }
</style>
