<template>
  <div class="design-goods-preview" :style="{}">
    <div class="design-goods-preview-warp">
      <ul :style="{paddingLeft: value.padding+'px', paddingRight: value.padding+'px', marginLeft: -value.spacing/2 + 'px', marginRight: -value.spacing/2 + 'px'}"
          :class="{'templ6ul': value.listStyle === 6}"
        >
        <li
          v-for="(item, index) in value.items"
          :key="index"
          :class="'templ'+value.listStyle">
          <a :style="{margin: value.spacing/2 + 'px'}"
            :class="[{'shadow': value.itemStyle === 2}, {'rect': value.itemStyle === 3}, {'trans': value.itemStyle === 4}]"
            >
            <div class="goods-photo">
              <div class="goods-image-wrap" :style="{paddingTop: imgscale}">
                <div class="goods-img" :style="{backgroundImage: 'url('+item.img+')'}"></div>
              </div>
              <div class="goods-badge" v-show="value.showContent.includes('badge')">
                <div class="newgoods" v-show="value.badgeStyle === 'new-arrival'">新品</div>
                <div class="hotgoods" v-show="value.badgeStyle === 'hot-sale'">热卖</div>
                <div class="newgoods-o" v-show="value.badgeStyle === 'new'">NEW</div>
                <div class="newgoods-o" v-show="value.badgeStyle === 'hot'">
                  <img src="http://cdn.cqyyy.cn/pic/20190611142118.png" alt="">
                </div>
                <div class="custom" v-show="value.badgeStyle === 'custom'">
                  <img :src="value.badgeImg" alt="">
                </div>
              </div>
            </div>
            <div class="goods-info">
              <div class="goods-info-title">
                <h3 :class="{'fontBold':value.textStyle === 2}" v-show="value.showContent.includes('name')">{{item.name}}</h3>
                <p class="addr" v-show="value.showContent.includes('address')">地址：{{item.address}}</p>
                <p class="addr" v-show="value.showContent.includes('desc')">{{item.desc}}</p>
                <p class="tags" v-show="value.showContent.includes('tags')">
                  <i>团</i>
                  <span v-for="(tag, i) in item.tags" :key="index">{{tag}}</span>
                </p>
              </div>
              <div class="goods-info-price">
                <div class="price-info">
                  <span class="sale-price" v-show="value.showContent.includes('disprice')">
                    <span class="price-tag">￥</span>{{item.disprice}}
                  </span>
                  <span class="orprice" v-show="value.showContent.includes('orprice')">
                    ￥{{item.orprice}}
                  </span>
                </div>
                <div class="buy-btn-box" v-show="value.showContent.includes('buybtn')">
                  <div class="price-buybtn-1" v-if="value.btnStyle === 1"><Icon type="ios-cart-outline" /></div>
                  <div class="price-buybtn-2" v-if="value.btnStyle === 2"><Icon type="ios-add-circle-outline" /></div>
                  <div class="price-buybtn-3" v-if="value.btnStyle === 3"><button>{{value.btnText}}</button></div>
                  <div class="price-buybtn-4" v-if="value.btnStyle === 4"><button>{{value.btnText}}</button></div>
                  <div class="price-buybtn-5" v-if="value.btnStyle === 5"><Icon type="ios-add-circle" /></div>
                  <div class="price-buybtn-6" v-if="value.btnStyle === 6"><Icon type="ios-cart-outline" /></div>
                  <div class="price-buybtn-7" v-if="value.btnStyle === 7"><button>{{value.btnText}}</button></div>
                  <div class="price-buybtn-8" v-if="value.btnStyle === 8"><button>{{value.btnText}}</button></div>
                </div>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
    <slot></slot>
  </div>
