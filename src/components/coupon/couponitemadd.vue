<template>
  <div class="box">
    <!-- <Card :bordered="false">
      <div class="shop-img">
        <img src="http://cqcother.zlzmm.com/2.png" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">新增卡券</span></h4>
        <p>新增卡券信息
          <router-link :to="{name: 'CouponItem'}">返回【卡券列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card> -->
    <Card style="margin-top:10px" :bordered="false">
      <Form :model="addData" ref="form" :rules="rules" :label-width="90">
        <Row>
          <Col span="6">
            <FormItem label="卡券名称" prop="cardname">
              <Input v-model="addData.cardname"></Input>
            </FormItem>
            <FormItem label="卡券状态">
              <Select v-model="addData.cardmainstate">
                <Option v-for="item in stateData" :value="item.value" :key="item.value">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="扣点" required>
              <InputNumber :max="100" :step="1" :min="0" v-model="addData.points"></InputNumber> &nbsp;%（0~100）
            </FormItem>
          </Col>
          <Col span="6">
            <!-- <FormItem label="卡券编码" prop="cardcode">
              <Input v-model="addData.cardcode"></Input>
            </FormItem> -->
            <!-- <FormItem label="关联活动">
              <Input v-model="addData.assignactiveid"></Input>
            </FormItem> -->
            <FormItem label="卡券类型">
              <Select v-model="addData.typeid" @on-change="onSelectType">
                <Option v-for="item in typeData" :value="item.id" :key="item.id">{{ item.typename }}</Option>
              </Select>
            </FormItem>
            <FormItem label="使用范围" v-show="addData.typeid == 6">
              <Select v-model="addData.dytype">
                <Option v-for="(item, index) in couponUseRange" :key="index" :value="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
            <FormItem label="卡券定价" prop="saleprice">
              <InputNumber :max="999999999" style="width: 100%" :min="0" v-model="addData.saleprice"></InputNumber>
            </FormItem>
            <FormItem label="是否显示">
              <Select v-model="addData.isshow" @on-change="onSelectType">
                <Option value="0">显示</Option>
                <Option value="1">不显示</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="库存">
              <Input v-model="addData.totalcount"></Input>
            </FormItem>
            <FormItem label="卡券头图" required>
              <Input v-model="addData.imgmaster">
                <span slot="append">
                  <Upload :action="uploadApiUrl"
                    :show-upload-list="false"
                    :on-success="uploadImgSuccMaster"
                    :on-error="uploadImgErr">
                    <Icon size="24" type="ios-cloud-upload-outline"></Icon>
                  </Upload>
                </span>
              </Input>
            </FormItem>
            <!-- v-show="addData.typeid == 6" -->
            <FormItem label="适用价格区间" >
              <InputNumber :max="99999999999" :min="-1" v-model="addData.dybottom"></InputNumber>
              -
              <InputNumber :max="99999999999" :min="-1" v-model="addData.dytop"></InputNumber>
              <Tooltip max-width="200" content="适用价格区间，不填则适用所有" placement="top">
                <Icon type="ios-alert" size="20"/>
              </Tooltip>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="限制属性">
              <Select v-model="addData.restricts">
                <Option value="0">不限制</Option>
                <Option value="1">每天</Option>
                <Option value="2">活动期间</Option>
              </Select>
            </FormItem>
            <FormItem label="限制属性值">
              <InputNumber :max="999999" style="width: 100%" :min="1" v-model="addData.restrictsvalue"></InputNumber>
            </FormItem>
            <FormItem label="商户/商品" v-show="addData.typeid == 6 && addData.dytype != 6 && addData.dytype != 99 && addData.dytype != 4">
              <Tooltip content="请输入商品/商户或类型id,用逗号隔开" placement="top">
                <Input style="width: 100%" v-model="addData.dydetails"></Input>
              </Tooltip>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="市场价" prop="saleprice">
              <InputNumber :max="999999999" style="width: 100%" :min="0" v-model="addData.marketprice"></InputNumber>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="抵用金额" required>
              <InputNumber :max="999999999" style="width: 100%" :min="0" v-model="addData.couponfee"></InputNumber>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="平台优惠" prop="coupon">
              <InputNumber :max="999999999" style="width: 100%" :min="0" v-model="addData.coupon"></InputNumber>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="商户优惠" prop="merchantcoupon">
              <InputNumber :max="999999999" style="width: 100%" :min="0" v-model="addData.merchantcoupon"></InputNumber>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="别名" required >
              <Input v-model="addData.byname"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="卡券售价">
              <span style="color: #f60">￥</span>
              <span class="cardPrice">{{cardPrice}}</span>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="积分兑换">
              <i-switch size="large" :true-value="1" :false-value="0" v-model="addData.intergraluse">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
              </i-switch>
            </FormItem>
          </Col>
          <Col span="6" v-show="addData.intergraluse==1">
            <FormItem label="所需积分">
              <InputNumber :max="999999999" style="width:100%" :min="0" v-model="addData.intergral"></InputNumber>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="发放时间">
              <DatePicker type="datetimerange" transfer @on-change="onSelectSendDate" style="width:100%" placeholder="选择时间"></DatePicker>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="使用时间">
              <DatePicker type="datetimerange" transfer @on-change="onSelectUseDate" style="width:100%" placeholder="选择时间"></DatePicker>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24" v-show="addData.typeid != 6">
            <FormItem label="关联商户">
              <Select transfer filterable multiple v-model="merArr" filterable>
                <Option v-for="item in merchantData" :value="item.merchantcode" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <div>
              <FormItem label="卡券明细图" style="margin-bottom:0px;">
                <div class="shopimgs" style="padding-bottom:30px">
                  <ul>
                    <li v-for="(item, index) in picArr" :key="index">
                      <img :src="item" alt="" v-imgview>
                      <p class="tip">
                        <a @click="onClickRemoveImg(index)">移除</a>
                      </p>
                    </li>
                    <li class="add">
                      <Upload
                        :show-upload-list="false"
                        :action="uploadApiUrl"
                        :on-error="uploadImgErr"
                        :on-success="uploadImgSuccGlary"
                        :on-preview="onPreviewImg"
                        >
                        <Icon type="ios-cloud-upload-outline"></Icon>
                      </Upload>
                    </li>
                  </ul>
                  <div class="clear-fix"></div>
                </div>
              </FormItem>
            </div>
          </Col>
        </Row>
      </Form>
      <!-- <hr style="margin-bottom:20px" class="divider"> -->
      <div style="text-align:center">
        <Icon v-show="propLoading" type="load-d" color="#2d8cf0" size="30" class="loading-icon"></Icon>
      </div>
      <Form :model="propsObj" :label-width="90">
        <Row>
          <Col span="6" v-for="item in typePropsData" :key="item.id">
            <FormItem :label="item.extrainfovalue">
              <Input v-model="propsObj[item.extrainfocode]"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col span="24">
          <table id="test" class="table border">
            <tbody>
              <tr>
                <td width="80">套餐内容</td>
                <td class="content">
                  <script id="editor1" type="text/plain"></script>
                </td>
              </tr>
              <tr>
                <td>使用范围</td>
                <td class="content">
                  <script id="editor2" type="text/plain"></script>
                </td>
              </tr>
              <tr>
                <td>使用规则</td>
                <td class="content">
                  <script id="editor3" type="text/plain"></script>
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
      <!-- <Row>
        <Col span="24" style="text-align:center; padding:30px 0">
          <Button :loading="modal_loading" style="width:180px" @click="onClickAdd" type="primary">保存</Button>
          <Button style="width:100px; margin-left:10px" @click="previewCoupon" type="info">预览卡券</Button>
        </Col>
      </Row> -->
      <div class="btn-box">
        <ButtonGroup vertical>
          <Button :loading="modal_loading" @click="onClickAdd" type="primary">保存</Button>
          <Button  @click="goBack" type="info">返回列表</Button>
        </ButtonGroup>
      </div>
    </Card>

    <Modal v-model="recModal" width="410">
      <p slot="header" style="text-align:center">
        <span>预览卡券</span>
      </p>
      <div>
        <div class="preview" v-html="ueContent"></div>
      </div>
      <div slot="footer">
        <Button  @click="recModal = false">取消</Button>
        <Button type="primary" @click="recModal = false">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
