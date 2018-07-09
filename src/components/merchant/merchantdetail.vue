<template>
  <div class="box">
    <Card :bordered="false">
      <div class="shop-img">
        <img :src="shopImg" alt="">
      </div>
      <div class="tips">
        <h4>{{merchantData.name}} <span style="font-size:14px;font-weight:500">商户详情</span></h4>
        <p>维护商户的详细信息，图文编辑。
          <router-link :to="{name: 'Merchant'}">返回【商户列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card style="margin-top:10px" :bordered="false">
      <Form :model="merchantData" :label-width="80">
        <Row>
          <Col span="6">
            <FormItem label="商户名称">
              <Input v-model="merchantData.name"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="商户编码">
              <Input v-model="merchantData.merchantcode"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="联系人">
              <Input v-model="merchantData.contact"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="联系电话">
              <Input v-model="merchantData.mobile"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="商户地址">
              <Input v-model="merchantData.addres"></Input>
            </FormItem>
            <FormItem label="营业时间">
              <Input v-model="merchantData.businesstime"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem style="margin-bottom: 0" label="商户缩略图">
              <Input v-model="merchantData.merchantimg"></Input>
              <Upload :show-upload-list="false" :action="uploadApiUrl" :on-success="uploadImgSucc" :on-error="uploadImgErr">
                <a>上传图片</a>
              </Upload>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="商户简介">
              <Input type="textarea" :autosize="{minRows: 3, maxRows: 4}" v-model="merchantData.info"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="商户相册">
              <div class="shop-pics">
                <ul>
                  <!-- <li>
                    <img src="http://cdn.cqyyy.cn/my-php-logo.png" alt="">
                    <transition name="fade">
                      <div class="cover">
                        <Icon type="ios-eye-outline" @click.native="handleView"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove"></Icon>
                      </div>
                    </transition>
                  </li> -->
                  <li v-for="(item, index) in photos" :key="index" @mouseover="onMouseOverLi(index)" @mouseout="onMouseOutLi">
                    <img :src="item" alt="">
                    <transition name="fade">
                      <div v-if="activeImgIndex==index" class="cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                      </div>
                    </transition>
                  </li>
                  <Upload :show-upload-list="false"
                    :action="uploadApiUrl"
                    :on-progress="uploadProgress"
                    :on-success="uploadPhotosSucc"
                    :on-error="uploadImgErr"
                    :before-upload="uploadPhotosBefore">
                    <li class="add">
                      <Icon size="40" type="ios-cloud-upload"></Icon>
                      <Progress v-show="isShowProgress" :percent="uploadPercent" hide-info></Progress>
                    </li>
                  </Upload>
                </ul>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col span="24" style="text-align:center; padding-top:30px">
          <Button :loading="modal_loading" style="width:200px" @click="onEditMerchant" type="primary">保存</Button>
        </Col>
      </Row>
    </Card>
    <Modal title="查看图片" v-model="visibleImg">
        <img :src="viewImgSrc" v-if="visibleImg" style="width: 100%">
    </Modal>
  </div>
</template>
<script>
import { uploadApiUrl } from '../../config'
import serverApi from '../../axios'
export default {
  name: 'MerchantDetail',
  data () {
    return {
      merchantID: null,
      merchantData: {},
      uploadApiUrl: uploadApiUrl,
      modal_loading: false,
      photos: [],
      uploadPercent: 0,
      isShowProgress: false,
      activeImgIndex: -1,
      viewImgSrc: '',
      visibleImg: false
    }
  },
  created () {
    if (this.$route.params.id) {
      this.merchantID = this.$route.params.id
      this.getMerchangById(this.$route.params.id)
    }
  },
  mounted () {
    let height = document.body.offsetHeight - 380
  },
  computed: {
    shopImg () {
      return this.merchantData.merchantimg || '../../../static/no-img.png'
    }
  },
  methods: {
    getMerchangById (id) {
      serverApi('/Merchant/getbyid', {id: id},
        response => {
          // console.log(response)
          if (response.data.code == 0) {
            this.merchantData = response.data.data[0]
            this.photos = response.data.data[0].photos.split(",") || []
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.$Message.error('连接失败！')
        })
    },
    uploadPhotosBefore () {
      this.uploadPercent = 0
      this.isShowProgress = true
    },
    uploadImgSucc (response, file) {
      this.merchantData.merchantimg = response.data.url
    },
    uploadImgErr (response, file, fileList) {
      this.$Message.warning('上传失败！')
      console.log('err'+response,file,fileList)
    },
    uploadProgress (e) {
      this.uploadPercent = e.percent
      if (e.percent === 100) {
        setTimeout(() => {
          this.isShowProgress = false
        }, 1000)
      }
    },
    uploadPhotosSucc(response) {
      this.photos.push(response.data.url)
      this.$Message.success('上传成功！请注意保存！')
      // console.log(response)
    },
    onEditMerchant () {
      this.modal_loading = true
      this.merchantData.photos = this.photos
      serverApi('/Merchant/edit', this.merchantData,
        response => {
          this.modal_loading = false
          if (response.data.code === 0) {
            this.$Message.info(response.data.msg)
            this.$router.push({name: 'Merchant'})
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.modal_loading = false
        }
      )
    },
    onMouseOverLi (index) {
      this.activeImgIndex = index
    },
    onMouseOutLi () {
      this.activeImgIndex = -1
    },
    handleView (path) {
      this.viewImgSrc = path
      this.visibleImg = true
    },
    handleRemove (index) {
      this.photos.splice(index, 1)
    }
  }
}
</script>
<style lang="less" scoped>
.shop-img{
  width: 90px;
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
.clear-fix{
  clear: both;
}
.shop-pics{
  padding: 10px;
  background-color: #f3f3f3;
  ul{
    list-style: none;
    padding: 0;
    &:after{
      content: "";
      display: block;
      clear: both;
    }
    li{
      float: left;
      display: block;
      margin-left: 10px;
      font-size: 0;
      width: 120px;
      height: 120px;
      transition: all ease-in-out .2s;
      position: relative;
      img{
        width: 120px;
        height: 120px;
      }
      &.add{
        height: 120px;
        width: 120px;
        cursor: pointer;
        padding: 10px;
        text-align: center;
        background-color: #fff;
        i{
          margin-top: 30px;
        }
        &:hover{
          box-shadow: 0 0 10px #ddd;
        }
      }
      .cover{
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        background-color: rgba(0, 0, 0, .6);
        z-index: 99;
        line-height: 140px;
        text-align: center;
        user-select: none;
        i{
          color: #fff;
          font-size: 30px;
          cursor: pointer;
          margin: 0 10px;
        }
      }
    }
  }
}
</style>
