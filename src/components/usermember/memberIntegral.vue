<template>
  <div class="">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="../../images/order.png" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">会员积分/经验</span></h4>
        <p>
          设置会员积分/经验规则
          <!-- <router-link :to="{name: 'ShopGoodsCx'}">返回【限购商品列表】</router-link> -->
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card :bordered="false">
      <Form :model="addData" :label-width="220" ref="from" :rules="rules">
        <Row type="flex" justify="center" class="code-row-bg">
          <Col span="5">
            <FormItem  label="消费获取积分：金额" >
              <Input  v-model="addData.expneed1" style="width: 50px"></Input>
              <p class="p"> ==>> 1积分</p>
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center" class="code-row-bg">
          <Col span="5">
            <FormItem  label="登陆次数获取积分：次数" >
              <Input  v-model="addData.expneed2" style="width: 50px"></Input>
              <p class="p"> ==>> 1积分</p>
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center" class="code-row-bg">
          <Col span="5">
            <FormItem  label="消费获取经验：金额" >
              <Input  v-model="addData.expneed3" style="width: 50px"></Input>
              <p class="p"> ==>> 1经验</p>
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center" class="code-row-bg">
          <Col span="5">
            <FormItem  label="登陆次数获取经验：次数" >
              <Input  v-model="addData.expneed4" style="width: 50px"></Input>
              <p class="p"> ==>> 1经验</p>
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center" class="code-row-bg">
          <Col span="7" style="margin-top: 30px">
          <FormItem>
            <Button type="info" ghost @click="onClickSubmit" :loading="submitLoading" style="width:200px;">保存</Button>
          </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'MemberIntegral',
  data () {
    return {
      submitLoading: false,
      addData: {},
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    onClickSubmit () {
      console.log(this.addData)
      this.submitLoading = true
      serverApi('/member/payintegraledit', this.addData,
        response => {
          console.log(response)
          this.submitLoading = false
          if (response.data.code === 0){
            this.$Notice.success({
              title: response.data.msg,
              desc: '成功！'
            })
            // this.$router.push({name: 'ShopGoodsCx'})
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.submitLoading = false
          console.log(error)
          this.$Message.error('连接失败！')
        }
      )
    },
    getTableData () {
      serverApi('/member/payintegralindex', null,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.addData = response.data.data.rule
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.$store.commit('pageLoading', false)
        },
        error => {
          console.log(error)
          this.$store.commit('pageLoading', false)
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
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
.goods-info{
  border: 1px solid #ddd;
  padding-left: 8px;
  border-radius: 4px;
}
.btn {
  height: 32px;
  line-height: 16px;
  margin-left: 10px;
}
.p {
  display: inline;
  margin-left: 8px;
  font-size: 14px;
}
</style>
