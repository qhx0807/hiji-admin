<template>
  <div class="">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="../../images/order.png" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">发送卡卷</span></h4>
        <p>
          选择卡卷。选择用户，发送卡卷。
          <!-- <router-link :to="{name: 'ShopGoodsCx'}">返回【限购商品列表】</router-link> -->
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card :bordered="false">
      <Form :model="addData" :label-width="120" ref="from" :rules="rules">
        <Row type="flex" justify="center" class="code-row-bg">
          <Col span="12">
            <FormItem  label="选择用户">
              <Input  v-model="name" search @on-search="onSubmit" placeholder="输入用户手机号"></Input>
            </FormItem>
            <FormItem style="margin-bottom:12px" v-show="selectedGoods.user_id">
              <div class="goods-info">
                <Row>
                  <Col span="24"><span class="label">用户名称：</span><span class="value">{{selectedGoods.username}}</span></Col>
                  <Col span="8">
                    <p><span class="label">电话：</span> <span class="value">{{selectedGoods.phone}}</span></p>
                    <p><span class="label">ID</span> <span class="value">{{selectedGoods.user_id}}</span></p>
                  </Col>
                  <Col span="4">
                    <img v-imgview :src="selectedGoods.goodsimg" style="height:60px" alt="">
                  </Col>
                </Row>
              </div>
            </FormItem>
            <FormItem label="选择卡卷">
              <Select
                filterable
                remote
                clearable
                :loading="submitLoading"
                v-model="cardid"
                :remote-method="onSearchCards"
                placeholder="选择卡卷">
                <Option v-for="(item, index) in tableData" :disabled="item.ispromote == 1" :key="item.id" :value="item.id">{{item.cardname}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row type="flex" justify="center" class="code-row-bg">
          <FormItem>
            <Button type="primary" @click="onClickSubmit" :loading="submitLoading">提交</Button>
          </FormItem>
        </Row>
      </Form>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'SendCoupon',
  data () {
    return {
      submitLoading: false,
      tableData: [],
      selectedGoods: {},
      addData: {},
      pagesize: 20,
      page: 1,
      searchKey: '',
      status: '',
      name: '',
      userid: '',
      cardid: ''
    }
  },
  created () {
    this.getTableData('')
    // this.getCardsData(10, '')
  },
  methods: {
    getTableData (like) {
      let d = {
        pagesize: this.pagesize,
        page: this.page,
        like: like,
        status: this.status
      }
      serverApi('/card/coupon', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.tableData = response.data.data.result
            this.count = response.data.data.counts
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.$Message.error('连接失败！')
        }
      )
    },
    onClickSubmit () {
      let d = {
        cardid: this.cardid,
        userid: this.userid
      }
      if (!this.userid) {
        this.$Message.error('请选择用户')
        this.submitLoading = false
        return false
      }
      this.submitLoading = true
      serverApi('/card/adminsendcard', d,
        response => {
          console.log(response)
          this.submitLoading = false
          if (response.data.code === 0){
            this.$Notice.success({
              title: response.data.msg,
              desc: '发送卡卷成功！'
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
    onSubmit (e) {
      let tel = Number(e)
      console.log(tel)
      serverApi('/member/userinfo', {like: tel},
        response => {
          console.log(response)
          this.submitLoading = false
          if (response.data.code === 0){
            this.selectedGoods = response.data.data[0]
            this.userid = response.data.data[0].user_id
            console.log(this.userid)
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        }
      )
    },
    onSearchCards (e) {
      this.getTableData(e)
    },
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
</style>
