<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <!-- <div class="shop-img">
        <img src="http://cdn.cqyyy.cn/PREVIEW.svg" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">{{blockData.name}} {{blockData.city}}</span></h4>
        <p>{{blockData.desc}}
          <router-link :to="{name: 'Templates'}">返回【模板页列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div> -->
      <Row>
        <Col span="8">
          <Input v-model="goodsids" :placeholder="placeholder">
            <Select v-model="selectType" slot="prepend" style="width: 80px">
              <Option value="1">商品ID</Option>
              <Option value="2">分类ID</Option>
            </Select>
          </Input>
        </Col>
        <Col span="4">
          <Button style="margin-left:12px" :loading="addLoading" @click="onClickSaveAdd">添加到页面</Button>
        </Col>
        <Col span="7"  style="padding-left:20px;">
          <Input v-model="blockData.topimg" placeholder="上传页面顶部图片，没有则不显示" />
        </Col>
        <Col span="1"  style="padding-left:20px;">
          <img class="topimg-head" v-imgview :src="blockData.topimg" alt="">
        </Col>
        <Col span="4"  style="padding-left:12px;">
          <Upload
            :action="uploadApiUrl"
            :on-error="uploadImgErr"
            :on-success="uploadImgSucc"
            :show-upload-list="false"
            accept="image/*">
            <Button icon="ios-cloud-upload-outline">上传专题图</Button>
          </Upload>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false">
      <Row>
        <Col span="12">

          <Input prefix="ios-search" v-model="searchKeys" style="width: 300px" placeholder="搜索..."></Input>
          <Button style="margin-left:12px" type="primary" :disabled="disabledBtn" @click="onClickSavePreView">预览页面效果</Button>
        </Col>
      </Row>
    </Card>
    <Row>
      <Col span="24">
        <div class="hot-content">
          <Spin fix size="large" v-show="spinShow"></Spin>
          <transition-group name="fade">
            <div class="goods-item" v-for="(item, index) in sortedList" :key="item.id">
              <img :src="item.goodsimg" alt="">
              <p class="goods-name">{{item.goodsname}}</p>
              <p style="margin-top:6px;padding-left:5px;">
                <del class="market-price">￥{{item.marketprice}}</del>
                <span class="goods-price">￥{{item.goodsprice}}</span>
              </p>
              <span class="goods-buy">立即购买</span>
              <div class="mask">
                <button @click="onClickRemoveItem(item.sonid)">移除推荐</button>
                <button @click="onClickOrderItem(item.sonid, item.webareasort)">更改排序</button>
                <p>商品ID：{{item.id}} &nbsp;&nbsp;排序：{{item.webareasort}}</p>
              </div>
            </div>
          </transition-group>
        </div>
      </Col>
    </Row>
    <Modal v-model="previewModal"  width="350">
      <p slot="header" style="text-align:center">
        <span>预览</span>
      </p>
        <div class="preview-page">
          <img class="phone-title" src="http://cdn.cqyyy.cn/12e73dca6848e7977396a6fa123b9140.png" alt="">
          <p class="title">{{blockData.name}}</p>
          <div class="content">
            <img class="topimg" :src="blockData.topimg" alt="">
            <Row>
              <Col span="12" class="goods-item" v-for="(item, index) in sortedList" :key="index">
                <img :src="item.goodsimg" alt="">
                <p class="goods-name">{{item.goodsname}}</p>
                <p style="margin-top:6px; padding-left:5px;">
                  <del class="market-price">￥{{item.marketprice}}</del>
                  <span class="goods-price">￥{{item.goodsprice}}</span>
                </p>
                <span class="goods-buy">立即购买</span>
              </Col>
            </Row>
          </div>
        </div>
      <div slot="footer">
        <Button @click="previewModal = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { uploadApiUrl } from '../../config/'