</template>
<script>
import previewMixins from '../../mixins/previewMixins'
export default {
  name: 'O2Preview',
  mixins: [previewMixins],
  computed: {
    imgscale () {
      let p = '100%'
      switch (this.value.imgScale) {
        case 1:
          p = '100%'
          break
        case 2:
          p = '66.667%'
          break
        case 3:
          p = '133.333%'
          break
        case 4:
          p = '56.25%'
          break
      }
      return p
    }
  }
}
</script>
<style lang="less" scoped>
  .design-goods-preview{
    position: relative;
    cursor: grab;
    &-nodata{
      width: 100%;
      img{
        width: 100%;
      }
    }
    &-warp{
      ul{
        list-style: none;
        padding: 0px;
        margin-left: -5px;
        margin-right: -5px;
        overflow: hidden;
        box-sizing: border-box;
        &::-webkit-scrollbar{
          display: none;
        }
        &.templ6ul{
          overflow-x: auto;
          overflow-y: hidden;
          display: -webkit-box;
          display: -moz-box;
          display: -ms-flexbox;
          display: flex;
          flex-wrap: nowrap;
          -webkit-overflow-scrolling: touch;
        }
        li{
          width: 50%;
          float: left;
          a{
            margin: 5px;
            pointer-events: none;
            display: block;
            position: relative;
            min-height: 50px;
            color: #333;
            background-color: #fff;
            box-sizing: border-box;
            overflow: hidden;
            &.shadow{
              box-shadow: 0 2px 8px rgba(93,113,127,.08);
            }
            &.rect{
              border: 1px solid #e6e6e6;
            }
            &.trans{
              background-color: transparent;
            }
            .goods-photo{
              position: relative;
              .goods-image-wrap{
                position: relative;
                overflow: hidden;
                max-height: 500px;
                padding-top: 100%;
                .goods-img{
                  background-size: cover;
                  width: 100%;
                  background-position: 50%;
                  background-repeat: no-repeat;
                  position: absolute;
                  top: 0;
                  left: 0;
                  bottom: 0;
                  right: 0;
                }
              }
              .goods-badge{
                position: absolute;
                left: 5px;
                top: 5px;
                color: #fff;
                font-size: 13px;
                .newgoods{
                  width: 40px;
                  background-color: #f44;
                  height: 20px;
                  border-top-right-radius: 10px;
                  border-bottom-right-radius: 10px;
                  padding-left: 6px;
                  line-height: 20px;
                }
                .newgoods-o{
                  width: 32px;
                  background-color: #f44;
                  height: 32px;
                  border-bottom-left-radius: 6px;
                  border-bottom-right-radius: 6px;
                  line-height: 32px;
                  font-size: 12px;
                  text-align: center;
                }
                .hotgoods{
                  background-color: #f44;
                  width: 20px;
                  height: 40px;
                  text-align: center;
                  border-radius: 2px;
                }
                .hotgoods-o{
                  img{
                    height: 40px;
                    width: 40px;
                  }
                }
              }
            }
            .goods-info{
              padding: 0 10px;
              position: relative;
              &-title{
                text-align: left;
                margin: 10px 0 0;
                h3{
                  font-weight: normal;
                  height: 40px;
                  max-height: 40px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  margin-bottom: 5px;
                  font-size: 14px;
                  color: rgb(55, 55, 55);
                  line-height: 20px;
                  &.fontBold{
                    font-weight: 600;
                  }
                }
                .addr{
                  font-size: 12px;
                  line-height: 16px;
                  color: #999;
                  height: 16px;
                  word-break: break-all;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 1;
                  -webkit-box-orient: vertical;
                }
                .tags{
                  font-size: 12px;
                  color: #999;
                  word-break: break-all;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 1;
                  -webkit-box-orient: vertical;
                  padding-top: 3px;
                  i{
                    display: inline-block;
                    background-color: #F54820;
                    color: #fff;
                    font-style: normal;
                    font-size: 13px;
                    padding: 3px 3px;
                    line-height: 1;
                  }
                  span{
                    line-height: 1;
                    display: inline-block;
                    padding: 3px 4px;
                    border: 1px solid #e5e5e5;
                    margin-right: 5px;
                  }
                }
              }
              &-price{
                position: relative;
                width: 100%;
                .price-info{
                  font-weight: normal;
                  padding-right: 25px;
                  height: 40px;
                  display: flex;
                  align-items: center;
                  flex-wrap: wrap;
                  align-content: center;
                  vertical-align: baseline;
                  .sale-price{
                    color: #f44;
                    height: 16px;
                    line-height: 16px;
                    font-size: 16px;
                    word-break: break-all;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    .price-tag{
                      font-size: 12px;
                      margin-right: 2px;
                    }
                  }
                  .orprice{
                    height: 12px;
                    line-height: 12px;
                    font-size: 12px;
                    color: #999;
                    margin-top: 2px;
                    font-weight: 400;
                    text-decoration: line-through;
                    margin-left: 5px;
                  }
                }
                .buy-btn-box{
                  position: absolute;
                  right: 0;
                  top: 10px;
                  .price-buybtn-1{
                    color: #f44;
                    border-radius: 50%;
                    width: 19px;
                    height: 19px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #f44;
                    i{
                      font-size: 15px;
                      line-height: 1;
                      font-weight: 600;
                    }
                  }
                  .price-buybtn-2{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #f44;
                    i{
                      font-size: 18px;
                      font-weight: bold;
                    }
                  }
                  .price-buybtn-3{
                    button{
                      outline: none;
                      border: none;
                      line-height: 18px;
                      height: 20px;
                      font-size: 12px;
                      padding: 0 5px;
                      background-color: rgb(255, 68, 68);
                      border-radius: 10px;
                      color: #fff;
                    }
                  }
                  .price-buybtn-4{
                    button{
                      outline: none;
                      border: none;
                      line-height: 18px;
                      height: 20px;
                      font-size: 12px;
                      padding: 0 5px;
                      background-color: #fff;
                      color: rgb(255, 68, 68);
                      border: 1px solid #f44;
                    }
                  }
                  .price-buybtn-5{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #f44;
                    i{
                      font-size: 19px;
                    }
                  }
                  .price-buybtn-6{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #f44;
                    i{
                      font-size: 19px;
                      font-weight: bold;
                    }
                  }
                  .price-buybtn-7{
                    button{
                      outline: none;
                      border: none;
                      line-height: 18px;
                      height: 20px;
                      font-size: 12px;
                      padding: 0 5px;
                      background-color: rgb(255, 68, 68);
                      color: #fff;
                    }
                  }
                  .price-buybtn-8{
                    button{
                      outline: none;
                      border: none;
                      line-height: 18px;
                      height: 20px;
                      font-size: 12px;
                      padding: 0 5px;
                      background-color: #fff;
                      color: rgb(255, 68, 68);
                      border: 1px solid #f44;
                      border-radius: 10px;
                    }
                  }
                }
              }
            }
          }
          &.templ1{ // 大图模式
            width: 100%;
            .goods-info-title{
              h3{
                height: 20px;
                max-height: 20px;
                line-height: 20px;
              }
            }
          }
          &.templ2{ // 一行两个
            float: left;
            width: 50%;
          }
          &.templ3{ // 一行三个
            float: left;
            width: 33.333%;
          }
          &.templ4{ // 详细列表
            width: 100%;
            .goods-photo{
              float: left;
              margin-right: 10px;
              min-height: auto;
              width: 145px;
              height: 145px;
            }
            .goods-info{
              padding: 0 10px 0 0;
              overflow: hidden;
              margin-left: 155px;
              height: 145px;
            }
            .goods-info-price{
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
            }
          }
          &.templ5{ // 一大两小
            float: left;
            width: 50%;
            &:nth-child(3n+1){
              width: 100%;
              .goods-info-title{
                h3{
                  height: 20px;
                  max-height: 20px;
                  line-height: 20px;
                }
              }
            }
          }
          &.templ6{ // 横向滑动
            box-flex: 0;
            flex: 0 0 30%;
            flex: 0 0 30%;
            width: 30%;
            float: none;
          }
        }
      }
    }
  }
</style>
