<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="http://cdn.cqyyy.cn/PREVIEW.svg" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">{{blockData.name}}</span></h4>
        <p>{{blockData.desc}}
          <router-link :to="{name: 'Modules'}">返回【首页板块列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card :bordered="false" dis-hover class="card-wrap">
      <div class="preview-box">
        <div class="add-box">
          <Poptip trigger="click" placement="bottom">
            <Button type="dashed" style="width: 170px" @click="onClickAddBlock" long icon="md-add">添加</Button>
            <div slot="title">添加功能块</div>
            <div slot="content">
              <Row>
                <Col span="12" style="padding: 0 3px">
                  <Button type="dashed" style="width: 112px" @click="onSelectBlockItem(1)">100%宽度图片</Button>
                </Col>
                <Col span="12" style="padding: 0 3px">
                  <Button type="dashed" style="width: 112px" @click="onSelectBlockItem(2)">50%宽度图片</Button>
                </Col>
              </Row>
              <Row style="margin-top:6px">
                <Col span="12">
                  <Button type="dashed" style="width: 112px" @click="onSelectBlockItem(3)">横向滚动区域</Button>
                </Col>
                <Col span="12">
                  <Button type="dashed" style="width: 112px" @click="onSelectBlockItem(4)">图文广告区域</Button>
                </Col>
              </Row>
            </div>
          </Poptip>
        </div>
      </div>
      <div class="edit-box" v-show="draftShow">
        <div class="draft">
          <p class="draft-tip">草稿区，请注意保存</p>
          <p class="draft-title">{{typename}}</p>
          <Row>
            <Col :span="typeSpan" v-for="(item, index) in draftData" :key="index">
              <div class="draft-preview" @mouseover="onDraMouseOver(index)" @mouseout="onDraMouseOut(index)">
                <span class="del" v-show="index == draIndex">删除</span>
                <img :src="item.imgurl" alt="">
              </div>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <div class="addItem" @click="onClickAddItem">
                <Icon type="ios-add"></Icon>
              </div>
            </Col>
          </Row>
        </div>
        <div style="padding-top: 10px; text-align:center">
          <Button type="default" style="width:80px">保存</Button>
        </div>
      </div>
      <div class="form-box" v-show="formShow">
        <Form :model="addData" :label-width="80">
          <FormItem label="选择城市" required>
            <Select v-model="addData.city">
              <Option value="0">通用</Option>
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
              <Option value="0">不跳转</Option>
           </Select>
          </FormItem>
          <FormItem label="跳转地址">
            <Input v-model="addData.url" placeholder="请输入" />
          </FormItem>
          <FormItem label="排序">
            <InputNumber :max="99999999" :min="1" v-model="addData.sort"></InputNumber>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="onClickAddSon" >添加</Button>
            <Button type="default" :to="{name: 'BannerConfig'}" style="margin-left:10px">取消</Button>
          </FormItem>
        </Form>
      </div>
      <div class="clear-fix"></div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { uploadApiUrl } from '../../config/'
import BScroll from 'better-scroll'
export default {
  name: 'ModulesAdd',
  data () {
    return {
      uploadApiUrl: uploadApiUrl,
      submitLoading: false,
      draftShow: false,
      formShow: false,
      addData: {
        city: '0',
        urltype: '',
        url: '',
        sort: '',
        type: '1',
        imgurl: ''
      },
      cityList: [],
      blockData: {},
      InfoData: [],
      typeSpan: 24,
      selectType: 1,
      typename: '',
      draftData: [],
      draIndex: -1,
    }
  },
  created () {
    let id = this.$route.params.id
    this.getModulesInfo(id)
    this.getCityData()
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
    getModulesInfo (id) {
      let d = {
        id: id
      }
      serverApi('/web/areasonindex', d,
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.blockData = response.data.data.area
            this.InfoData = response.data.data.areason
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
        this.addData.imgurl = url
      }
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
      this.submitLoading = true
      // serverApi('/web/webadd', this.addData,
      //   response => {
      //     console.log(response)
      //   },
      //   error => {
      //     console.log(error)
      //     this.$Message.error(error.toString())
      //   }
      // )
    },
    onSelectBlockItem (e) {
      this.selectType = e
      this.draftShow = true
      switch (e) {
        case 1:
          this.typeSpan = 24
          this.typename = '100%宽度区域'
          break
        case 2:
          this.typeSpan = 12
          this.typename = '50%宽度区域'
          break
        case 3:
          this.typeSpan = 24
          this.typename = '横向滚动区域'
          break
        case 4:
          this.typeSpan = 24
          this.typename = '图文广告区域'
          break
      }
    },
    onDraMouseOver (index) {
      this.draIndex = index
    },
    onDraMouseOut () {
      this.draIndex = -1
    },
    onClickAddItem () {
      this.formShow = true
    },
    onClickAddSon () {
      if (!this.addData.imgurl && !this.addData.url) {
        this.$Message.warning('请输入信息')
        return false
      }
      console.log(this.addData)
      let obj = Object.assign({}, this.addData)
      this.draftData.push(obj)
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
.card-wrap{
  position: relative;
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
.preview-box{
  width: 320px;
  height: 450px;
  background-color: #fafafa;
  border: 1px solid #ddd;
  float: left;
  .add-box{
    margin-top: 20px;
    text-align: center;
  }
}
.edit-box{
  float: left;
  padding-left: 30px;
  .draft{
    width: 320px;
    height: 450px;
    box-sizing: border-box;
    background-color: #fff;
    border: 1px solid #ddd;
    overflow: auto;
    .addItem{
      width: 80px;
      height: 40px;
      border: 1px dashed #ddd;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      margin-top: 15px;
      cursor: pointer;
      background-color: #fafafa;
      &:hover{
        border: 1px dashed #2d8cf0;
        background-color: #fff;
        i{
          color: #2d8cf0;
        }
      }
      i{
        font-size: 30px;
        color: #ddd;
      }
    }
    &-tip{
      height: 20px;
      background-color: #FFF9E6;
      color: rgb(233, 193, 101);
      font-size: 12px;
      text-align: center;
      line-height: 20px;
      padding-top: 1px;
    }
    &-title{
      color: #666;
      font-size: 12px;
      text-align: center;
      height: 25px;
      line-height: 25px;
      background-color: #fff;
    }
  }
}
.draft-preview{
  position: relative;
  box-sizing: border-box;
  border:solid 1px transparent;
  font-size: 0;
  transition: all .2s ease;
  &:hover{
    border: 1px dashed #222;
  }
  .del{
    display: block;
    height: 12px;
    width: 30px;
    position: absolute;
    right: 10px;
    top: 10px;
    color: red;
    font-size: 14px;
    z-index: 1;
  }
  img{
    width: 100%;
  }
}
.form-box{
  float: left;
  padding-left: 30px;
  min-width: 300px;
  max-width: 700px;
}
</style>
