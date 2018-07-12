<template>
  <div class="box">
    <Card :bordered="false">
      <div class="shop-img">
        <img src="../../../static/avatar.jpg" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">新增会员信息</span></h4>
        <p>手动新增会员。
          <router-link :to="{name: 'UserMember'}">返回【会员列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card style="margin-top:10px" :bordered="false">
      <Form :model="merchantData" ref="form" :rules="rules" :label-width="90">
        <Row>
          <Col span="6">
            <FormItem label="用户名">
              <Input v-model="userData.username"></Input>
            </FormItem>
            <FormItem label="所属城市">
              <Select v-model="userData.city">
                <Option v-for="item in areaData" :key="item.id" :value="item.id">{{item.areaname}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="昵称">
              <Input v-model="userData.nickname"></Input>
            </FormItem>
            <FormItem label="积分">
              <Input v-model="userData.intergral"></Input>
            </FormItem>
          </Col>
           <Col span="6">
            <FormItem label="电话">
              <Input v-model="userData.phone"></Input>
            </FormItem>
            <FormItem label="证件号码">
              <Input v-model="userData.id_card"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="头像">
              <Input v-model="userData.avatar"></Input>
            </FormItem>
            <FormItem label="密码">
              <Input style="width:100%" v-model="userData.password"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="" prop="merchantcode">
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col span="24" style="text-align:center; padding-top:30px">
          <Button :loading="modal_loading" style="width:200px" @click="onClickAdd" type="primary">新增会员</Button>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'UserMemberAdd',
  data () {
    return {
      userData: {
        username: '',
        city: 1,
        password: '',
        nickname: '',
        intergral: '0',
        phone: '',
        id_card: '',
        avatar: ''
      },
      rules: {
        extrainfocode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        extrainfovalue: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      modal_loading: false,
      couponData: [],
      areaData: []
    }
  },
  created () {
    this.getCouponData()
    this.getAreaData()
  },
  computed: { },
  methods: {
    getCouponData () {
      let d = {
        pagesize: 99999,
        page: 1,
        userid: sessionStorage.userid
      }
      serverApi('/card/coupon', d,
        response => {
          if (response.data.code === 0){
            this.couponData = response.data.data.result
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
    getAreaData () {
      serverApi('/area/index', '',
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.areaData = response.data.data
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        }
      )
    },
    onClickAdd () {
      this.modal_loading = true
        serverApi('/member/addmember', this.userData,
          response => {
            this.modal_loading = false
            if (response.data.code === 0) {
              this.$router.push({name: 'UserMember'})
            }
            this.$Message.info(response.data.msg)
          },
          error => {
            console.log(error)
            this.modal_loading = false
            this.$Message.error("连接失败！")
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
</style>
