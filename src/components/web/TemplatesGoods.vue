<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <!-- <div class="shop-img">
        <img src="http://cdn.cqyyy.cn/PREVIEW.svg" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">{{blockData.name}} {{blockData.city}}</span></h4>
        <p>{{blockData.desc}}
          <router-link :to="{name: 'Templates'}">返回【模板页列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div> -->
      <Row>
        <Col span="8">
          <Input v-model="goodsids" :placeholder="placeholder">
            <Select v-model="selectType" slot="prepend" style="width: 80px">
              <Option value="1">商品ID</Option>
              <Option value="2">分类ID</Option>
            </Select>
          </Input>
        </Col>
        <Col span="4">
          <Button style="margin-left:12px" :loading="addLoading" @click="onClickSaveAdd">添加到页面</Button>
        </Col>
        <Col span="8"  style="padding-left:20px;">
          <Input v-model="topimg" placeholder="上传页面顶部图片，没有则不显示" />
        </Col>
        <Col span="4"  style="padding-left:12px;">
          <Upload
            :action="uploadApiUrl"
            :on-error="uploadImgErr"
            :on-success="uploadImgSucc"
            :show-upload-list="false"
            accept="image/*">
            <Button icon="ios-cloud-upload-outline">上传专题图</Button>
          </Upload>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false">
      <Row>
        <Col span="12">
          <Input prefix="ios-search" v-model="searchKeys" style="width: 300px" placeholder="搜索..."></Input>
          <Button style="margin-left:12px" type="primary" :loading="submitLoading" :disabled="disabledBtn" @click="onClickSavePx">保存修改</Button>
        </Col>
      </Row>
    </Card>
    <Row>
      <Col span="24">
        <div class="hot-content">
          <Spin fix size="large" v-show="spinShow"></Spin>
          <draggable element="ul" v-model="list">
            <li v-for="item in list">{{item}}</li>
          </draggable>
        </div>
      </Col>
    </Row>
  </div>
</template>
<script>
import serverApi from '../../axios'
import draggable from 'vuedraggable'
import { uploadApiUrl } from '../../config/'
export default {
  name: 'TemplatesGoods',
  components: {
    draggable
  },
  data () {
    return {
      uploadApiUrl: uploadApiUrl,
      searchKeys: '',
      addLoading: false,
      submitLoading: false,
      spinShow: false,
      disabledBtn: false,
      blockData: {},
      goodsData: [],
      selectType: '1',
      goodsids: '',
      topimg: '',
      list: [2,3,45,5,67,8]
    }
  },
  created () {
    this.getModulesInfo()
  },
  computed: {
    placeholder () {
      return this.selectType == '1' ? '输入商品ID,以逗号分隔' : '商品分类ID，单个id'
    },
  },
  methods: {
    getModulesInfo () {
      let d = {
        id: this.$route.params.id
      }
      serverApi('/web/areasonindex', d,
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.blockData = response.data.data.area
            this.goodsData = response.data.data.areason[0]
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
        this.topimg = url
      }
    },
    onClickSaveAdd () {
      let reg = /^[\d,]*$/
      if (!reg.test(this.goodsids) || !this.goodsids) {
        this.$Message.warning('输入的id格式不正确，请检查')
        return false
      }
      let imgs = {
        topimg: this.topimg,
        ids: this.goodsids
      }
      let d = {
        addtype: this.selectType,
        ptype: this.blockData.type,
        id: '',
        imgs: JSON.stringify(imgs),
        pid: this.$route.params.id
      }
      this.addLoading = true
      serverApi('/web/webareasonedit', d,
        response => {
          this.addLoading = false
          if (response.data.code === 0) {
            this.getModulesInfo(this.$route.params.id)
            this.$Message.success(response.data.msg)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.addLoading = false
          this.$Message.error(error.toString())
        }
      )
    },
    onClickSavePx () {

    }
  }
}
</script>
<style lang="less" scoped>
.hot-content{
  padding: 16px;
  border: 1px solid #dedede;
  height: 550px;
  overflow: auto;
  background-color: #f5f5f5;
  position: relative;
  .goods-item{
    height: 240px;
    width: 150px;
    position: relative;
    overflow: hidden;
    background-color: #fff;
    float: left;
    margin-right: 10px;
    margin-bottom: 12px;
    &:hover{
      .mask{
        display: block;
      }
    }
    img{
      width: 100%;
      height: 150px;
    }
    .goods-name{
      line-height: 18px;
      height: 36px;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-line-clamp: 2;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      padding: 0 5px;
    }
    .goods-price{
      color: #f44;
    }
    .goods-buy{
      display: block;
      position: absolute;
      right: 5px;
      background-color: #F46F71;
      color: #fff;
      padding: 0px 5px;
      height: 17px;
      line-height: 17px;
      border-radius: 3px;
      bottom: 5px;
    }
    .mask{
      background-color: rgba(255, 255, 255, .9);
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 9;
      display: none;
      transition: all ease .2s;
      text-align: center;
      button{
        height: 30px;
        background-color: #fff;
        border: 1px solid #F55D54;
        color: #F55D54;
        outline: none;
        width: 130px;
        text-align: center;
        cursor: pointer;
        transition: all ease .2s;
        &:first-child{
          margin-top: 60px;
          margin-bottom: 16px;
        }
        &:hover{
          background-color: #F55D54;
          color: #fff;
        }
      }
      p{
        margin-top: 70px;
      }
    }
  }
}
</style>
