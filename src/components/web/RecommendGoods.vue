<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Row>
        <!-- <Col span="6">
          <div class="tips">
            <p style="font-size:14px;">
              <img src="http://cdn.cqyyy.cn/redcmmond.png" alt="">
              首页推荐商品瀑布流。
              <a @click="onClickAdd"><Icon size="14" type="md-add" />添加商品</a>
            </p>
          </div>
        </Col> -->
        <Col span="18">
          <Row>
            <Col span="12">
              <Input v-model="goodsids" :placeholder="placeholder">
                <Select v-model="selectType" slot="prepend" style="width: 80px">
                  <Option value="1">商品ID</Option>
                  <Option value="2">分类ID</Option>
                </Select>
              </Input>
            </Col>
            <Col span="6" style="padding-left:8px;">
              <Button style="margin-left:12px" :loading="addLoading" @click="onClickSaveAdd">添加到推荐</Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false">
      <Row>
        <Col span="12">
          <Input prefix="ios-search" v-model="searchKeys" style="width: 300px" placeholder="搜索..."></Input>
        </Col>
        <!-- <Col span="12" style="text-align:right">
          <Button type="error">批量移除</Button>
        </Col> -->
      </Row>
    </Card>
    <Row>
      <Col span="24" class="hot-content">
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
              <button @click="onClickRemoveItem(item.id)">移除推荐</button>
              <button @click="onClickOrderItem(item.id, item.isrecommend)">更改排序</button>
              <p>商品ID：{{item.id}} &nbsp;&nbsp;排序：{{item.isrecommend}}</p>
            </div>
          </div>
        </transition-group>
      </Col>
    </Row>

    <Modal v-model="addModal" width="750">
      <p slot="header" style="text-align:center">
        <span>添加推荐商品</span>
      </p>
      <Form :label-width="80">
        <FormItem label="商品ID" required>
          <Input type="textarea" v-model="goodsids" placeholder="请输入" />
          <Alert show-icon style="margin-top:10px">输入商品id, 多个以逗号分隔</Alert>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="onClickSaveAdd">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
import TimerCountDown from '../common/TimerCountDown'
import { arrSearch } from '../../utlis/tools.js'
export default {
  name: 'RecommendGoods',
  components: {
    TimerCountDown
  },
  data () {
    return {
      searchKeys: '',
      addModal: false,
      modal_loading: false,
      spinShow: false,
      addLoading: false,
      cityList: [],
      hotGoods: [],
      goodsids: '',
      selectType: '1',
      selectCity: '0',
      serchCity: '0',
      count: 0
    }
  },
  created () {
    this.getHotGoodsList()
  },
  computed: {
    placeholder () {
      return this.selectType == '1' ? '输入商品ID,以逗号分隔' : '商品分类ID'
    },
    sortedList () {
      return arrSearch(this.hotGoods, this.searchKeys)
    }
  },
  methods: {
    getHotGoodsList () {
      this.spinShow = true
      serverApi('/web/hotgoodslist', null,
        response => {
          // console.log(response)
          if (response.data.code === 0) {
            this.count = response.data.data.counts
            this.hotGoods = response.data.data.hotgoods
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.spinShow = false
        },
        error => {
          console.log(error)
          this.spinShow = false
        }
      )
    },
    onClickAdd () {
      this.addModal = true
    },
    onClickSaveAdd () {
      let reg = /^[\d,]*$/
      if (!reg.test(this.goodsids) || !this.goodsids) {
        this.$Message.warning('输入的id格式不正确，请检查')
        return false
      }
      this.addLoading = true
      let d = {
        goodsids: this.goodsids,
        type: this.selectType,
      }
      serverApi('/goods/recommendedit', d,
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.getHotGoodsList()
            this.goodsids = ''
            this.$Message.success(response.data.msg)
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.addLoading = false
        },
        error => {
          console.log(error)
          this.addLoading = false
        }
      )
    },
    hotGoodsEdit (goodsids, isrec) {
      this.$Message.loading({
        content: '加载中...',
        duration: 0
      })
      let d = {
        goodsids: goodsids,
        type: '1',
        isrecommend: isrec
      }
      serverApi('/goods/recommendedit', d,
        response => {
          this.$Message.destroy()
          if (response.data.code === 0){
            this.getHotGoodsList()
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
    }
  }
}
</script>
<style lang="less" scoped>
.tips{
  p{
    margin: 0;
    img{
      vertical-align: bottom;
      height: 30px;
    }
  }
}
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
</style>
