<template>
  <div class="box">
    <Card :bordered="false" class="mb10 topcard">
      <div class="shop-img">
        <img src="../../images/order.png" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">订单：{{orderData.orderno}}</span></h4>
        <p>查看订单详细信息
          <router-link :to="{name: 'ShopOrders'}">返回【订单列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
      <div class="status-box">
        <ButtonGroup>
          <Button type="ghost">{{orderData.order_status}}</Button>
          <Button type="ghost">{{orderData.pay_status}}</Button>
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
            <FormItem label="收货地址：">{{orderData.addrid}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="联系电话：">{{orderData.phone}}</FormItem>
            <FormItem label="所属城市：">{{orderData.city}}</FormItem>
          </Col>
          <Col span="8">
            <!-- <FormItem label="常用快递：">菜鸟仓储</FormItem> -->
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
            <FormItem label="订单类型：">{{orderData.type}}</FormItem>
            <FormItem label="订单状态：">{{orderData.order_status}}</FormItem>
            <FormItem label="流水号：">{{orderData.pay_no}}</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="订单类型：">{{orderData.type}}</FormItem>
            <FormItem label="订单金额：">{{orderData.amount}}</FormItem>
            <FormItem label="支付状态：">{{orderData.pay_status}}</FormItem>
            <!-- <FormItem label="收货地址：">{{orderData.order_status}}</FormItem> -->
          </Col>
          <Col span="8">
            <FormItem label="创建时间：">{{orderData.createtime}}</FormItem>
            <FormItem label="支付金额：">{{orderData.cash_amount}}</FormItem>
            <FormItem label="支付方式：">{{orderData.paytype}}</FormItem>
            <!-- <FormItem label="支付时间：">{{orderData.paytime}}</FormItem> -->
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
            <th>商品条码</th>
            <th>单价</th>
            <th>市场价</th>
            <th>数量</th>
            <th>会员价</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in goodsList" :key="index">
            <td>{{item.goodsid}}</td>
            <td>{{item.goodsname}}</td>
            <td>{{item.goodssn}}</td>
            <td>{{item.goodsprice}}</td>
            <td>{{item.marketprice}}</td>
            <td>{{item.goodsnum}}</td>
            <td>{{item.memberprice}}</td>
          </tr>
          <tr class="total">
            <td colspan="5">总计</td>
            <td>{{shopNUm}}</td>
            <td>{{shopPrice}}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'ShopOrdersInfo',
  data () {
    return {
      orderData: {},
      goodsList: []
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
      this.goodsList.forEach(item => {
        price += Number(item.memberprice)
      })
      return price
    }
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
    padding: 12px;
  }
  .total{
    font-size: 14px;
    font-weight: 600;
    td{
      border-bottom: 1px solid #ddd;
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
  width: 200px;
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
