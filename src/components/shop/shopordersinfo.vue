<template>
  <div class="box">
    <Card :bordered="false" class="mb10 topcard">
      <div class="shop-img">
        <img src="../../images/order.png" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">订单：{{orderData.orderno}}</span></h4>
        <p>查看订单详细信息
          <a @click="onClickBack">返回【订单列表】</a>
        </p>
      </div>
      <div class="clear-fix"></div>
      <div class="status-box">
        <ButtonGroup>
          <Button  >{{orderData.order_status}}</Button>
          <Button  >{{orderData.pay_status}}</Button>
          <Button  @click="onClickPrint(orderData.orderno)">打印</Button>
        </ButtonGroup>
        <div>
          <Row>
            <Col span="12" class="order-tit" style="padding-right:20px">
              <h3>状态</h3>
              <p>{{orderData.order_status}}</p>
            </Col>
            <Col span="12" class="order-tit">
              <h3>订单金额</h3>
              <p>￥{{orderData.cash_amount}}</p>
            </Col>
          </Row>
        </div>
      </div>
    </Card>
    <Card :bordered="false">
      <p class="info-title">会员信息</p>
      <Form :label-width="100">
        <Row>
          <Col span="8">
            <FormItem label="用户姓名：">{{orderData.userid}}/{{orderData.username}}</FormItem>
            <!-- <FormItem label="收货地址：">{{orderData.address}}</FormItem> -->
          </Col>
          <Col span="16">
            <FormItem label="收货地址：">{{addressStr}}</FormItem>
            <!-- <FormItem label="所属城市：">{{orderData.city}}</FormItem> -->
          </Col>
          <Col span="8">
            <FormItem label="买家留言：">{{orderData.orderremarks}}</FormItem>
          </Col>
          <Col span="16" v-if="idcard">
            <FormItem label="身份证号码：">{{idcard}}</FormItem>
          </Col>
        </Row>
      </Form>
      <hr class="divider">
      <p class="info-title">商户信息</p>
      <Form :label-width="100">
        <Row>
          <Col span="8">
            <FormItem label="商户名称：">{{orderData.merchantname}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="商户编码：">{{orderData.merchantcode}}</FormItem>
          </Col>
        </Row>
      </Form>
      <hr class="divider">
      <p class="info-title">订单信息</p>
      <Form :label-width="100">
        <Row>
          <Col span="8">
            <FormItem label="订单编号：">{{orderData.orderno ? orderData.orderno : ''}}</FormItem>
            <FormItem label="订单状态：">{{orderData.order_status}}</FormItem>
            <FormItem label="流水号：">{{orderData.pay_no}}</FormItem>
            <FormItem label="卡券id：">{{orderData.cardmainid}} &nbsp;&nbsp;<a v-if="orderData.cardmainid" @click="onClickCoupon(orderData.cardmainid)">查看卡券</a></FormItem>
            <FormItem label="平台优惠：">{{orderData.coupon}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="订单类型：">{{orderData.type}}</FormItem>
            <FormItem label="订单金额：">{{orderData.amount}}</FormItem>
            <FormItem label="支付状态：">{{orderData.pay_status}}</FormItem>
            <FormItem label="物流单号：">{{orderData.shipping_code}} &nbsp;&nbsp;&nbsp;<a v-if="orderData.shipping_code">物流信息</a></FormItem>
            <FormItem label="商户优惠：">{{orderData.merchantcoupon}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="创建时间：">{{orderData.createtime}}</FormItem>
            <FormItem label="实际支付：">{{orderData.cash_amount}}</FormItem>
            <FormItem label="支付方式：">{{orderData.paytype == '1' ? '微信' : '支付宝'}}</FormItem>
            <FormItem label="支付时间：">{{orderData.paytime}}</FormItem>
            <FormItem label="扣点金额：">{{orderData.pointsprice}}</FormItem>
          </Col>
        </Row>
      </Form>
      <hr class="divider">
      <p class="info-title">商品信息</p>
      <table class="table">
        <thead>
          <tr>
            <th>商品编号</th>
            <th>商品名称</th>
            <th>属性</th>
            <th>单价</th>
            <th>市场价</th>
            <th>数量</th>
            <th>价格</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in goodsList" :key="index">
            <td>{{item.goodsid}}</td>
            <td class="">
              <!-- <img :src="item.goodsimg" v-imgview style="height:20px" alt=""> -->
              <span>{{item.goodsname}}</span>
            </td>
            <td>{{item.goodstypename}}</td>
            <td>{{item.goodsprice}}</td>
            <td>{{item.marketprice}}</td>
            <td>{{item.goodsnum}}</td>
            <td style="font-size:14px">{{Number(item.goodsprice)*Number(item.goodsnum)}}</td>
          </tr>
          <tr>
            <td colspan="5" rowspan="3"></td>
            <td>运费：</td>
            <td style="color:#f40;font-size:14px">+ {{orderData.shippingamout}}</td>
          </tr>
          <tr>
            <td>平台优惠：</td>
            <td style="color:#f40;font-size:14px">- {{orderData.coupon}}</td>
          </tr>
          <tr>
            <td>商户优惠：</td>
            <td style="color:#f40;font-size:14px">- {{orderData.merchantcoupon}}</td>
          </tr>
          <tr class="total">
            <td colspan="5">总计</td>
            <td>{{shopNUm}}</td>
            <td><span>{{orderData.cash_amount}}</span></td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { downloadFile } from '../../utlis/tools.js'
export default {
  name: 'ShopOrdersInfo',
  data () {
    return {
      orderData: {},
      goodsList: [],
      idcard: ''
    }
  },
  created () {
    this.getOrderData()
  },
  computed: {
    shopNUm () {
      let num = 0
      this.goodsList.forEach(item => {
        num += item.goodsnum
      })
      return num
    },
    shopPrice () {
      let price = 0
      // this.goodsList.forEach(item => {
      //   price += Number(item.goodsprice)*Number(item.goodsnum)
      // })
      return price.toFixed(2)
    },
    addressStr () {
      if (this.orderData.address && this.orderData.address.indexOf('name') > -1) {
        let obj = JSON.parse(this.orderData.address)
        this.idcard = obj.memberidcard
        return `${obj.name} ${obj.tel} ${obj.address}`
      } else {
        return this.orderData.address
      }
    },
  },
  methods: {
    getOrderData () {
      let d = {
        id: this.$route.params.id
      }
      this.$store.commit('pageLoading', true)
      serverApi('/order/orderinfo', d,
        response => {
          console.log(response)
          this.$store.commit('pageLoading', false)
          if (response.data.code === 0){
            this.orderData = response.data.data.orderinfo
            this.goodsList = response.data.data.goodslist
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.$store.commit('pageLoading', false)
          this.$Message.error('连接失败！')
        }
      )
    },
    onClickBack () {
      this.$router.back()
    },
    onClickCoupon (id) {
      // this.$Message.info('暂未开放~~')
      this.$router.push({name: 'CouponItemEdit', params: {id: id}})
    },
    onClickPrint (orderno) {
      this.$Message.loading({
        duration: 0,
        content: '加载中...'
      })
      serverApi('/order/orderoutone', {orderno: orderno},
        response => {
          this.$Message.destroy()
          if (response.data.code === 0) {
            downloadFile(response.data.data)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.destroy()
          console.log(error)
          this.$Message.warning('连接失败！')
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
.ivu-form-item{
  margin-bottom: 0px!important;
}
.shop-img{
  width: 80px;
  height: 80px;
  float: left;
  img{
    height: 100%;
    width: 100%;
  }
}
.tips{
  padding-left: 100px;
  h4{
    margin-top: 17px;
  }
}
.info-title{
  font-size: 14px;
  margin-left: 25px;
  margin-bottom: 10px;
}
.table{
  margin-left: 25px;
  th{
    font-size: 13px;
    font-weight: normal;
    padding: 12px;
  }
  td{
    font-size: 12px;
    padding: 10px;
  }
  .total{
    font-size: 14px;
    font-weight: 600;
    td{
      border-bottom: 1px solid #ddd;
      span{
        color: #f40;
        font-size: 16px;
      }
    }
  }
  .bm{
    td{
      border-bottom: 1px solid #ddd;
    }
  }
}
.topcard{
  position: relative;
}
.status-box{
  position: absolute;
  right: 12px;
  top: 16px;
  width: 300px;
  text-align: right;
  padding-right: 20px;
}
.order-tit{
  text-align: right;
  padding-top: 10px;
  h3{
    font-size: 12px;
    font-weight: normal;
    color: rgba(0,0,0,.45);
  }
  p{
    font-size: 16px;
    font-weight: 500;
    color: rgba(0,0,0,.85);
  }
}
</style>
