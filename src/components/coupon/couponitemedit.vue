<template>
  <div class="box">
    <!-- <Card :bordered="false">
      <div class="shop-img">
        <img src="http://cqcother.zlzmm.com/2.png" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">编辑卡券信息</span></h4>
        <p>编辑卡券信息
          <router-link :to="{name: 'CouponItem'}">返回【卡券列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card> -->
    <Card style="margin-top:10px" :bordered="false">
      <Form :model="merchantData" ref="form" :rules="rules" :label-width="90">
        <Row>
          <Col span="6">
            <FormItem label="卡券名称">
              <Input v-model="editData.cardname"></Input>
            </FormItem>
            <FormItem label="开始发放时间">
              <Input v-model="editData.startsendtime"></Input>
            </FormItem>
            <FormItem label="卡券状态">
              <!-- <Input v-model="editData.cardmainstate"></Input> -->
              <Select v-model="editData.cardmainstate">
                <Option v-for="item in stateData" :value="item.value" :key="item.value">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="限制属性">
              <Select v-model="editData.restricts">
                <Option :value="0">不限制</Option>
                <Option :value="1">每天</Option>
                <Option :value="2">活动期间</Option>
              </Select>
            </FormItem>
            <FormItem label="使用范围" v-show="editData.typeid == 6">
              <Select v-model="editData.dytype">
                <Option v-for="(item, index) in couponUseRange" :key="index" :value="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="剩余数量">
              <Input disabled v-model="editData.remaincount"></Input>
            </FormItem>
            <FormItem label="结束发放时间">
              <Input v-model="editData.endsendtime"></Input>
            </FormItem>
            <FormItem label="库存">
              <Input  v-model="editData.totalcount"></Input>
            </FormItem>
            <FormItem label="限制属性值">
              <InputNumber :max="999999" :min="1" v-model="editData.restrictsvalue"></InputNumber>
            </FormItem>
            <FormItem label="适用价格区间" v-show="editData.typeid == 6">
              <InputNumber :max="99999999999" :min="-1" v-model="editData.dybottom"></InputNumber>
              -
              <InputNumber :max="99999999999" :min="-1" v-model="editData.dytop"></InputNumber>
              <Tooltip max-width="200" content="适用价格区间，不填则适用所有" placement="top">
                <Icon type="ios-alert" size="20"/>
              </Tooltip>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="卡券类型">
              <Select disabled v-model="editData.typeid" @on-change="onSelectType">
                <Option v-for="item in typeData" :value="item.id" :key="item.id">{{ item.typename }}</Option>
              </Select>
            </FormItem>
            <FormItem label="开始使用时间">
             <Input  v-model="editData.startusetime"></Input>
            </FormItem>
            <FormItem label="关联活动">
             <Input v-model="editData.assignactiveid"></Input>
            </FormItem>
            <FormItem label="扣点" required>
              <InputNumber :max="100" :min="0" v-model="editData.points"></InputNumber>&nbsp;%（0~100）
            </FormItem>
            <FormItem label="商户/商品id" v-show="editData.typeid == 6 && editData.dytype != 99">
              <Tooltip content="请输入商品或商户id,用逗号隔开" placement="top">
                <Input v-model="editData.dydetails"></Input>
              </Tooltip>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="结束使用时间">
             <Input  v-model="editData.endusetime"></Input>
            </FormItem>
            <FormItem label="卡券头图" required style="margin-bottom:0px;">
             <Input v-model="editData.imgmaster">
                <span slot="append">
                  <Upload :action="uploadApiUrl"
                    :show-upload-list="false"
                    :on-success="uploadImgSuccMaster"
                    :on-error="uploadImgErr">
                    <Icon size="24" type="ios-cloud-upload-outline"></Icon>
                  </Upload>
                </span>
             </Input>
             <img :src="editData.imgmaster" v-imgview style="height: 60px" alt="">
            </FormItem>
          </Col>
        </Row>
        <!-- <Row>
          <Col span="24">
            <FormItem label="扩展信息">
              <Input type="textarea" :rows="1" disabled v-model="editData.cardextrainfo"></Input>
            </FormItem>
          </Col>
        </Row> -->
        <Row>
          <Col span="6">
            <FormItem label="卡券定价" prop="saleprice">
              <InputNumber :max="999999999" style="width: 100%" :min="0" v-model="editData.saleprice"></InputNumber>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="市场价" >
              <InputNumber :max="999999999" style="width: 100%" :min="0" v-model="editData.marketprice"></InputNumber>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="抵用金额" required >
              <InputNumber :max="999999999" style="width: 100%" :min="0" v-model="editData.couponfee"></InputNumber>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="平台优惠" prop="coupon">
              <InputNumber :max="999999999" style="width: 100%" :min="0" v-model="editData.coupon"></InputNumber>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="商户优惠" prop="merchantcoupon">
              <InputNumber :max="999999999" style="width: 100%" :min="0" v-model="editData.merchantcoupon"></InputNumber>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="别名" required>
              <Input v-model="editData.byname"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="卡券售价">
              <span style="color: #f60">￥</span>
              <span class="cardPrice">{{cardPrice}}</span>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="是否显示">
              <Select v-model="editData.isshow">
                <Option :value="0">显示</Option>
                <Option :value="1">不显示</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="积分兑换">
              <i-switch size="large" :true-value="1" :false-value="0" v-model="editData.intergraluse">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
              </i-switch>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="所需积分" v-show="editData.intergraluse==1">
              <InputNumber :max="999999999" style="width:100%" :min="0" v-model="editData.intergral"></InputNumber>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="关联商户">
              <Select transfer filterable multiple v-model="merArr" filterable>
                <Option v-for="item in merchantData" :value="item.merchantcode" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="卡券明细图">
              <div style="border: 1px solid #e8e8e8">
                <ul class="imgList">
                  <li v-for="(item, index) in picArr" :key="index">
                    <img :src="item" v-imgview alt="">
                    <p><a @click="onRemoveImg(index)">移除</a></p>
                  </li>
                  <li class="upload">
                     <Upload
                      :action="uploadApiUrl"
                      :on-error="uploadImgErr"
                      :show-upload-list="false"
                      :on-success="uploadImgSuccGlary"
                      >
                      <Button size="small" icon="ios-cloud-upload-outline">Upload files</Button>
                    </Upload>
                  </li>
                </ul>
                <div class="clear-fix">

                </div>
              </div>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6" v-for="item in typePropsData" :key="item.id">
            <FormItem :label="item.extrainfovalue">
              <Input v-model="extProps[item.extrainfocode]"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <hr style="margin-bottom:20px" class="divider">
      <!-- <div style="text-align:center">
        <Icon v-show="propLoading" type="load-d" color="#2d8cf0" size="30" class="loading-icon"></Icon>
      </div> -->
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
          <Button :loading="modal_loading" style="width:180px" @click="onClickEdit" type="primary">保存</Button>
          <Button style="width:100px; margin-left:10px" @click="goBack" type="info">返回列表</Button>
          <Button style="width:100px; margin-left:10px" @click="previewCoupon" type="info">预览卡券</Button>
        </Col>
      </Row> -->
      <div class="btn-box">
        <ButtonGroup vertical>
          <Button :loading="modal_loading"  @click="onClickEdit" type="primary">保存</Button>
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
        <Button    @click="recModal = false">取消</Button>
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
  name: 'CouponItemEdit',
  data () {
    return {
      editData: {},
      id: null,
      propLoading: false,
      recModal: false,
      ueConfig: {
        initialFrameWidth: '100%',
        initialFrameHeight: 350
      },
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
      modal_loading: false,
      couponData: [],
      typeData: [],
      stateData: [
        { name: '编制', value: 0 },
        { name: '发布', value: 1 },
        { name: '有效', value: 2 },
        { name: '停止', value: 3 },
        { name: '无效', value: 4 },
        { name: '过期', value: 5 }
      ],
      typePropsData: [],
      propsObj: {},
      ueContent: '',
      defaultMsg: '',
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
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      this.getOneById(this.$route.params.id)
    }
  },
  mounted () {
    this.editor1 = UE.getEditor('editor1', this.ueConfig)
    this.editor2 = UE.getEditor('editor2', this.ueConfig)
    this.editor3 = UE.getEditor('editor3', this.ueConfig)
  },
  computed: {
    couponUseRange () {
      return this.$store.state.couponUseRange
    },
    cardPrice () {
      if (this.editData.saleprice && this.editData.merchantcoupon && this.editData.coupon) {
        return Number(this.editData.saleprice) - Number(this.editData.merchantcoupon) - Number(this.editData.coupon)
      } else {
        return this.editData.price
      }
    }
  },
  methods: {
    getOneById (id) {
      this.$store.commit('pageLoading', true)
      serverApi('/card/getcouponbyid', {id: id},
        response => {
          console.log(response)
          this.$store.commit('pageLoading', false)
          if (response.data.code == 0) {
            this.editData = response.data.data
            this.extProps = response.data.data.cardextrainfo ? JSON.parse(response.data.data.cardextrainfo) : {}
            this.defaultMsg1 = response.data.data.carddesc ? decodeURIComponent(response.data.data.carddesc) : ''
            this.defaultMsg2 = response.data.data.userule ? decodeURIComponent(response.data.data.userule) : ''
            this.defaultMsg3 = response.data.data.userange ? decodeURIComponent(response.data.data.userange) : ''
            this.picArr = response.data.data.imgdetailed ? response.data.data.imgdetailed.split(',') : []
            this.merArr = response.data.data.merchantcode ? response.data.data.merchantcode.split(',') : []

            this.editor1.setContent(this.defaultMsg1)
            this.editor3.setContent(this.defaultMsg2)
            this.editor2.setContent(this.defaultMsg3)
            // this.getPropsByid(this.editData.typeid)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.$store.commit('pageLoading', false)
          // this.$Message.error('连接失败！')
        })
    },
    onSelectType (e) {
      this.getPropsByid(e)
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
    getCardType () {
      let d = {
        pagesize: 99999,
        page: 1,
        userid: sessionStorage.userid
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
    getPropsByid (typeid) {
      this.propsObj = {}
      this.propLoading = true
      let d = {
        cardtypeid: typeid
      }
      serverApi('/card/cardexpansionlist', d,
        response => {
          // console.log(response)
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
    onClickEdit () {
      this.modal_loading = true
      let carddesc = this.editor1.getContent()
      let userule = this.editor3.getContent()
      let userange = this.editor2.getContent()
      this.editData.carddesc = carddesc ?  encodeURIComponent(carddesc) : ''
      this.editData.userule = userule ?  encodeURIComponent(userule) : ''
      this.editData.userange = userange ?  encodeURIComponent(userange) : ''
      this.editData.imgdetailed = this.picArr.length>0 ? this.picArr.toString() : ''
      this.editData.merchantcode = this.merArr.length>0 ? this.merArr.toString() : '0'
      this.editData.cardextrainfo = JSON.stringify(this.extProps)
      serverApi('/card/couponadd', this.editData,
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
    goBack () {
      history.go(-1)
    },
    uploadImgSuccMaster (response, file) {
      this.$Notice.success({
        title: '上传成功',
        desc: '卡券头图上传成功！'
      })
      this.editData.imgmaster = response.data.url
    },
    uploadImgSuccGlary (response, file) {
      this.$Notice.success({
        title: '上传成功',
        desc: '卡券图片上传成功！'
      })
      this.picArr.push(response.data.url)
    },
    uploadImgErr (response, file, fileList) {
      this.$Message.warning('上传失败！')
      console.log('err'+response,file,fileList)
    },
    onRemoveImg (index) {
      this.picArr.splice(index, 1)
    }
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
.btn-box{
  text-align: center;
  position: fixed;
  z-index: 1000;
  right: 40px;
  bottom: 50px;
  box-shadow: 2px 2px 10px rgba(0,0,0,.4);
}
.tips{
  padding-left: 100px;
  h4{
    margin-top: 17px;
  }
}
.cardPrice{
  font-size: 16px;
  color: #f60;
}
.imgList{
  list-style: none;
  padding: 0;
  li{
    float: left;
    margin-right: 12px;
    padding: 8px;
    p{
      line-height: 12px;
      font-size: 12px;
      text-align: center;
    }
    img {
      height: 80px;
      border: 1px solid #e8e8e8;
    }
  }
}
.upload{
  height: 80px;
  width: 80px;
  text-align: center;
  line-height: 80px;
}
</style>
