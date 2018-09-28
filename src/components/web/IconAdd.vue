<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="http://cdn.cqyyy.cn/PREVIEW.svg" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">新增Icon</span></h4>
        <p>Icon 轮播图配置。图片，跳转action.&nbsp;&nbsp;&nbsp;
          <router-link :to="{name: 'IconConfig'}">返回【Icon列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card :bordered="false">
      <div class="from-box">
        <Form :model="addData" :label-width="80">
          <FormItem label="选择城市" required>
            <Select v-model="addData.city">
              <Option value="0">通用</Option>
              <Option v-for="(item, index) in cityList" :key="index" :value="item.id">{{item.areaname}}</Option>
           </Select>
          </FormItem>
          <FormItem label="上传图片" required>
            <Upload
              type="drag"
              :action="uploadApiUrl"
              :on-error="uploadImgErr"
              :on-success="uploadImgSucc"
              :show-upload-list="true"
              accept="image/*"
              :on-progress="onUploadProgress"
              :on-preview="onClickListItem"
              >
              <div slot="tip" style="margin-top:10px;">
                <Alert closable show-icon>图片大小不要超过200kb, 最佳尺寸为(宽*高)100px*100px</Alert>
                <Input v-model="addData.imgurl" placeholder="或者直接输入图片连接地址" />
              </div>
              <div style="padding: 10px 0">
                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                <p>点击或拖动图片到此处上传</p>
              </div>
            </Upload>
            <div class="img-box">
              <img v-imgview :src="addData.imgurl" alt="">
            </div>
          </FormItem>
          <FormItem label="下方文字" required>
            <Input v-model="addData.imgname" placeholder="请输入，不超过四个字" />
          </FormItem>
          <FormItem label="跳转类型" required>
            <Select v-model="addData.urltype">
                <Option v-for="(item, index) in jumpAction" :key="index" :value="item.value">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem label="跳转地址" required>
            <Input v-model="addData.url" placeholder="请输入" />
          </FormItem>
          <FormItem label="排序">
            <InputNumber :max="99999999" :min="1" v-model="addData.sort"></InputNumber>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="onClickSubmit" :loading="submitLoading">提交</Button>
            <Button type="default" :to="{name: 'IconConfig'}" style="margin-left:10px">返回</Button>
          </FormItem>
        </Form>
      </div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { uploadApiUrl } from '../../config/'
export default {
  name: 'IconAdd',
  data () {
    return {
      uploadApiUrl: uploadApiUrl,
      submitLoading: false,
      addData: {
        city: '0',
        urltype: '',
        url: '',
        sort: '',
        type: '2',
        imgurl: '',
        imgname: ''
      },
      cityList: []
    }
  },
  created () {
    this.getCityData()
  },
  computed: {
    jumpAction () {
      return this.$store.state.actionTypeArr
    }
  },
  methods: {
    getCityData () {
      this.$store.commit('pageLoading', true)
      serverApi('/area/index', {},
        response => {
          if (response.data.code === 0){
            this.cityList = response.data.data
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
    },
    uploadImgErr (response, file, fileList) {
      this.$Message.warning('上传失败！')
      console.log('err'+response,file,fileList)
    },
    uploadImgSucc (response, file) {
      console.log(response)
      if (response.code == 0) {
        this.$Notice.success({
          title: '上传成功',
          desc: '图片上传成功！'
        })
        let url = response.data.url
        this.addData.imgurl = url
      }
    },
    onClickListItem (e) {
      this.addData.imgurl = e.response.data.url
    },
    onUploadProgress (e, file, fileList) {
      console.log(e)
    },
    onClickSubmit () {
      if (!this.addData.imgurl) {
        this.$Message.warning('请上传图片')
        return false
      }
      if (!this.addData.urltype) {
        this.$Message.warning('请选择链接类型')
        return false
      }
      if (!this.addData.url) {
        this.$Message.warning('请输入连接地址')
        return false
      }
      if (!this.addData.imgname) {
        this.$Message.warning('请输入ICON文字')
        return false
      }
      this.submitLoading = true
      serverApi('/web/webadd', this.addData,
        response => {
          this.submitLoading = false
          if (response.data.code === 0) {
            this.$Message.success(response.data.msg)
            this.$router.push({name: 'IconConfig'})
          } else {
            this.$Message.warning(response.data.msg)
          }
          console.log(response)
        },
        error => {
          this.submitLoading = false
          console.log(error)
          this.$Message.error(error.toString())
        }
      )
    }
  }
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
.from-box{
  max-width: 650px;
  min-width: 320px;
  margin: 0 auto;
}
.img-box{
  position: absolute;
  right: 0;
  top: 0;
  transform: translateX(100%);
  text-align: left;
  img{
    max-width: 300px;
    height: 130px;
  }
}
</style>
