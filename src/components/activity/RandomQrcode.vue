<template>
  <div class="box">
    <Icon class="icon" type="ios-settings-outline" @click.native="drawer = true"/>
    <div class="title-img">
      <img src="http://cdn.cqyyy.cn/pic/20190725110946.png" alt="">
    </div>
    <div class="rang-img1">
      <img src="http://cdn.cqyyy.cn/pic/20190725110948.png" alt="">
    </div>
    <div class="rang-img2">
      <img src="http://cdn.cqyyy.cn/pic/20190725110949.png" alt="">
    </div>
    <div class="body-img">
      <div class="img727">
        <img src="http://cdn.cqyyy.cn/pic/20190725110947.png" alt="">
      </div>
      <div class="qrcodebox">
        <h4 class="cardname">{{cardname}}</h4>
        <img class="qrcode" :src="qrimgurl" :style="codeStyle" alt="">
        <p class="tip">{{message}} (卡券id {{goodsid}})</p>
        <div class="btns" v-show="errorShow">
          <Alert type="error">连接服务器失败，点击下面按钮或刷新页面 !</Alert>
          <Button @click="webScoketConnect">尝试重新连接</Button>
        </div>
      </div>
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
        <FormItem label="商品ID">
          <Input placeholder="活动商品id" v-model="newSetId">
             <div slot="append">
               <Button @click="onClickSetId">设置</Button>
             </div>
          </Input>
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
      message: '',
      qrheight: 400,
      qrwidth: 400,
      noimg: 'http://cdn.cqyyy.cn/pic/20190610172641.png',
      errorShow: false,
      goodsid: '',
      newSetId: '',
      cardname: ''
    }
  },
  created () {
    this.webScoketConnect()
    this.goodsid = this.$route.query.merchantcode
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
          this.cardname = obj.data.name || ''
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
    },
    onClickSetId () {
      if (!this.goodsid) {
        return false
      }
      let url = 'http://admin.cqyyy.cn/#/RandomQrcode?merchantcode=' + this.newSetId
      window.open(url)
    }
  }
}
</script>
<style lang="less" scoped>
.box{
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex-direction: column;
  background-color: #FFF4C7;
  overflow: hidden;
  .title-img{
    position: absolute;
    top: 30px;
    left: 50px;
    height: 80px;
    img{
      max-height: 100%;
    }
  }
  .rang-img1{
    position: absolute;
    left: -50px;
    bottom: -70px;
    height: 350PX;
    img{
      max-height: 100%;
    }
  }
  .rang-img2{
    position: absolute;
    right: -50px;
    top: -100px;
    height: 360PX;
    img{
      max-height: 100%;
    }
  }
  .body-img{
    position: absolute;
    padding: 0 10%;
    box-sizing: border-box;
    width: 100%;
    height: 450px;
    display: flex;
    flex-direction: row;
    .img727{
      height: 100%;
      float: left;
      // width: 300px;
      img{
        max-height: 100%;
      }
    }
    .qrcodebox{
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      flex: 1;
    }
  }
  .cardname{
    font-size: 34px;
    color: #555;
  }
  .qrcode{
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
    z-index: 99;
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
  .settings{
    cursor: pointer;
  }
}
</style>
