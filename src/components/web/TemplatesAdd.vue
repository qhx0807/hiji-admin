<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="http://cdn.cqyyy.cn/PREVIEW.svg" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">{{blockData.name}} {{blockData.city}}</span></h4>
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
              <div class="preview">
                <Row v-for="(p, index) in infoData" :key="p.id"
                  type="flex"
                  justify="end"
                  @click.native="onClickRomteItem(p)"
                  class="content-bordered">
                  <span class="del-text" @click.stop="onClickDelSon(p)">删除</span>
                  <Col v-show="p.type != 3" :span="p.type == 2 ? 12 : 24" v-for="(s, i) in p.imgs" :key="i">
                    <div class="pre-img">
                      <img :src="s.imgurl" alt="">
                    </div>
                  </Col>
                  <Col span="24" v-show="p.type == 3">
                    <div class="swiper" ref="previeWarper">
                      <div class="sw-content">
                        <ul>
                          <li v-for="(s, i) in p.imgs" :key="i">
                            <img :src="s.imgurl" alt="">
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </div>
          </div>
          <div class="warp-right">
            <div class="content">
              <p class="tip">草稿区，请注意保存</p>
              <div class="draft">
                <Row>
                  <Col v-show="selectType != 3" :gutter="selectType == 2 ? 10 : 0" :span="selectType == 2 ? 12 : 24" v-for="(item, index) in DraftDataSorted" :key="index">
                    <div class="draft-preview" @click="onClickDraftItem(item)">
                      <span class="del" @click="onClickDelDraItem(index)">删除</span>
                      <img :src="item.imgurl" alt="">
                    </div>
                  </Col>
                  <Col span="24" v-show="selectType == 3">
                    <div class="swiper" ref="draftWarper">
                      <div class="sw-content">
                        <ul>
                          <li v-for="(item, index) in DraftDataSorted" @click="onClickDraftItem(item)" :key="index">
                            <span class="sw-text" @click="onClickDelDraItem(index)">删除</span>
                            <img :src="item.imgurl" alt="">
                          </li>
                        </ul>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div class="bottom-city">
                <Form :label-width="40">
                  <Row>
                    <Col span="12">
                      <FormItem label="城市" style="margin-bottom: 0">
                        <Select v-model="draftCity" transfer style="width:100px" size="small">
                          <Option :value="0">通用</Option>
                          <Option v-for="(item, index) in cityList" :key="index" :value="item.id">{{item.areaname}}</Option>
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span="12">
                      <FormItem label="排序" style="margin-bottom: 0">
                        <InputNumber size="small" style="width:100px" :max="99999999" :min="1" v-model="draftSort"></InputNumber>
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
            <div style="text-align:center;padding-top:8px">
              <Button @click="onClickSave" :loading="submitLoading">保存</Button>
              <Poptip trigger="click" transfer placement="top">
                <Button type="dashed" @click="onClickAddBlock" long icon="md-add">添加</Button>
                <div slot="title" style="text-align:center">添加功能块</div>
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
                  <!-- <Row style="margin-top:6px">
                    <Col span="12">
                      <Button type="dashed" style="width: 112px" @click="onSelectBlockItem(5)">导入商品/分类ID</Button>
                    </Col>
                  </Row> -->
                </div>
              </Poptip>
            </div>
          </div>
        </div>
        <div v-show="formShow" class="form-warp">
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
                  <Option v-for="(item, index) in jumpAction" :key="index" :value="item.value">{{item.label}}</Option>
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
                <Button type="primary" :loading="submitLoading" v-show="!editSonShow" @click="onClickAddSon">添加</Button>
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
      typename: '',
      cityList: [],
      blockData: {},
      draftData: [],
      infoData: [],
      selectType: 1,
      draIndex: -1,
      draftCity: 0,
      draftSort: 1,
      formShow: false,
      editSonShow: false,
      editData: {}
    }
  },
  created () {
    this.getModulesInfo()
    this.getCityData()
  },
  computed: {
    DraftDataSorted () {
      let arr = []
      let compare = (a, b) => {
        return a.sort - b.sort
      }
      return this.draftData.sort(compare)
    },
    jumpAction () {
      return this.$store.state.actionTypeArr
    }
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
    onSelectBlockItem (e) {
      this.selectType = e
      this.editSonShow = false
      this.editData = {}
      this.addData = {
        city: 0,
        urltype: '',
        url: '',
        sort: '',
        type: '1',
        imgurl: ''
      }
      this.formShow = true
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
    onClickAddSon () {
      if (!this.addData.imgurl && !this.addData.url) {
        this.$Message.warning('请输入信息')
        return false
      }
      console.log(this.addData)
      let obj = Object.assign({}, this.addData)
      this.draftData.push(obj)
      console.log(this.draftData)
    },
    onClickDraftItem (row) {
      this.addData = row
      this.editSonShow = true
      this.formShow = true
    },
    onClickRomteItem (row) {
      let obj = Object.assign({}, row)
      let imgs = JSON.parse(JSON.stringify(row.imgs))
      this.editData = obj
      this.draftData = imgs
      this.selectType = obj.type
      this.draftCity = obj.city
      this.draftSort = obj.order
      this.formShow = false
      this.draftShow = true
    },
    onClickDelDraItem (index) {
      this.editSonShow = true
      this.DraftDataSorted.splice(index, 1)
    },
    onClickDelSon (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>将此模块内容删除？</p>',
        onOk: () => {
          serverApi('/web/webareasondel', {id: row.id},
            response => {
              if (response.data.code == 0) {
                this.getModulesInfo(this.$route.params.id)
              }
              this.$Message.info(response.data.msg)
            },
            error => {
              console.log(error)
              this.$Message.error('链接失败！')
            }
          )
        }
      })
    },
    onClickSave () {
      if (this.draftData.length === 0) {
        this.$Message.warning('请添加内容！')
        return false
      }
      let d = {
        ptype: this.blockData.type,
        id: this.editData.id || '',
        type: this.selectType,
        imgs: JSON.stringify(this.DraftDataSorted),
        order: this.draftSort,
        pid: this.$route.params.id,
        city: this.draftCity
      }
      this.submitLoading = true
      console.log(d)
      serverApi('/web/webareasonedit', d,
        response => {
          this.submitLoading = false
          if (response.data.code === 0) {
            this.getModulesInfo(this.$route.params.id)
            this.$Message.success(response.data.msg)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.submitLoading = false
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
          padding: 0px;
          &::-webkit-scrollbar{
            width: 0px;
            height: 0px;
            background-color: #fff;
          }
          .content-bordered{
            // border: 1px dashed #fff;
            transition: all ease .2s;
            cursor: pointer;
            position: relative;
            .pre-img{
              font-size: 0;
              img{
                width: 100%;
              }
            }
            .del-text{
              color: #f44;
              position: absolute;
              right: 3px;
              top: 3px;
              height: 20px;
              width: 30px;
              font-size: 12px;
              z-index: 99;
              cursor: pointer;
              transition: all ease .2s;
              display: none;
              &:hover{
                font-size: 14px;
                font-weight: 600;
                color: red;
              }
            }
            &:hover{
              border: 1px dashed #2d8cf0;
              .del-text{
                display: block;
              }
            }
          }
        }
      }
    }
    .swiper{
      height: 120px;
      width: 320px;
      user-select: none;
      overflow-x: auto;
      &::-webkit-scrollbar{
        width: 0px;
        height: 0px;
        background-color: #fff;
      }
      .sw-content{
        width: 1000px;
        box-sizing: border-box;
        ul{
          padding: 0;
          margin: 0;
          list-style: none;
          li{
            float: left;
            height: 120px;
            border: 1px dashed transparent;
            box-sizing: border-box;
            position: relative;
            .sw-text{
              font-size: 12px;
              color: #f44;
              position: absolute;
              right: 3px;
              top: 3px;
              cursor: pointer;
              display: none;
            }
            img{
              height: 116px;
              user-select: none;
              pointer-events: none;
            }
            &:hover{
              border: 1px dashed #2d8cf0;
              .sw-text{
                display: block;
              }
            }
          }
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
          height: 431px;
          width: 100%;
          overflow: auto;
          position: relative;
          box-sizing: border-box;
          &::-webkit-scrollbar{
            width: 0px;
            height: 0px;
            background-color: #fff;
          }

          .draft-preview{
            position: relative;
            box-sizing: border-box;
            border: 1px inset transparent;
            font-size: 0;
            transition: all .2s ease;
            &:hover{
              border: 1px dashed #2d8cf0;
              .del{
                display: block;
              }
            }
            .del{
              display: none;
              height: 12px;
              width: 30px;
              position: absolute;
              right: 10px;
              top: 10px;
              color: red;
              font-size: 14px;
              z-index: 1;
              cursor: pointer;
            }
            img{
              width: 100%;
              font-size: 0;
            }
          }

        }
        .bottom-city{
          height: 33px;
          background-color: #fff;
          border-top: 1px solid #ddd;
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