import { arrSearch } from '../../utlis/tools.js'
export default {
  name: 'TemplatesGoods',
  data () {
    return {
      uploadApiUrl: uploadApiUrl,
      searchKeys: '',
      addLoading: false,
      submitLoading: false,
      spinShow: false,
      disabledBtn: false,
      blockData: {},
      goodsData: [],
      selectType: '1',
      goodsids: '',
      topimg: '',
      list: [2,3,45,5,67,8],
      previewModal: false
    }
  },
  created () {
    this.getModulesInfo()
  },
  computed: {
    placeholder () {
      return this.selectType == '1' ? '输入商品ID,以逗号分隔' : '商品分类ID，单个id'
    },
    sortedList () {
      return arrSearch(this.goodsData, this.searchKeys)
    }
  },
  methods: {
    getModulesInfo () {
      let d = {
        id: this.$route.params.id,
        type: this.$route.params.type
      }
      serverApi('/web/areasonindex', d,
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.blockData = response.data.data.area
            this.goodsData = response.data.data.areason
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.$Message.error(error.toString())
        }
      )
    },
    uploadImgErr (response, file, fileList) {
      this.$Message.warning('上传失败！')
      console.log('err'+response,file,fileList)
    },
    uploadImgSucc (response, file) {
      console.log(response)
      if (response.code == 0) {
        let url = response.data.url
        this.blockData.topimg = url
        serverApi('/web/webareaedit', this.blockData,
          response => {
            if (response.data.code === 0){
              this.$Notice.success({
                title: '上传成功',
                desc: '专题图片上传成功！'
              })
              console.log(response)
            }else{
              this.$Message.warning(response.data.msg)
            }
          },
          error => {
            console.log(error)
          }
        )
      }
    },
    onClickSaveAdd () {
      let reg = /^[\d,]*$/
      if (!reg.test(this.goodsids) || !this.goodsids) {
        this.$Message.warning('输入的id格式不正确，请检查')
        return false
      }
      let d = {
        type: this.selectType,
        goodsids: this.goodsids,
        id: this.$route.params.id
      }
      this.addLoading = true
      serverApi('/web/webgoodsadd', d,
        response => {
          this.addLoading = false
          if (response.data.code === 0) {
            this.goodsids = ''
            this.getModulesInfo(this.$route.params.id)
            this.$Message.success(response.data.msg)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.addLoading = false
          this.$Message.error(error.toString())
        }
      )
    },
    hotGoodsEdit (id, order) {
      this.$Message.loading({
        content: '加载中...',
        duration: 0
      })
      let d = {
        id: id,
        webareasort: order
      }
      serverApi('/web/webgoodsedit', d,
        response => {
          this.$Message.destroy()
          if (response.data.code === 0){
            this.getModulesInfo()
            this.$Message.success(response.data.msg)
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.destroy()
          console.log(error)
          this.$Message.error(error.toString())
        }
      )
    },
    onClickRemoveItem (id) {
      this.hotGoodsEdit(id, '0')
    },
    onClickOrderItem (id, num) {
      let editOrer = num
      this.$Modal.confirm({
        render: (h) => {
          let title = h('h4', {
            style: {
              textAlign: 'center',
              marginBottom: '20px'
            }
          }, '更改排序')
          let tip = h('Alert', {
            props: {
              showIcon: true
            }
          }, '请输入推荐商品排序，范围：1-255')
          let inputNum = h('InputNumber', {
            props: {
              max: 255,
              min: 1,
              value: num
            },
            style: {
              width: '100%'
            },
            on: {
              input: (val) => {
                editOrer = val
              }
            }
          })
          return h('div', {}, [title, tip, inputNum])
        },
        onOk: () => {
          this.hotGoodsEdit(id, editOrer)
        }
      })
    },
    onClickSavePreView () {
      this.previewModal = true
    }
  }
}
</script>
<style lang="less" scoped>
.hot-content{
  padding: 16px;
  border: 1px solid #dedede;
  height: 550px;
  overflow: auto;
  background-color: #f5f5f5;
  position: relative;
  .goods-item{
    height: 240px;
    width: 150px;
    position: relative;
    overflow: hidden;
    background-color: #fff;
    float: left;
    margin-right: 10px;
    margin-bottom: 12px;
    &:hover{
      .mask{
        display: block;
      }
    }
    img{
      width: 100%;
      height: 150px;
    }
    .goods-name{
      line-height: 18px;
      height: 36px;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      padding: 0 5px;
    }
    .goods-price{
      color: #f44;
    }
    .goods-buy{
      display: block;
      position: absolute;
      right: 5px;
      background-color: #F46F71;
      color: #fff;
      padding: 0px 5px;
      height: 17px;
      line-height: 17px;
      border-radius: 3px;
      bottom: 5px;
    }
    .mask{
      background-color: rgba(255, 255, 255, .9);
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 9;
      display: none;
      transition: all ease .2s;
      text-align: center;
      button{
        height: 30px;
        background-color: #fff;
        border: 1px solid #F55D54;
        color: #F55D54;
        outline: none;
        width: 130px;
        text-align: center;
        cursor: pointer;
        transition: all ease .2s;
        &:first-child{
          margin-top: 60px;
          margin-bottom: 16px;
        }
        &:hover{
          background-color: #F55D54;
          color: #fff;
        }
      }
      p{
        margin-top: 70px;
      }
    }
  }
}
.topimg-head{
  height: 30px;
}
.preview-page{
  width: 320px;
  height: 528px;
  margin: 0 auto;
  position: relative;
  border: 1px solid #f5f5f5;
  box-sizing: border-box;
  overflow: auto;
  .phone-title{
    width: 100%;
  }
  .title{
    position: absolute;
    top: 35px;
    left: 0;
    right: 0;
    text-align: center;
    color: #fff;
    font-size: 14px;
  }
  .content{
    width: 100%;
    font-size: 0;
    background-color: #eee;
    .topimg{
      width: 100%;
    }
    .goods-item{
      box-sizing: border-box;
      height: 230px;
      // width: 150px;
      position: relative;
      overflow: hidden;
      background-color: #fff;
      float: left;
      // margin-right: 10px;
      margin-bottom: 12px;
      img{
        width: 100%;
        height: 150px;
      }
      .goods-name{
        line-height: 18px;
        height: 36px;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        padding: 0 5px;
        font-size: 12px;
      }
      .goods-price{
        color: #f44;
        font-size: 12px;
      }
      .market-price{
        font-size: 12px;
      }
      .goods-buy{
        display: block;
        position: absolute;
        right: 5px;
        background-color: #F46F71;
        color: #fff;
        padding: 0px 5px;
        height: 17px;
        line-height: 17px;
        border-radius: 3px;
        bottom: 5px;
        font-size: 12px;
      }
    }
  }
}

</style>
