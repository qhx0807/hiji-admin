<style lang="less">
@import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="username">
                            <Input v-model="form.username" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="ios-person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="ios-lock"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button :loading="loading" shape="circle" @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">- 登录HI集信息管理平台 -</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import serverApi from '../../axios/index.js'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      loading: false,
      rules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    localStorage.setItem('locking', '0')
    sessionStorage.clear()
    this.requestLogin()
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          serverApi('/login', this.form,
            response => {
              console.log(response)
              this.loading = false
              if (response.data.code === 0) {
                window.sessionStorage.token = response.data.data.token
                window.sessionStorage.username = response.data.data.username
                window.sessionStorage.userid = response.data.data.userid
                window.sessionStorage.roleid = response.data.data.roleid
                window.sessionStorage.pass = this.form.password
                this.$Message.info(response.data.msg)
                this.$router.replace({name: response.data.data.dashboard})
                // if (response.data.data.userid == '25') {
                //   this.$router.replace({
                //     name: 'MerchantParking'
                //   })
                // } else {
                //   this.$router.replace({
                //     name: 'Merchant'
                //   })
                // }
              } else {
                this.$Message.info(response.data.msg)
              }
            },
            error => {
              this.loading = false
              this.$Message.warning('连接失败！')
              console.log(error)
            }
          )
        }
      })
    },
    requestLogin () {
      serverApi('/login/islogin', null,
        response => {
          if (response.data.code === 0) {
            window.sessionStorage.token = response.data.data.token
            window.sessionStorage.username = response.data.data.username
            window.sessionStorage.userid = response.data.data.userid
            window.sessionStorage.roleid = response.data.data.roleid
            window.sessionStorage.pass = this.form.password
            this.$router.replace({name: response.data.data.dashboard})
          }
        },
        error => {}
      )
    }
  }
}
</script>

<style>

</style>
