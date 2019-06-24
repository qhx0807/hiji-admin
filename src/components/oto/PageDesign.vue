<template>
  <div class="box">
    <DesignBase
      :designComponents="designComponents"
      :groupedComponents="groupedComponents"
      v-model="pageValue"
      @onAddComponent="onAddDesignComponent"
      @onDeleteDesigner="onDeleteDesigner"
    >
    </DesignBase>
    <div class="preview">
      <div style="text-align:center" ref="qrcode"></div>
      <p>扫码预览，<a @click.prevent="onClickCopy">复制链接</a></p>
    </div>
    <div class="bottom-bar">
      <Button @click="getPageValue" type="primary" :loading="submitLoading">保存页面</Button>
      <Poptip trigger="click" content="content">
        <div slot="content">
          <div style="text-align:center" ref="qrcode1"></div>
        </div>
        <Button style="margin-left: 10px">预览效果</Button>
      </Poptip>
    </div>
  </div>
</template>
<script>
import serverApi from '../../axios'
import QRCode from 'qrcodejs2'
import DesignBase from '../design/base/DesignBase'
import Config from '../design/components/config'
import WhiteSpace from '../design/components/whitespace'
import Line from '../design/components/line'
import Swiper from '../design/components/swiper'
import Icon from '../design/components/icon'
import Notice from '../design/components/notice'
import ImageAd from '../design/components/image-ad'
import MagicBox from '../design/components/magic-box'
import Goods from '../design/components/goods'
import GroupBuy from '../design/components/goods-groupbuy'
import timeLimitdisCount from '../design/components/goods-timelimit-discount'
import Cutdown from '../design/components/goods-cutdown'
import Share from '../design/components/share'
import O2 from '../design/components/o2'
import O2TimeLimitDiscount from '../design/components/o2-timelimit-dsicount'
import RichText from '../design/components/rich-text'
import Tabbar from '../design/components/tabbar'
import Landscape from '../design/components/landscape'
import Search from '../design/components/search'

export default {
  name: 'PageDesign',
  components: {
    DesignBase
  },
  data () {
    return {
      pageValue: [
        {
          type: 'config',
          title: '测试页面',
          bgcolor: '#ffffff',
          bgimg: ''
        }
      ],
      submitLoading: false,
      pageinfo: {},
      designComponents: [],
      groupedComponents: []
    }
  },
  created () {
    const group = [
      {
        name: '基础',
        components: [Swiper, Icon, ImageAd, MagicBox, Share, RichText, Tabbar, Landscape, Search]
      },
      {
        name: '商品组件',
        components: [Goods, GroupBuy, timeLimitdisCount, Cutdown]
      },
      {
        name: 'O2组件',
        components: [O2, O2TimeLimitDiscount]
      },
      {
        name: '其他',
        components: [WhiteSpace, Line, Notice]
      }
    ]
    this.designComponents = group.reduce((cur, next) => cur.concat(next.components), [Config])
    this.groupedComponents = this.getGroupDesigns(group)
    this.getPageInfo()
  },
  mounted () {
    this.$nextTick(() => {
      let obj = {
        width: 150,
        height: 150,
        text: 'http://m.cqyyy.cn/hiji-web/dist/index.html#/Preview/' + this.$route.params.id,
        colorDark : "#555555",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
      }
      this.qrCodeInit = new QRCode(this.$refs.qrcode, obj)
      this.qrCodeInit = new QRCode(this.$refs.qrcode1, obj)
    })
  },
  methods: {
    getPageInfo () {
      this.$store.commit('pageLoading', true)
      let d = {
        homeid: this.$route.params.id
      }
      serverApi('/Homepage/webhomeinfo', d,
        response => {
          console.log(response)
          if (response.data.code === 0) {
            // this.pageinfo = response.data.data
            // this.pageValue = response.data.data.content
            // console.log(this.pageValue)
            // this.pageValue[0] = response.data.data.content[0]
            if (response.data.data.content.length > 0) {
              response.data.data.content.forEach(item => {
                if (item.type === 'config') {
                  this.pageValue.map(val => {
                    if (val.type === 'config') {
                      val = Object.assign(val, item)
                    }
                  })
                } else {
                  this.pageValue.push(item)
                }
              })
            }
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.$store.commit('pageLoading', false)
        },
        error => {
          this.$store.commit('pageLoading', false)
          this.$Message.error(error.toString())
        }
      )
    },
    onAddDesignComponent (val, index) {
      this.pageValue.splice(index, 0, val)
    },
    onClickCopy () {
      let text = 'http://m.cqyyy.cn/hiji-web/dist/index.html#/Preview/' + this.$route.params.id
      this.$copyText(text).then((result) => {
        this.$Message.success('复制成功！')
      }, (err) => {
        this.$Message.error('复制失败！')
      })
    },
    getGroupDesigns (items) {
      items.map(item => {
        item.components.map((sub, index) => {
          item.components[index] = {
            name: sub.designDescription,
            selector: sub.designType
          }
        })
      })
      return items
    },
    onDeleteDesigner (index) {
      this.pageValue.splice(index, 1)
    },
    getPageValue () {
      this.submitLoading = true
      let arr = JSON.parse(JSON.stringify(this.pageValue))
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i]
        if (item.hasOwnProperty('ids')) {
          item.items = ''
          if (item.ids.length === 0) {
            arr.splice(i, 1)
            this.$Message.warning('某个组件的商品id或卡券id为空，已删除')
            // return false
          }
        }
      }
      // console.log(arr)
      // this.submitLoading = false
      // return false
      let d = {
        homeid: this.$route.params.id,
        content: JSON.stringify(arr)
      }
      serverApi('/Homepage/webhomecontentedit', d,
        response => {
          if (response.data.code === 0) {
            this.$Modal.success({
              title: '保存成功',
              content: '微页面内容已更新！'
            })
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.submitLoading = false
        },
        error => {
          console.log(error)
          this.submitLoading = false
        }
      )
    },
  }
}
</script>
<style lang="less" scoped>
.box{
  background-color: #fff;
  min-height: 600px;
  padding-left: 100px;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-bottom: 100px;
  position: relative;
  .bottom-bar{
    position: fixed;
    z-index: 20;
    bottom: 0;
    left: 0;
    right: 0;
    height: 50px;
    background: #fff;
    box-shadow: 0 -3px 5px #eee;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .preview{
    position: absolute;
    right: 20px;
    top: 20px;
    p{
      text-align: center;
      color: #666;
      font-size: 12px;
      margin-top: 10px;
    }
  }
}
</style>
