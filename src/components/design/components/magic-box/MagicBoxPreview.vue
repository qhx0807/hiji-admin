<template>
  <div class="design-magicbox-preview" :style="{}">
    <div class="design-magicbox-preview-nodata" v-show="value.items.length === 0">点击编辑魔方</div>
    <slot></slot>
    <div class="wrap"
      v-if="[1, 2, 3, 4].includes(value.template)"
      :class="[{'wrap1':value.template === 1},{'wrap1':value.template === 4},{'wrap2':value.template === 2},{'wrap3':value.template === 3}]">
      <img v-for="(item, index) in value.items" :src="item.imageurl" :key="index" alt="">
    </div>
    <div class="wrap wrap5" v-if="value.template === 5">
      <div class="left">
        <img :src="value.items[0].imageurl" alt="">
      </div>
      <div class="right">
        <div class="item">
          <img :src="value.items[1].imageurl" alt="">
        </div>
        <div class="item">
          <img :src="value.items[2].imageurl" alt="">
        </div>
      </div>
    </div>
    <div class="wrap wrap6" v-if="value.template === 6">
      <div class="left">
        <img :src="value.items[0].imageurl" alt="">
      </div>
      <div class="right">
        <div class="top">
          <img :src="value.items[1].imageurl" alt="">
        </div>
        <div class="bottom">
          <div class="item">
            <img :src="value.items[2].imageurl" alt="">
          </div>
          <div class="item">
            <img :src="value.items[3].imageurl" alt="">
          </div>
        </div>
      </div>
    </div>
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
    .wrap{
      font-size: 0;
      width: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .wrap1{
      flex-wrap: wrap;
      img{
        width: 50%;
      }
    }
    .wrap2{
      img{
        width: 33.3333%;
      }
    }
    .wrap3{
      img{
        width: 25%;
      }
    }
    .wrap5{
      .left{
        flex: 1;
        img{
          height: 100%;
        }
      }
      .right{
        flex: 1;
        display: flex;
        flex-direction: column;
        .item{
          flex: 1;
        }
      }
    }
    .wrap6{
      .left{
        flex: 1;
        img{
          height: 100%;
        }
      }
      .right{
        .top{
          flex: 1;
        }
        .bottom{
          flex: 1;
          display: flex;
          flex-direction: row;
          .item{
            flex: 1;
            width: 80px;
            img{
              width: 100%;
              height: 100%;
            }
          }
        }
      }

    }
  }
</style>
