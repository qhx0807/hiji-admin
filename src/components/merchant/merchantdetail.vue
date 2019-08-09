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
            <FormItem label="所属分类" prop="categroryid">
              <Select v-model="merchantData.categroryid">
                <Option v-for="item in sortData" :value="item.id" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem style="margin-bottom: 0" label="商户缩略图">
              <Input v-model="merchantData.merchantimg"></Input>
              <Upload :show-upload-list="false" :action="uploadApiUrl" :on-success="uploadImgSucc" :on-error="uploadImgErr">
                <a>上传图片</a>
              </Upload>
            </FormItem>
            <FormItem label="打款方式" prop="billtype">
              <Select v-model="merchantData.billtype">
                <Option :value="0">线上打款</Option>
                <Option :value="1">线下打款</Option>
              </Select>
            </FormItem>
            <FormItem label="标签">
              <Select v-model="tags" multiple>
                <Option v-for="item in tagsData" :value="item.id" :key="item.id">{{ item.tagname }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="商户简介">
              <Input type="textarea" :autosize="{minRows: 3, maxRows: 4}" v-model="merchantData.info"></Input>
            </FormItem>
            <Row>
              <Col span="12">
                <FormItem label="超市到家" >
                  <Cascader change-on-select :data="marketTypeData" v-model="marketType" ></Cascader>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="包邮金额" >
              <Input v-model="merchantData.mprice"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="包邮件数" >
              <Input v-model="merchantData.mnum"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="是否包邮" >
              <i-switch size="large" v-model="merchantData.isdefault" :true-value="1" :false-value="0">
                <span slot="open">是</span>
                <span slot="close">否</span>
              </i-switch>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="售卖区域">
              <div class="addbtn">
                <div class="area-span">
                  <span v-for="(item, index) in selectArea" :key="index" @click="removeArea(index)">{{item.areainfo}}</span>
                </div>
                <a @click="onclickAddArea">+ 添加区域</a>
              </div>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="商户相册">
              <div class="shop-pics">
                <ul>
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
    <Modal v-model="addAreaShow" width="860">
      <p slot="header">添加区域</p>
      <div class="area-select">
        <h3>{{province.label}} / {{city.label}} / {{area.label}} / {{street.label}}</h3>
        <div class="select-wrap">
          <div class="list">
            <ul>
              <li :class="{'active' : province.value === '0'}" @click="onSelectArea('province', null)">全部</li>
              <li v-for="(item, index) in provinceData"
                :class="{'active' : province.value === item.value}"
                @click="onSelectArea('province', item, 'city')"
                >
                {{item.label}}
                <Icon type="ios-arrow-forward" />
              </li>
            </ul>
          </div>
          <div class="list">
            <ul>
              <li :class="{'active' : city.value === '0'}" @click="onSelectArea('city', null)">全部</li>
              <li v-for="(item, index) in cityData"
                :class="{'active' : city.value === item.value}"
                @click="onSelectArea('city', item, 'area')"
                >
                {{item.label}}
                <Icon type="ios-arrow-forward" />
              </li>
            </ul>
          </div>
          <div class="list">
            <ul>
              <li :class="{'active' : area.value === '0'}" @click="onSelectArea('area', null)">全部</li>
              <li v-for="(item, index) in areaData"
                :class="{'active' : area.value === item.value}"
                @click="onSelectArea('area', item, 'street')"
                >
                {{item.label}}
                <Icon type="ios-arrow-forward" />
              </li>
            </ul>
          </div>
          <div class="list">
            <ul>
              <li :class="{'active' : street.value === '0'}" @click="onSelectArea('street', null)">全部</li>
              <li v-for="(item, index) in streetData"
                :class="{'active' : street.value === item.value}"
                @click="onSelectArea('street', item, 'qu')"
                >
                {{item.label}}
                <Icon type="ios-arrow-forward" />
              </li>
            </ul>
          </div>
          <div class="list">
            <ul>
              <li :class="{'active' : qu.value === '0'}" @click="onSelectArea('qu', null)">全部</li>
              <Input v-show="addqushow" size="small" placeholder="小区名称...enter" @on-enter="onAddqu" v-model="addqutext"></Input>
              <div class="addqu" v-show="!addqushow && street.label" @click="addqushow = true">+添加</div>
              <li v-for="(item, index) in quData"
                :class="{'active' : qu.value === item.value}"
                @click.prevent.stop="onSelectArea('qu', item, '')"
                >
                {{item.label}}
                <Icon class="del-icon" @click.native.prevent.stop="onRemovequ(item)" type="ios-close-circle-outline" />
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div slot="footer">
        <Button type="default" @click="deaddAreaShow = false">取消</Button>
        <Button type="primary"  @click="onConfirmArea">确认</Button>
      </div>
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
      visibleImg: false,
      sortData: [],
      addAreaShow: false,
      province: {},
      city: {},
      area: {},
      street: {},
      qu: {},
      provinceData: [],
      cityData: [],
      areaData: [],
      streetData: [],
      quData: [],
      selectArea: [],
      addqushow: false,
      addqutext: '',
      tagsData:[],
      marketTypeData: [],
      marketType: [],
      tags: []
    }
  },
  created () {
    if (this.$route.params.id) {
      this.merchantID = this.$route.params.id
      this.getMerchangById(this.$route.params.id)
    }
    this.getSortData()
    this.getTagsData()
    this.getAreaData(null)
    this.getMarketSort()
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
          console.log(response)
          if (response.data.code == 0) {
            this.merchantData = response.data.data
            this.photos = response.data.data.photos ? response.data.data.photos.split(",") : []
            this.selectArea = response.data.data.salesaddressinfo
            this.tags = response.data.data.tags ? response.data.data.tags.split(',').map(e => parseInt(e)) : []
            this.marketType = []
            if (response.data.data.allsupermarketid && response.data.data.allsupermarketid.length > 0) {
              let arr = response.data.data.allsupermarketid.split(',')
              arr.forEach(item => {
                if (item) {
                  this.marketType.push(parseInt(item))
                }
              })
            }
            console.log(this.marketType)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.$Message.error(error.toString())
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
      this.merchantData.salesaddressinfo = JSON.stringify(this.selectArea)
      this.merchantData.supermarketid = this.marketType.length > 0 ? this.marketType[this.marketType.length - 1] : ''
      this.merchantData.tags = this.tags.join(',')
      serverApi('/Merchant/edit', this.merchantData,
        response => {
          this.modal_loading = false
          if (response.data.code === 0) {
            this.$Message.success(response.data.msg)
            // this.$router.push({name: 'Merchant'})
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
    },
    getSortData () {
      serverApi('/merchant/cateindex', null,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.sortData = this.flatanArr(response.data.data)
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        }
      )
    },
    flatanArr (arr) {
      let arr1 = []
      let fun = (a) => {
        a.forEach(item => {
          arr1.push(item)
          if (item.child.length > 0) {
            fun(item.child)
          }
        })
      }
      fun(arr)
      return arr1
    },
    getAreaData (code, type) {
      serverApi('/area/addressnew', {code: code},
        response => {
          if (response.data.code === 0) {
            if (type === 'qu') {
              this.quData = response.data.data
            } else {
              this.provinceData = response.data.data
            }
          }
        },
        error => {
          console.log(error)
        }
      )
    },
    removeArea (index) {
      this.selectArea.splice(index, 1)
    },
    onclickAddArea () {
      this.addAreaShow = true
    },
    onSelectArea (type, item, next) {
      if (type === 'province') {
        this.cityData = []
        this.areaData = []
        this.streetData = []
        this.quData = []
        this.qu = {}
        this.city = {}
        this.area = {}
        this.street = {}
      }
      if (type === 'city') {
        this.areaData = []
        this.streetData = []
        this.quData = []
        this.qu = {}
        this.area = {}
        this.street = {}
      }
      if (type === 'area') {
        this.streetData = []
        this.street = {}
        this.quData = []
        this.qu = {}
      }

      if (item === null) {
        this[type] = {label: '全部', value: '0'}
        return false
      }
      if (type === 'street') {
        this.qu = {}
        this.quData = []
      }
      if (type === 'qu') {
        this.qu = item
        return false
      }
      this[type] = item
      this.$Message.loading({
        duration: 0,
        content: 'loading...',
      })
      serverApi('/area/addressnew', { code: item.value },
        response => {
          this.$Message.destroy()
          if (response.data.code === 0) {
            this[next + 'Data'] = response.data.data
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.destroy()
          this.$Message.error('查询失败！')
        }
      )
    },
    onConfirmArea () {
      let obj = {
        areainfo: `${this.province.label || ''} ${this.city.label || ''} ${this.area.label || ''} ${this.street.label || '' } ${this.qu.label || '' }`,
        province: this.province.value || 0,
        city: this.city.value || 0,
        country: this.area.value || 0,
        street: this.street.value || 0,
        qu: this.qu.value || 0
      }
      this.selectArea.push(obj)
      this.addAreaShow = false
    },
    onAddqu () {
      if (!this.addqutext) {
        this.addqushow = false
        return false
      }
      if (!this.street.value) return false
      let d = {
        label: this.addqutext,
        areacode: this.street.value
      }
      serverApi('/area/addressnewedit', d,
        response => {
          if (response.data.code === 0) {
            this.getAreaData(this.street.value, 'qu')
            this.addqushow = false
          } else {
            this.$Message.warning(response.data.code)
          }
        },
        error => {
          this.$Message.error(error.toString())
        }
      )
    },
    onRemovequ (item) {
      console.log(item)
      serverApi('/area/addressnewdel', {id: item.id},
        response => {
          if (response.data.code === 0) {
            this.addqushow = false
            this.getAreaData(this.street.value, 'qu')
          } else {
            this.$Message.warning(response.data.code)
          }
        },
        error => {
          this.$Message.error(error.toString())
        }
      )
    },
    getTagsData(){
      serverApi('/Orgmerchanttag/index', null,
        response => {
          if(response.data.code === 0) {
            this.tagsData = response.data.data
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        }
      )
    },
    getMarketSort () {
      serverApi('/supermarket/cateindex', null,
        response => {
          if (response.data.code === 0) {
            let cas = response.data.data
            let getCas = function (cas) {
              cas.forEach(item => {
                item.label = item.name,
                item.value = item.id
                item.children = item.child
                if (item.child.length > 0) {
                  getCas(item.child)
                }
              })
            }
            getCas(cas)
            this.marketTypeData = cas
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        }
      )
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
.area-select{
  h3{
    font-size: 14px;
    color: #666;
    font-style: italic;
  }
  .select-wrap{
    display: flex;
    flex-direction: row;
    border: 1px solid #e5e5e5;
    border-right: none;
    .list{
      display: flex;
      height: 400px;
      flex: 1;
      border-right: 1px solid #e5e5e5;
      overflow-x: auto;
      padding: 8px 10px;
      ul{
        list-style: none;
        padding: 0;
        width: 100%;
        li{
          height: 30px;
          text-align: left;
          cursor: pointer;
          line-height: 30px;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          position: relative;
          &:hover{
            background-color: #f3f3f3;
            .del-icon{
              display: block;
            }
          }
          &.active{
            background-color: #f3f3f3;
            color: #2d8cf0;
          }
          i{
            position: absolute;
            right: 10px;
            top: 9px;
          }
          .del-icon{
            font-size: 18px;
            top: 7px;
            display: none;
            &:hover{
              color: red;
            }
          }
        }
      }
      .addqu{
        cursor: pointer;
        height: 30px;
        width: 100%;
        border: 1px dashed #e5e5e5;
        background-color: #f3f3f3;
        text-align: center;
        line-height: 30px;
        &:hover{
          background: #e8f7fd;
          border-color: #bdf;
          color: #38f;
        }
      }
    }
  }
}
.area-span{
  span{
    display: inline-block;
    background-color: #f3f3f3;
    padding: 5px;
    margin-right: 8px;
    line-height: 1;
    cursor: pointer;
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
