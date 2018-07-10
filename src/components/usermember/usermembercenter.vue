<template>
  <div class="box">
    <Row>
      <Col :lg="6" :md="8">
        <Card :bordered="false" class="mb10">
          <div class="avatar-box">
            <img src="http://lscfriends.zlzmm.com/Upload/useraccount/default/hi.jpeg" alt="">
            <h4>用户姓名</h4>
            <p>18716754321</p>
          </div>
          <div class="data-box">
            <div class="data-item">
              <h5>95%</h5>
              <p>会员折扣</p>
            </div>
            <div class="data-item">
              <h5>400</h5>
              <p>当前积分</p>
            </div>
            <div class="data-item">
              <h5>320</h5>
              <p>成长值</p>
            </div>
          </div>
        </Card>
      </Col>
      <Col :lg="12" :md="16">
        <Card style="margin-left:12px" class="mb10" :bordered="false">
          <Row>
            <Col span="12">
              <div class="info-head">
                <span class="icon">
                  <Icon type="person"></Icon>
                </span>
                <span class="info-title">个人信息</span>
              </div>
              <div>
                <Form :label-width="90" label-position="left">
                  <FormItem class="mb2" label="手机号码">18716754321</FormItem>
                  <FormItem class="mb2" label="用户名">张三</FormItem>
                  <FormItem class="mb2" label="昵称">轻轻的晴</FormItem>
                  <FormItem class="mb2" label="性别">男</FormItem>
                  <FormItem class="mb2" label="所属城市">邻水</FormItem>
                </Form>
              </div>
            </Col>
            <Col span="12">
              <div class="info-head">
                <span class="icon" style="background-color: #7EC77E">
                  <Icon type="social-twitch"></Icon>
                </span>
                <span class="info-title" style="color: #7EC77E">账号信息</span>
              </div>
              <div>
                <Form :label-width="90" label-position="left">
                  <FormItem class="mb2" label="用户ID">129872</FormItem>
                  <FormItem class="mb2" label="邮箱">1234@gmail.com</FormItem>
                  <FormItem class="mb2" label="微信openid">xxxxxxxxxxxxxxxxxxxxxxx</FormItem>
                  <FormItem class="mb2" label="身份证号">412829198307055614</FormItem>
                  <FormItem class="mb2" label="收货地址">xxxxxxxxxxxxxxxxxxxxxxx</FormItem>
                </Form>
              </div>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col :lg="6" :md="8">
        <Card style="margin-left:12px" class="mb10" :bordered="false" title="账号安全">
          <Form :label-width="80" label-position="left">
            <FormItem class="mb2" label="注册时间">2011-09-09 12:12:12</FormItem>
            <FormItem class="mb2" label="最近登录">2018-09-09 12:12:12</FormItem>
            <FormItem class="mb2" label="登录方式">微信H5/App</FormItem>
            <FormItem class="mb2" label="IP地址">192.168.1.129</FormItem>
            <FormItem class="mb2" label="密码修改">2018-09-09 12:12:12</FormItem>
          </Form>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'UserMemberCenter',
  data () {
    return {
      userData: {}
    }
  },
  created () {
    // this.getUserData()
  },
  methods: {
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
  }
}
</script>
<style lang="less" scoped>
.avatar-box{
  text-align: center;
  img{
    height: 120px;
    height: 120px;
    border-radius: 50%;
    border: 3px solid #ededed;
  }
  h4{
    color: #495060;
    font-size: 16px;
    font-weight: normal;
    letter-spacing: 1px;
    margin-top: 6px;
  }
  p{
    color: #80848f;
    margin-top: 0px;
  }
}
.mb2{
  margin-bottom: 0px;
}
.data-box{
  display: flex;
  background-color: #fff;
  justify-content: center;
  padding: 10px 0 0 0;
  .data-item{
    flex: 1;
    text-align: center;
    color: #495060;
    max-width: 110px;
    h5{
      font-size: 16px;
      font-weight: normal;
    }
    p{
      font-size: 14px;
    }
  }
}
.info-head{
  padding: 10px;
  vertical-align: top;
  .info-title{
    font-size: 17px;
    display: inline-block;
    height: 40px;
    color: #8F6AD4;
  }
  .icon{
    display: inline-block;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    background-color: #8F6AD4;
    color: #fff;
    text-align: center;
    line-height: 50px;
    i{
      font-size: 26px;
    }
  }
}
</style>
