<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="http://cdn.cqyyy.cn/PREVIEW.svg" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">{{blockData.name}}</span></h4>
        <p>{{blockData.desc}}
          <router-link :to="{name: 'Templates'}">返回【模板页列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card :bordered="false">
      <div class="tmp-box">
        <div class="draft-warp">
          <div class="warp-left">
            <div class="content">
              <p class="tip">效果预览</p>
              <p class="title">{{blockData.name}}</p>
              <img class="phone-title" src="http://cdn.cqyyy.cn/12e73dca6848e7977396a6fa123b9140.png" alt="">
              <div class="preview"></div>
            </div>
            <Button>新增</Button>
          </div>
          <div class="warp-right">
            <div class="content">
              <p class="tip">草稿区，请注意保存</p>
              <div class="draft">2</div>
            </div>
          </div>
        </div>
        <div class="form-warp">
          <div class="form-box">
            <Form :model="addData" :label-width="80">
              <FormItem label="选择城市" v-show="draftCity==0" required>
                <Select v-model="addData.city">
                  <Option :value="0">通用</Option>
                  <Option v-for="(item, index) in cityList" :key="index" :value="item.id">{{item.areaname}}</Option>
              </Select>
              </FormItem>
              <FormItem label="上传图片">
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
                    <Alert closable show-icon>图片大小不要超过200kb。选择商品或卡券时不传图片默认为商品/卡券主图。</Alert>
                    <Input v-model="addData.imgurl" placeholder="或者直接输入图片连接地址" />
                  </div>
                  <div style="padding: 5px 0">
                    <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    <p>点击或拖动图片到此处上传</p>
                  </div>
                </Upload>
              </FormItem>
              <FormItem label="跳转类型" required>
                <Select v-model="addData.urltype">
                  <Option value="1">商品详情</Option>
                  <Option value="2">卡券详情</Option>
                  <Option value="5">模板页</Option>
                  <Option value="4">外部链接</Option>
                  <Option value="3">内部路由</Option>
                  <Option value="6">商户首页</Option>
                  <Option value="0">不跳转</Option>
              </Select>
              </FormItem>
              <FormItem label="跳转地址">
                <Input v-model="addData.url" placeholder="请输入" />
              </FormItem>
              <FormItem label="描述">
                <Input size="small" type="textarea" v-model="addData.name" placeholder="请输入，图文广告时文字描述" />
              </FormItem>
              <FormItem label="排序">
                <InputNumber :max="99999999" :min="1" v-model="addData.sort"></InputNumber>
              </FormItem>
              <FormItem>
                <Button type="primary" :loading="submitLoading" @click="onClickAddSon">添加</Button>
                <!-- <Button type="primary" @click="onClickSaveSon" v-show="editSonShow">保存</Button> -->
                <!-- <Button type="default"  style="margin-left:10px">取消</Button> -->
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { uploadApiUrl } from '../../config/'
export default {
  name: 'TemplatesAdd',
  data () {
    return {
      uploadApiUrl: uploadApiUrl,
      submitLoading: false,
      addData: {
        city: 0,
        urltype: '',
        url: '',
        sort: '',
        type: '1',
        imgurl: ''
      },
      cityList: [],
      blockData: {},
      draftData: [],
      infoData: []
    }
  },
  created () {
    this.getModulesInfo()
    this.getCityData()
  },
  methods: {
    getModulesInfo () {
      let d = {
        id: this.$route.params.id
      }
      serverApi('/web/areasonindex', d,
        response => {
          // console.log(response)
          if (response.data.code === 0) {
            this.draftData = []
            this.blockData = response.data.data.area
            let arr = []
            response.data.data.areason.forEach(item => {
              let obj ={
                city: item.city,
                id: item.id,
                order: item.order,
                pid: item.pid,
                type: item.type,
                imgs: JSON.parse(item.imgs)
              }
              arr.push(obj)
            })
            this.infoData = arr
            // console.log(this.infoData)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.$Message.error(error.toString())
        }
      )
    },
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
    onClickAddSon () {
      if (!this.addData.imgurl && !this.addData.url) {
        this.$Message.warning('请输入信息')
        return false
      }
      console.log(this.addData)
      let obj = Object.assign({}, this.addData)
    },
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
.tmp-box{
  display: flex;
  flex-flow: row;
  width: 100%;
  .draft-warp{
    width: 660px;
    .warp-left{
      width: 320px;
      float: left;
      .content{
        width: 320px;
        border: 1px solid #ddd;
        position: relative;
        font-size: 0;
        .phone-title{
          width: 100%;
        }
        .tip{
          height: 24px;
          font-size: 12px;
          background-color: #FFF9E6;
          text-align: center;
          line-height: 24px;
          color: #FFB08F;
        }
        .title{
          position: absolute;
          top: 57px;
          left: 0;
          right: 0;
          text-align: center;
          color: #fff;
          font-size: 14px;
        }
        .preview{
          height: 400px;
          width: 100%;
          overflow: auto;
        }
      }
    }
    .warp-right{
      float: left;
      margin-left: 20px;
      width: 320px;
      .content{
        border: 1px solid #ddd;
        .tip{
          height: 24px;
          font-size: 12px;
          background-color: #FFF9E6;
          text-align: center;
          line-height: 24px;
          color: #FFB08F;
        }
        .draft{
          height: 463px;
          width: 100%;
        }
      }
    }
  }
  .form-warp{
    flex: 1;
    padding-left: 20px;
    padding-top: 10px;
    .form-box{
      max-width: 800px;
      min-width: 300px;
    }
  }
}
</style>
