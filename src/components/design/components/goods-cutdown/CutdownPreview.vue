<template>
  <div class="design-timelimit-discount" :style="{}">
    <slot></slot>
    <div class="design-timelimit-discount-preview">
      <ul
        :class="{'templ6ul': value.listStyle === 6}"
        :style="{paddingLeft: value.padding+'px', paddingRight: value.padding+'px', marginLeft: -value.spacing/2 + 'px', marginRight: -value.spacing/2 + 'px'}">
        <li v-for="(item, index) in value.goodsItem" :key="index" :class="'template'+value.listStyle">
          <a :style="{margin: value.spacing/2 + 'px'}"
            :class="[{'shadow': value.itemStyle === 2}, {'rect': value.itemStyle === 3}, {'trans': value.itemStyle === 4}]"
            >
            <div class="goods-layout-photo">
              <div class="goods-layout-photo-image-wrap" :style="{paddingTop: imgscale}">
                <div class="goods-layout-photo-image-bg" :style="{backgroundImage: 'url('+item.goodsimg+')'}"></div>
              </div>
              <div class="goods-layout-photo-tags" v-show="value.showContent.includes('timer')">
                <div class="big">
                  <div class="tag-title">助力砍价</div>
                  <div class="tag-info">
                    <p>距结束仅剩</p>
                    <div class="timer">
                      <span>00</span>时<span>00</span>分<span>00</span>
                    </div>
                  </div>
                </div>
                <div class="small">
                  <span class="title">距结束</span>
                  <div class="timer">
                    <span>00</span>:<span>00</span>:<span>00</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="goods-layout-info">
              <div class="goods-layout-info-title">
                <h3 :class="{'fontBold':value.textStyle === 2}" v-show="value.showContent.includes('name')">
                  <span class="title-tag">减30元</span>
                  {{item.goodsname}}
                </h3>
                <p v-show="value.showContent.includes('desc')">{{item.goodsdesc}}</p>
              </div>
              <div class="goods-layout-info-progerss">
                <div class="bar" v-show="value.showContent.includes('progress')">
                  <div class="inner"></div>
                </div>
                <div class="tips">
                  <p class="remain" v-show="value.showContent.includes('stock')">
                    仅剩
                    <span>10</span>
                    件
                  </p>
                  <p class="buynum" v-show="value.showContent.includes('buynum')">
                    已抢
                    <span>15</span>
                    件
                  </p>
                </div>
              </div>
              <div class="goods-layout-info-price">
                <div class="price">
                  <span class="discount" v-show="value.showContent.includes('disprice')">
                    <span class="symbol">￥</span><span class="number">59.99</span>
                  </span>
                  <span class="orprice" v-show="value.showContent.includes('orprice')">￥79.99</span>
                </div>
                <div class="buybtn" v-show="value.showContent.includes('buybtn')">
                  <div class="buy-btn-type1" v-if="value.btnStyle === 1"><Icon type="ios-cart-outline" /></div>
                  <div class="buy-btn-type2" v-if="value.btnStyle === 2"><Icon type="ios-add-circle-outline" /></div>
                  <div class="buy-btn-type3" v-if="value.btnStyle === 3"><button>{{value.btnText}}</button></div>
                  <div class="buy-btn-type4" v-if="value.btnStyle === 4"><button>{{value.btnText}}</button></div>
                  <div class="buy-btn-type5" v-if="value.btnStyle === 5"><Icon type="ios-add-circle" /></div>
                  <div class="buy-btn-type6" v-if="value.btnStyle === 6"><Icon type="ios-cart-outline" /></div>
                  <div class="buy-btn-type7" v-if="value.btnStyle === 7"><button>{{value.btnText}}</button></div>
                  <div class="buy-btn-type8" v-if="value.btnStyle === 8"><button>{{value.btnText}}</button></div>
                </div>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import previewMixins from '../../mixins/previewMixins'
