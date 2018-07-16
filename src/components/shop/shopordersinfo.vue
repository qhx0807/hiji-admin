<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="../../images/order.png" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">订单详细信息</span></h4>
        <p>查看订单详细信息
          <router-link :to="{name: 'CouponItem'}">返回【订单列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card :bordered="false">
      <p class="info-title">订单信息</p>
      <Form :label-width="100">
        <Row>
          <Col span="8">
            <FormItem label="用户姓名：">付小小</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="联系电话：">18100000000</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="常用快递：">菜鸟仓储</FormItem>
          </Col>
        </Row>
      </Form>
      <hr class="divider">
      <p class="info-title">收货信息</p>
      <Form :label-width="100">
        <Row>
          <Col span="8">
            <FormItem label="用户姓名：">付小小</FormItem>
            <FormItem label="收货地址：">四川省 达州市 宣汉县 蒲江食品站</FormItem>
          </Col>
          <Col span="8">
            <FormItem label="联系电话：">18100000000</FormItem>
            <FormItem label="备注信息："></FormItem>
          </Col>
          <Col span="8">
            <FormItem label="常用快递：">菜鸟仓储</FormItem>
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
            <th>数量（件）</th>
            <th>金额</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1234561</td>
            <td>矿泉水 550ml</td>
            <td>12421432143214321</td>
            <td>2.50</td>
            <td>2</td>
            <td>5.00</td>
          </tr>
          <tr>
            <td>1234561</td>
            <td>矿泉水 550ml</td>
            <td>12421432143214321</td>
            <td>2.50</td>
            <td>2</td>
            <td>5.00</td>
          </tr>
          <tr class="total">
            <td colspan="4">总计</td>
            <td>4</td>
            <td>20.00</td>
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
    return {}
  },
  created () {
    // this.getOrderData()
  },
  methods: {
    getOrderData () {
      let d = {
        userid: this.$route.params.id
      }
      this.$store.commit('pageLoading', true)
      serverApi('/member/getbyid', d,
        response => {
          console.log(response)
          this.$store.commit('pageLoading', false)
          if (response.data.code === 0){
            this.userData = response.data.data
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
  margin-bottom: 12px!important;
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
.divider{
  border: none;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 25px;
  margin-top: 6px;
}
.table{
  margin-left: 25px;
  th{
    font-size: 13px;
    font-weight: normal;
    padding: 16px;
  }
  td{
    font-size: 12px;
    padding: 16px;
  }
  .total{
    font-size: 14px;
    font-weight: 600;
    td{
      border-bottom: 1px solid #ddd;
    }
  }
}
</style>