import '../../../static/UE/ueditor.config'
import '../../../static/UE/ueditor.all.min'
import { uploadApiUrl } from '../../config'
export default {
  name: 'CouponItemAdd',
  data () {
    return {
      editData: {},
      recModal: false,
      uploadApiUrl: uploadApiUrl,
      ueConfig: {
        initialFrameWidth: '100%',
        initialFrameHeight: 221,
        toolbars: [['fullscreen', 'source', 'undo', 'redo', 'bold', 'italic',
          'underline','forecolor','fontborder', 'backcolor', 'fontsize', 'fontfamily',
          'justifyleft', 'justifyright','justifycenter', 'justifyjustify',
          'strikethrough','superscript', 'subscript','map', 'inserttable',
           'pasteplain', 'insertimage', 'lineheight', 'edittable', 'edittd', '|',
           'backcolor','insertorderedlist', 'insertunorderedlist',
          'selectall', 'cleardoc', 'link','emotion']
        ]
      },
      addData: {
        isshow: '0',
        cardname: '',
        startsendtime: '',
        endsendtime: '',
        startusetime: '',
        endusetime: '',
        assignactiveid: '',
        typeid: null,
        totalcount: 1,
        cardextrainfo: '',
        cardmainstate: 0,
        carddesc: '',
        merchantcode: '',
        imgmaster: '',
        imgdetailed: '',
        userule: '',
        userange: '',
        restricts: '0',
        restrictsvalue: '1',
        points: 0,
        dytype: '0',
        dydetails: '',
        dytop: null,
        dybottom: 0,
        saleprice: 0, //定价
        marketprice: 0, //市场价
        couponfee: null, // 抵用金额
        coupon: 0, // 平台优惠，
        merchantcoupon: 0, //商户优惠
        byname: '',
        intergraluse: 0,
        intergral: 0,
      },
      id: null,
      rules: {
        cardname: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      modal_loading: false,
      couponData: [],
      selectData: {
        sellprice: '售价',
        drawlimittotal: '每人限制领取',
        allowuseprice: '满减限制',
        couponfee: '优惠',
      },
      typeData: [],
      stateData: [
        { name: '编制', value: 0 },
        { name: '发布', value: 1 }
      ],
      typePropsData: [],
      propsObj: {},
      propLoading: false,
      ueContent: '',
      picArr: [],
      merArr: [],
      editor1: null,
      editor2: null,
      editor3: null,
      merchantData: []
    }
  },
  created () {
    this.getCardType()
    this.getMerchantData()
  },
  computed: {
    cardExtraInfo () {
      return JSON.stringify(this.propsObj)
    },
    couponUseRange () {
      return this.$store.state.couponUseRange
    },
    cardPrice () {
      let fee = this.addData.saleprice -  this.addData.coupon -  this.addData.merchantcoupon
      return fee.toFixed(2)
    }
  },
  mounted () {
    this.editor1 = UE.getEditor('editor1', this.ueConfig)
    this.editor2 = UE.getEditor('editor2', this.ueConfig)
    this.editor3 = UE.getEditor('editor3', this.ueConfig)
  },
  methods: {
    goBack () {
      history.go(-1)
    },
    getCardType () {
      let d = {
        pagesize: 99999,
        page: 1
      }
      serverApi('/card/type', d,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.typeData = response.data.data.result
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.$Message.error('连接失败！')
        }
      )
    },
    getMerchantData () {
      let d = {
        pagesize: 99999999,
        page: 1
      }
      this.$store.commit('pageLoading', true)
      serverApi('/Merchant/index', d,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.merchantData = response.data.data.result
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
    getPropsByid (typeid) {
      this.propsObj = {}
      this.propLoading = true
      let d = {
        cardtypeid: typeid
      }
      serverApi('/card/cardexpansionlist', d,
        response => {
          console.log(response)
          this.propLoading = false
          if (response.data.code === 0){
            this.typePropsData = response.data.data
            this.typePropsData.forEach(item => {
              this.propsObj[item.extrainfocode] = ''
            })
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.propLoading = false
          console.log(error)
          this.$Message.error('连接失败！')
        }
      )
    },
    onSelectSendDate (e) {
      this.addData.startsendtime = e[0]
      this.addData.endsendtime = e[1]
    },
    onSelectUseDate (e) {
      this.addData.startusetime = e[0]
      this.addData.endusetime = e[1]
    },
    onSelectType (e) {
      // this.getPropsByid(e)
    },
    onClickAdd () {
      let carddesc = this.editor1.getContent()
      let userule = this.editor3.getContent()
      let userange = this.editor2.getContent()

      this.addData.carddesc = carddesc ?  encodeURIComponent(carddesc) : ''
      this.addData.userule = userule ?  encodeURIComponent(userule) : ''
      this.addData.userange = userange ?  encodeURIComponent(userange) : ''
      this.addData.imgdetailed = this.picArr.length>0 ? this.picArr.toString() : ''
      this.addData.merchantcode = this.merArr.length>0 ? this.merArr.toString() : '0'
      this.addData.cardextrainfo = JSON.stringify(this.propsObj)

      console.log(this.addData)
      this.modal_loading = true
      serverApi('/card/couponadd', this.addData,
        response => {
          this.modal_loading = false
          if (response.data.code === 0) {
            this.$router.push({name: 'CouponItem'})
          }
          this.$Message.info(response.data.msg)
        },
        error => {
          console.log(error)
          this.modal_loading = false
          this.$Message.error("连接失败！")
        }
      )
    },
    previewCoupon () {
      let content = this.$refs.ue.getUEContent()
      if (content) {
        this.ueContent = content
        this.recModal = true
      }
    },
    onClickContent (e) {
      let curContent = e.target.innerHTML
      let ue = this.$refs.ue.editor.container.parentNode.parentNode
      e.target.innerHTML = ue
    },
    uploadImgSuccMaster (response, file) {
      this.$Notice.success({
        title: '上传成功',
        desc: '卡券头图上传成功！'
      })
      this.addData.imgmaster = response.data.url
    },
    uploadImgSuccGlary (response, file) {
      this.$Notice.success({
        title: '上传成功',
        desc: '卡券图片上传成功！'
      })
      this.picArr.push(response.data.url)
    },
    onRemoveImg (file, fileList) {
      let index = this.picArr.findIndex(item => {
        return item === file.name
      })
      this.picArr.splice(index, 1)
      console.log(this.picArr)
    },
    onPreviewImg (file) {
      console.log(file.response.data.url)
    },
    uploadImgErr (response, file, fileList) {
      this.$Message.warning('上传失败！')
      console.log('err'+response,file,fileList)
    },
    onClickRemoveImg (index) {
      this.picArr.splice(index, 1)
    },
  },
  destroyed () {
    this.editor1.destroy()
    this.editor2.destroy()
    this.editor3.destroy()
  }
}
</script>
<style lang="less" scoped>
.shop-img{
  width: 80px;
  height: 80px;
  float: left;
  img{
    height: 100%;
    width: 100%;
  }
}
.ivu-upload-list{
  margin-top: 0px!important;
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
@keyframes loading {
  form {
    transform: rotateZ(0)
  }
  to{
    transform: rotateZ(360deg)
  }
}
.btn-box{
  text-align: center;
  position: fixed;
  z-index: 1000;
  right: 40px;
  bottom: 50px;
  box-shadow: 2px 2px 10px rgba(0,0,0,.4);
}
.loading-icon{
  animation:  loading 1s linear infinite;
}
.cardPrice{
  font-size: 16px;
  color: #f60;
}
.shopimgs{
  ul{
    padding: 0;
    list-style: none;
    display: block;
    float: left;
    li{
      float: left;
      height: 122px;
      width: 110px;
      border: 1px solid #e8e8e8;
      margin-right: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      text-align: center;
      img{
        max-height: 100%;
        max-width: 100%;
      }
      .tip{
        font-size: 12px;
        position: absolute;
        bottom: -32px;
      }
      i{
        font-size: 48px;
        color: #e8e8e8;
        cursor: pointer;
      }
      p{
        font-size: 12px;
        color: #e8e8e8;
      }
    }
  }
}
</style>
