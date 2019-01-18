<template>
  <div class="box">
    <Card :bordered="false">
      <div class="shop-img">
        <img :src="avatarSrc" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">
          <b>{{userData.nickname}}</b>
          用户信息</span></h4>
        <p>编辑用户的个人信息。
          <router-link :to="{name: 'UserMember'}">返回【会员列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card style="margin-top:10px" :bordered="false">
      <Form :model="userData" ref="form" :rules="rules" :label-width="80">
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
            <FormItem label="密码">
              <Tooltip content="输入密码保存即为修改用户密码！" placement="top-start">
                <Input style="width:100%" v-model="userPass"></Input>
              </Tooltip>
              <Tooltip content="输入密码保存即为修改用户密码！" placement="top">
              <Icon type="help-circled"></Icon>
              </Tooltip>
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
            <FormItem label="注册时间">
              <Input v-model="userData.create_time"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="">
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col span="24" style="text-align:center; padding-top:30px">
          <Button :loading="modal_loading" style="width:200px" @click="onClickSave" type="primary">保存</Button>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'UserMemberEdit',
  data () {
    return {
      userPass: '',
      rules: {
        extrainfocode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        extrainfovalue: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      modal_loading: false,
      userData: {},
      areaData: []
    }
  },
  created () {
    this.getUserData()
    this.getAreaData()
  },
  computed: {
    avatarSrc () {
      return this.userData.avatar || '../../../static/avatar.jpg'
    }
  },
  methods: {
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
    getUserData () {
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
    },
    onClickSave () {
      this.modal_loading = true
      this.userData.newpassword = this.userPass
      serverApi('/member/editmember', this.userData,
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
