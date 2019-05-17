<template>
  <div class="box">
    <Card :bordered="false">
      <div class="wrap">
        <div class="framebox">
          <iframe :src="frameUrl" frameborder="0"></iframe>
        </div>
        <div class="optsbox">
          <Alert show-icon>若要返回上一页，请点击左上角浏览器的后退按钮</Alert>
           <Form :label-width="80">
              <FormItem label="用户手机号">
                <Input v-model="userphone" placeholder="手机号"></Input>
              </FormItem>
              <FormItem>
                <Button :loading="loading" type="primary" @click="onClickSet">设置数据</Button>
              </FormItem>
           </Form>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'UserInterface',
  data () {
    return {
      frameUrl: 'http://m.cqyyy.cn/hiji-web/dist/index.html#/Index/4',
      loading: false,
      userphone: '',
    }
  },
  created () {},
  methods: {
    onClickSet () {
      if (this.userphone.length != 11) {
        this.$Message.warning('手机号不正确！')
        return false
      }
      this.loading = true
      serverApi('/member/memberlist', {like: this.userphone},
        response => {
          this.loading = false
          if (response.data.code === 0) {
            // 返回 userid, token
            // 垮域名设置sessionStroge
            if (response.data.data.reuslt.length > 0) {
              let t = new Date().valueOf()
              this.frameUrl = 'http://m.cqyyy.cn/redirect/index.html?userid='+response.data.data.reuslt[0].userid+'&token='+response.data.data.token+'&time=' + t
            } else {
              this.$Message.warning('未查询到数据！')
            }
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.loading = false
          this.$Message.error(error.toString())
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
.box{
  .wrap{
    padding-left: 20px;
    display: flex;
    flex-direction: row;
    .framebox{
      width: 356px;
      height: 666px;
      border: 1px solid #ddd;
      flex-shrink: 0;
      // margin: 0 auto;
      iframe{
        height: 100%;
        width: 100%;
      }
    }
    .optsbox{
      padding-left: 30px;
      padding-top: 30px;
      width: 400px;
    }
  }
}
</style>
