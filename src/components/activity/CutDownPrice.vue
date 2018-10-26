<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="http://cdn.cqyyy.cn/PREVIEW.svg" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">砍价狂欢趴</span></h4>
        <p>添加砍价活动
          <router-link :to="{name: 'CutDownPriceAdd'}">添加砍价活动</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'CutDownPrice',
  data () {
    return {}
  },
  created () {
    let cutrules = [
      {rank: '10', maxprice: '20'},
      {rank: '20', maxprice: '10'},
    ]
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.shop-img{
  width: 60px;
  height: 60px;
  float: left;
  img{
    height: 100%;
    width: 100%;
  }
}
.tips{
  padding-left: 70px;
  h4{
    margin-top: 10px;
  }
  p{
    margin-top: 5px;
  }
}
</style>