export default {
  name: 'CutdownPreview',
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
  .design-timelimit-discount{
    background-color: #ffffff;
    position: relative;
    cursor: grab;
  }
  .design-timelimit-discount-preview{
    ul{
      list-style: none;
      &::after{
        display:block;
        clear:both;
        content:"";
        visibility:hidden;
        height:0
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
        overflow: hidden;
        a{
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
          .goods-layout-photo{
            position: relative;
            &-tags{
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              .big{
                height: 40px;
                line-height: 40px;
                box-sizing: border-box;
                padding: 0 15px;
                color: #fff;
                background: linear-gradient(90deg,#fd3e20,#fc6340);
                display: flex;
                justify-content: space-between;
                display: none;
                .tag-title{
                  font-size: 20px;
                  font-weight: 700;
                }
                .tag-info{
                  p{
                    font-size: 12px;
                    display: block;
                    text-align: left;
                    line-height: 14px;
                    height: 14px;
                    margin: 4px 0 2px;
                    opacity: .6;
                    padding-left: 4px;
                  }
                  .timer{
                    line-height: 1;
                    font-size: 10px;
                    margin-top: 5px;
                    span{
                      font-size: 12px;
                      font-weight: 700;
                      background: transparent;
                      margin-right: 4px;
                      margin-left: 4px;
                    }
                  }
                }
              }
              .small{
                background: linear-gradient(90deg,#fd3e20,#fc6340);
                display: flex;
                justify-content: space-between;
                padding: 0 10px;
                height: 24px;
                line-height: 24px;
                .title{
                  opacity: .7;
                  font-size: 10px;
                  color: #fff;
                }
                .timer{
                  margin: 0;
                  padding: 0 2px;
                  font-size: 12px;
                  text-align: center;
                  color: #fff;
                  font-weight: 700;
                  background: transparent;
                }
              }
            }
            &-image-wrap{
              position: relative;
              overflow: hidden;
              max-height: 500px;
              padding-top: 100%;
            }
            &-image-bg{
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
          .goods-layout-info{
            padding: 0 10px;
            position: relative;
            &-title{
              margin-top: 10px;
              h3{
                color: #333;
                font-size: 14px;
                line-height: 20px;
                max-height: 40px;
                margin-bottom: 5px;
                word-break: break-all;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                font-weight: normal;
                &.fontBold{
                  font-weight: 600;
                }
              }
              p{
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
              span{
                display: inline-block;
                height: 16px;
                padding: 0 6px;
                line-height: 16px;
                color: #f44;
                font-size: 12px;
                border-radius: 8px;
                background-color: #ffdfdf;
                font-weight: 400;
              }
            }
            &-progerss{
              margin: 10px 0 5px;
              .bar{
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background-color: hsla(0,0%,90%,.5);
                .inner{
                  width: 60%;
                  height: 100%;
                  border-radius: 3px;
                  background-image: linear-gradient(90deg,#ff7979,#f44);
                }
              }
              .tips{
                margin-top: 6px;
                overflow: hidden;
                color: #999;
                font-size: 10px;
                line-height: 12px;
                .remain{
                  float: left;
                  margin: 0;
                  span{
                    color: #ff423d;
                  }
                }
                .buynum{
                  float: right;
                  margin: 0;
                  span{
                    color: #ff423d;
                  }
                }
              }
            }
            &-price{
              min-height: 44px;
              align-items: center;
              display: flex;
              justify-content: space-between;
              .price{
                display: flex;
                flex-direction: column;
                align-items: baseline;
                .discount{
                  color: #f44;
                  word-break: break-all;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 1;
                  -webkit-box-orient: vertical;
                  .symbol{
                    font-size: 12px;
                  }
                  .number{
                    font-size: 16px;
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
                  word-break: break-all;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-line-clamp: 1;
                  -webkit-box-orient: vertical;
                }
              }
              .buybtn{
                button{
                  white-space: nowrap;
                  overflow: hidden;
                }
                .buy-btn-type1{
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
                .buy-btn-type2{
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #f44;
                  i{
                    font-size: 19px;
                    font-weight: bold;
                  }
                }
                .buy-btn-type3{
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
                .buy-btn-type4{
                  button{
                    outline: none;
                    border: none;
                    line-height: 20px;
                    height: 20px;
                    font-size: 12px;
                    padding: 0 5px;
                    background-color: #fff;
                    color: rgb(255, 68, 68);
                    border: 1px solid #f44;
                  }
                }
                .buy-btn-type5{
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  color: #f44;
                  i{
                    font-size: 19px;
                  }
                }
                .buy-btn-type6{
                  .buy-btn-type2;
                }
                .buy-btn-type7{
                  button{
                    outline: none;
                    border: none;
                    line-height: 20px;
                    height: 20px;
                    font-size: 12px;
                    padding: 0 5px;
                    background-color: rgb(255, 68, 68);
                    color: #fff;
                  }
                }
                .buy-btn-type8{
                  button{
                    outline: none;
                    border: none;
                    line-height: 20px;
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
        &.template1{ //大图模式
          width: 100%;
          .big{
            display: flex!important;
          }
          .small{
            display: none!important;
          }
          .goods-layout-info-price{
            .price{
              flex-direction: row;
            }
          }
        }
        &.template2{ //一行两个
          float: left;
          width: 50%;
        }
        &.template3{ //一行三个
          float: left;
          width: 33.333%;
        }
        &.template4{ //详细列表
          width: 100%;
          .goods-layout-photo{
            float: left;
            margin-right: 10px;
            min-height: auto;
            width: 145px;
            height: 145px;
          }
          .goods-layout-info{
            padding: 0 10px 0 0;
            overflow: hidden;
            margin-left: 155px;
            height: 145px;
          }
        }
        &.template5{ //一大两小
          float: left;
          width: 50%;
          &:nth-child(3n+1){
            width: 100%;
            .big{
              display: flex!important;
            }
            .small{
              display: none!important;
            }
            .goods-layout-info-price{
              .price{
                flex-direction: row;
              }
            }
          }
        }
        &.template6{ //横向滑动
          box-flex: 0;
          flex: 0 0 30%;
          flex: 0 0 30%;
          width: 30%;
          float: none;
        }
      }
    }
  }
</style>
