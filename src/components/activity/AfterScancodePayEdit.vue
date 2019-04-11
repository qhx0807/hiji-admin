<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="http://cdn.cqyyy.cn/pic/20190311180501.png" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">修改规则</span></h4>
        <p>
          扫码支付后奖励活动规则
          <router-link :to="{name: 'AfterScancodePay'}">返回【扫码支付奖励活动列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card :bordered="false">AfterScancodePayEdit</Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'AfterScancodePayEdit',
  data () {
    return {}
  },
  created () {},
  methods: {}
}
</script>
<style lang="less" scoped>
.box{
  position: relative;
}
.shop-img{
  width: 40px;
  height: 40px;
  float: left;
  img{
    height: 100%;
    width: 100%;
  }
}
.tips{
  padding-left: 50px;
  h4{
    margin-top: 2px;
  }
  p{
    margin-top: 3px;
  }
}
.share-img{
  height: 40px;
}
</style>
