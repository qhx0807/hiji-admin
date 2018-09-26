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
        <div class="content">
          <Row v-for="(p, index) in infoData" :key="p.id" :gutter="10"
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
        <div class="add-box">
          <Poptip trigger="click" transfer placement="right">
            <Button type="dashed" style="width: 170px" @click="onClickAddBlock" long icon="md-add">添加</Button>
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
            </div>
          </Poptip>
        </div>
      </div>
      <div class="edit-box" v-show="draftShow">
        <div class="draft">
          <p class="draft-tip">草稿区，请注意保存</p>
          <p class="draft-title">{{typename}}</p>
          <div class="content">
            <Row>
              <Col v-show="selectType != 3" :span="selectType == 2 ? 12 : 24" v-for="(item, index) in DraftDataSorted" :key="index">
                <div class="draft-preview" @click="onClickDraftItem(item)" @mouseover="onDraMouseOver(index)" @mouseout="onDraMouseOut(index)">
                  <span class="del" v-show="index == draIndex" @click="onClickDelDraItem(index)">删除</span>
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
          <div class="draft-form">
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
        <div style="padding-top: 10px; text-align:center">
          <Button type="default" @click="onClockSaveDraft" style="width:80px">保存</Button>
          <Button type="default" @click="onClickAddItem" icon="ios-add" >添加</Button>
        </div>
      </div>
      <div class="form-box" v-show="formShow">
        <Form :model="addData" :label-width="80">
          <FormItem label="选择城市" v-show="draftCity==0" required>
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
              <Option v-for="(item, index) in jumpAction" :key="index" :value="item.value">{{item.label}}</Option>
           </Select>
          </FormItem>
          <FormItem label="跳转地址">
            <Input v-model="addData.url" placeholder="请输入" />
          </FormItem>
          <FormItem label="描述" v-show="selectType === 4">
            <Input size="small" type="textarea" v-model="addData.name" placeholder="请输入，图文广告时文字描述" />
          </FormItem>
          <FormItem label="排序">
            <InputNumber :max="99999999" :min="1" v-model="addData.sort"></InputNumber>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="onClickAddSon" v-show="!editSonShow">添加</Button>
            <!-- <Button type="primary" @click="onClickSaveSon" v-show="editSonShow">保存</Button> -->
            <Button type="default" @click="formShow = false" v-show="!editSonShow" style="margin-left:10px">取消</Button>
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
      draftShow: true,
      formShow: false,
      editSonShow: false,
      addData: {
        city: '0',
        urltype: '',
        url: '',
        sort: '',
        type: '1',
        imgurl: '',
        name: '',
      },
      cityList: [],
      blockData: {},
      infoData: [],
      typeSpan: 24,
      selectType: 1,
      typename: '',
      draftData: [],
      draIndex: -1,
      draftName: '',
      draftCity: 0,
      draftSort: 1,
      editData: {}
    }
  },
  created () {
    let id = this.$route.params.id
    this.getModulesInfo(id)
    this.getCityData()
  },
  mounted () {
    this.$nextTick(() => {
      let a = new BScroll(this.$refs.draftWarper, {
        startX: 0,
        click: false,
        scrollX: true,
        preventDefault: true,
        eventPassthrough: 'vertical'
      })
    })
    let b = new BScroll(this.$refs.previeWarper, {
      startX: 0,
      click: false,
      scrollX: true,
      preventDefault: true,
      eventPassthrough: 'vertical'
    })
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
      this.draftShow = true
      this.draftData = []
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
      this.editSonShow = false
      this.addData = {
        city: '0',
        urltype: '',
        url: '',
        sort: '',
        type: '1',
        imgurl: ''
      }
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
      setTimeout(() => {
        this.addData = {
          city: '0',
          urltype: '',
          url: '',
          sort: '',
          type: '1',
          imgurl: ''
        }
        this.formShow = false
      }, 200)
    },
    onClickDelDraItem (index) {
      this.DraftDataSorted.splice(index, 1)
    },
    onClickDraftItem (row) {
      console.log(row);
      this.addData = row
      this.editSonShow = true
      this.formShow = true
    },
    onClickRomteItem (row) {
      // this.draftData = row.imgs
      // this.selectType = row.type
      // this.formShow = false
      // this.draftShow = true

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
    onClockSaveDraft () {
      let d = {
        id: this.editData.id || '',
        type: this.selectType,
        imgs: JSON.stringify(this.DraftDataSorted),
        order: this.draftSort,
        pid: this.$route.params.id,
        city: this.draftCity
      }
      console.log(d)
      serverApi('/web/webareasonedit', d,
        response => {
          if (response.data.code === 0) {
            this.getModulesInfo(this.$route.params.id)
            this.$Message.success(response.data.msg)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.error(error.toString())
        }
      )
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
  width: 100%;
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
  float: left;
  position: relative;
  .content{
    width: 320px;
    height: 470px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    overflow: auto;
    padding: 0px 5px;
    padding-bottom: 50px;
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
              box-sizing: border-box;
              position: relative;
              img{
                height: 116px;
                user-select: none;
                pointer-events: none;
                width: auto;
              }
            }
          }
        }
      }
    .content-bordered{
      border: 1px dashed #fff;
      transition: all ease .2s;
      cursor: pointer;
      position: relative;
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
    &::-webkit-scrollbar{
      width: 0px;
      height: 0px;
      background-color: #fff;
    }
  }
  .add-box{
    margin-top: 20px;
    text-align: center;
    position: absolute;
    bottom: 0px;
    padding: 10px 0 0 0;
    border-top: 1px solid #ddd;
    background-color: #fff;
    left: 0;
    right: 0;
  }
  .pre-img{
    width: 100%;
    font-size: 0;
    img{
      width: 100%;
    }
  }
}
.edit-box{
  float: left;
  padding-left: 30px;
   &::-webkit-scrollbar{
    width: 0px;
    height: 0px;
    background-color: #fff;
  }
  .draft{
    width: 320px;
    position: relative;
    box-sizing: border-box;
    background-color: #fff;
    border: 1px solid #ddd;
    overflow: auto;
    .content{
      height: 380px;
      overflow: auto;
      padding-bottom: 50px;
      &::-webkit-scrollbar{
        width: 0px;
        height: 0px;
        background-color: #fff;
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
    }
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
    &-form{
      position: absolute;
      background-color: #fff;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 5px 0;
      border-top: 1px solid #dddddd;
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
    border: 1px dashed #2d8cf0;
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
    cursor: pointer;
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
