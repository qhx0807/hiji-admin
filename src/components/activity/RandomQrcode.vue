<template>
  <div class="box">
    <img :src="qrimgurl" :style="codeStyle" alt="">
    <p class="tip">{{message}}</p>
    <Icon class="icon" type="ios-settings-outline" @click.native="drawer = true"/>
    <div class="btns" v-show="errorShow">
      <Alert type="error">连接服务器失败，点击下面按钮或刷新页面 !</Alert>
      <Button @click="webScoketConnect">尝试重新连接</Button>
    </div>
    <Drawer title="二维码设置" v-model="drawer" width="320">
      <Form label-position="top">
        <FormItem label="显示文字">
          <Input v-model="message"></Input>
        </FormItem>
        <FormItem label="二维码高度">
          <Slider v-model="qrheight" :min="0" :max="1000" show-input input-size="small"></Slider>
        </FormItem>
        <FormItem label="二维码宽度">
          <Slider v-model="qrwidth" :min="0" :max="1000" show-input input-size="small"></Slider>
        </FormItem>
    </Form>
    </Drawer>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'RandomQrcode',
  data () {
    return {
      ws: null,
      drawer: false,
      qrimgurl: '',
      message: '微信扫一扫',
      qrheight: 400,
      qrwidth: 400,
      noimg: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      errorShow: false
    }
  },
  created () {
    this.webScoketConnect()
  },
  computed: {
    codeStyle () {
      return {
        height: this.qrheight + 'px',
        width: this.qrwidth + 'px'
      }
    }
  },
  methods: {
    onerrorHandler () {
      this.qrimgurl = this.noimg
      this.errorShow = true
    },
    webScoketConnect () {

      // console.log(this.$route.query)
      let merchantcode = this.$route.query.merchantcode
      let d = { merchantcode: merchantcode }
      let merchantInfo = JSON.stringify(d)
      if (! 'WebSocket' in window) {
        this.$modal.warning({
          title: '提示',
          content: '您的浏览器不支持, 请使用Google Chrome浏览器'
        })
        return false
      }

      this.$Message.loading({
        content: '连接服务器中...',
        duration: 0
      })

      this.ws = new WebSocket('ws://47.107.39.205:1008')

      this.ws.onopen = () => {
        this.$Message.destroy()
        this.ws.send(merchantInfo)
      }

      this.ws.onmessage = (e) => {
        let obj = JSON.parse(e.data)
        console.log(obj)
        if (obj.code === 0) {
          this.errorShow = false
          this.qrimgurl = obj.data.url
          this.$Notice.success({
            title: '提示',
            desc: '二维码链接已更新'
          })
        } else {
          this.$Notice.warning({
            title: '提示',
            desc: obj.msg
          })
          this.onerrorHandler()
        }
      }

      this.ws.onerror = (e) => {
        this.$Notice.warning({
          title: '提示',
          desc: '连接失败，请重试'
        })
        this.$Message.destroy()
        this.onerrorHandler()
      }

      this.ws.onclose = () => {
        this.$Message.destroy()
        this.$Notice.warning({
          title: '提示',
          desc: '服务器链接已关闭！'
        })
        this.onerrorHandler()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.box{
  height: 100%;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-direction: column;
  img{
    height: 400px;
    width: 400px;
  }
  .tip{
    font-size: 14px;
    color: #666;
  }
  .btns{
    padding: 20px 0;
    text-align: center;
  }
  .icon{
    position: absolute;
    right: 30px;
    top: 30px;
    font-size: 20px;
    color: #444;
    opacity: .8;
    cursor: pointer;
    &:hover{
      opacity: 1;
    }
  }
}
</style>
