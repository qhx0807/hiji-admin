<template>
  <div class="">
    <Card :bordered="false">
      <Form :model="addData" ref="form" :rules="rules" :label-width="80">
        <Row>
          <Col span="6">
            <FormItem label="商品名称" prop="goodsname">
              <Input v-model="addData.goodsname"></Input>
            </FormItem>
            <FormItem label="商品简介"  prop="goodsdesc">
              <Input type="textarea" autosize v-model="addData.goodsdesc"></Input>
            </FormItem>
            <FormItem label="关键字"  prop="keywords">
              <Input v-model="addData.keywords"></Input>
            </FormItem>
            <!-- <FormItem label="属性类型">
              <Select v-model="addData.typeid" @on-change="onSelectSort" filterable>
                <Option v-for="item in sortData" :value="item.id" :key="item.id">{{ item.typename }}</Option>
              </Select>
            </FormItem> -->
            <FormItem label="商品状态">
              <Select v-model="addData.isonsale">
                <Option value="0">下架</Option>
                <Option value="1">正常销售</Option>
                <Option value="2">存放仓库</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="所属目录" prop="goodsname">
              <Cascader change-on-select @on-change="onSelectDep" :data="goodsTypeData"></Cascader>
            </FormItem>
            <FormItem label="库存数量" prop="goodsname">
              <InputNumber :max="9999999" style="width:100%" :min="0" v-model="addData.goodsstock"></InputNumber>
            </FormItem>
            <FormItem label="移动端价格" prop="mobileprice">
              <InputNumber :max="9999999" style="width:100%" :min="0" v-model="addData.mobileprice"></InputNumber>
            </FormItem>
            <FormItem label="扣点" required>
              <InputNumber :max="100" :step="1" :min="0" v-model="addData.points"></InputNumber> &nbsp;%（0~100）
            </FormItem>
            <FormItem label="运费模板" required>
              <Select v-model="addData.transportid" >
                <Option v-for="item in transArr" :value="item.id" :key="item.id">{{ item.title }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="所属商户" prop="goodsname">
              <Select v-model="addData.merchantcode" filterable>
                <Option v-for="item in merchantData" :value="item.merchantcode" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="商品价格" prop="goodsname">
              <InputNumber :max="9999999" style="width:100%" :min="0" v-model="addData.goodsprice"></InputNumber>
            </FormItem>
            <FormItem label="APP价格" prop="appprice">
              <InputNumber :max="9999999" style="width:100%" :min="0" v-model="addData.appprice"></InputNumber>
            </FormItem>
            <FormItem label="商户优惠" required>
              <InputNumber :max="999999999" style="width:100%" :min="0" v-model="addData.merchantcoupon"></InputNumber>
            </FormItem>
            <FormItem label="计量单位数量" required>
              <InputNumber :max="99999999" style="width:100%" :min="0" v-model="addData.transportnum"></InputNumber>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="自定义编码">
              <Input v-model="addData.goodssn"></Input>
            </FormItem>
            <FormItem label="市场价" prop="goodsname">
              <InputNumber :max="9999999" style="width:100%" :min="0" v-model="addData.marketprice"></InputNumber>
            </FormItem>
            <FormItem label="会员价" prop="memberprice">
              <InputNumber :max="9999999" style="width:100%" :min="0" v-model="addData.memberprice"></InputNumber>
            </FormItem>
            <FormItem label="平台优惠" required>
              <InputNumber :max="999999999" style="width:100%" :min="0" v-model="addData.coupon"></InputNumber>
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
        <!-- <Row v-if="addData.typeid">
          <Col span="24" v-for="(prop, index) in propsArr" :key="index">
            <div class="propAdd">
              <ul>
                <li v-for="(item, indexs) in prop" :key="indexs">
                  <span>{{item.attributevalue}}</span>
                  <Input v-model="item.value" style="width:90px" placeholder="属性值"></Input>
                  <Select style="width:60px" v-model="item.ismain">
                    <Option value="0">否</Option>
                    <Option value="1">是</Option>
                  </Select>
                  <Input v-show="item.ismain == '1'" v-model="item.price" style="width:50px" placeholder="差价"></Input>
                </li>
              </ul>
              <div class="addbtn" >
                <Button type="default" v-show="index==propsArr.length-1" @click="onClickAddArr">添加</Button>
                <Button type="default" @click="onClickRemoveArr(index)">移除</Button>
              </div>
              <div class="clear-fix"></div>
            </div>
          </Col>
        </Row> -->
        <Row>
          <Col span="24">
            <FormItem label="商品属性">
              <ul class="types-list">
                <li v-for="(item, index) in goodsTypesArr" :key="index">
                  <div class="types-item">
                    <span>属性名</span>
                    <Input v-model="item.typename" size="small" style="width:90px"></Input>
                  </div>
                  <div class="types-item">
                    <span>库存</span>
                    <InputNumber size="small" :max="9999999" style="100px" :min="0" v-model="item.goodsstock"></InputNumber>
                  </div>
                  <div class="types-item">
                    <span>移动端价格</span>
                    <InputNumber size="small" :max="9999999" style="100px" :min="0" v-model="item.mobileprice"></InputNumber>
                  </div>
                  <div class="types-item">
                    <span>app端价格</span>
                    <InputNumber size="small" :max="9999999" style="100px" :min="0" v-model="item.appprice"></InputNumber>
                  </div>
                  <div class="types-item">
                    <span>会员价</span>
                    <InputNumber size="small" :max="9999999" style="100px" :min="0" v-model="item.memberprice"></InputNumber>
                  </div>
                  <div class="types-item">
                    <span>商品价格</span>
                    <InputNumber size="small" :max="9999999" style="100px" :min="0" v-model="item.goodsprice"></InputNumber>
                  </div>
                  <div class="types-item">
                    <span>市场价</span>
                    <InputNumber size="small" :max="9999999" style="100px" :min="0" v-model="item.marketprice"></InputNumber>
                  </div>
                  <div class="types-item">
                    <Button type="dashed"size="small" @click="onClickDelTypeItem(index)" icon="ios-trash-outline">删除</Button>
                  </div>
                </li>
                <li>
                  <Button type="dashed"size="small" @click="onClickAddTypeItem" icon="ios-add">添加项</Button>
                </li>
              </ul>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24" style="padding-top:12px">
            <FormItem label="商品图片">
              <div class="shopimgs">
                <ul>
                  <RadioGroup v-model="headerImgIndex">
                  <li
                    v-for="(item, index) in picArr"
                    :key="index"
                    >
                    <Upload
                      v-if="picArr[index] == ''"
                      :action="uploadApiUrl"
                      :on-error="uploadImgErr"
                      :on-success="uploadImgSucc"
                      :data="{arrIndex:index}"
                      >
                      <Icon type="ios-cloud-upload-outline"></Icon>
                      <p>上传图片</p>
                    </Upload>
                    <img v-imgview v-if="picArr[index]" :src="picArr[index]" alt="">
                    <p class="tip" v-if="picArr[index]">
                      <Radio style="color: #57a3f3" :label="index">头图</Radio>
                      <a @click="onClickRemoveImg(index)">移除</a>
                    </p>
                  </li>
                  </RadioGroup>
                </ul>
                <div class="img-box">
                  <input type="text" v-for="(item, index) in picArr" :key="index" v-model="picArr[index]">
                </div>
                <div class="clear-fix"></div>
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col span="24" style="padding-top:12px">
          <table class="table">
            <tbody>
              <tr>
                <td style="width:75px; border-top:none">商品介绍</td>
                <td style="border-top:none"><TextEdit ref="ue" :config="ueConfig"></TextEdit></td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
    </Card>
    <div class="btn-box">
      <ButtonGroup vertical>
        <Button type="primary" icon="ios-checkbox-outline" @click="onClickSubmit" :loading="submitLoading">提交数据</Button>
        <Button type="default" icon="ios-arrow-back" @click="backGoodsList">返回列表</Button>
        <Button type="warning" icon="md-eye" @click="previewEditor">预览详情</Button>
      </ButtonGroup>
    </div>
    <Modal v-model="preModal" width="500">
      <p slot="header" style="text-align:center">
        <span>预览</span>
      </p>
      <div class="preview">
        <div class="swiper">
          <Carousel v-if="preModal" autoplay loop radius-dot arrow="never">
            <CarouselItem v-for="(item, index) in picArr" :key="index" v-if="item">
              <div class="demo-carousel" >
                <img :src="item" alt="">
              </div>
            </CarouselItem>
          </Carousel>
        </div>
        <div class="goods-title">{{addData.goodsname}}</div>
        <p class="goods-desc">{{addData.goodsdesc}}</p>
        <p class="goods-price">
          <span>￥{{addData.goodsprice}}</span>
          <del>￥{{addData.marketprice}}</del>
        </p>
        <div v-html="preContent" class="preview-box"></div>
      </div>
      <div slot="footer">
        <Button  @click="preModal = false">取消</Button>
        <Button type="primary" @click="preModal = false">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
import TextEdit from '../common/text-editor'
import { uploadApiUrl } from '../../config/'
import UploadFile from '../common/UploadFile'
export default {
  name: 'ShopGoodsAdd',
  components: {
    TextEdit,
    UploadFile
  },
  data () {
    return {
      merchantData: [],
      goodsTypeData: [],
      submitLoading: false,
      preContent: '',
      preModal: false,
      uploadApiUrl: uploadApiUrl,
      ueConfig: {
        initialFrameWidth: '100%',
        initialFrameHeight: 222,
        toolbars: [['fullscreen', 'source', 'undo', 'redo', 'bold', 'italic',
          'underline','forecolor','fontborder', 'backcolor', 'fontsize', 'fontfamily',
          'justifyleft', 'justifyright','justifycenter', 'justifyjustify',
          'strikethrough','superscript', 'subscript','map', 'inserttable',
           'pasteplain', 'insertimage', 'lineheight', 'edittable', 'edittd', '|',
           'backcolor','insertorderedlist', 'insertunorderedlist',
          'selectall', 'cleardoc', 'link','emotion']
        ]
      },
      rules: {
        goodsname: [{ required: true, message: '不能为空', trigger: 'blur' }],
        goodsimg: [{ required: true, message: '不能为空', trigger: 'blur' }],
        merchantcode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        goodsprice: [{ required: true, message: '不能为空', trigger: 'blur' }],
        marketprice: [{ required: true, message: '不能为空', trigger: 'blur' }],
        goodsstock: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
      goodsAttrs: {
        typename: '',
        goodsstock: '',
        mobileprice: '',
        appprice: '',
        goodsprice: '',
        memberprice: '',
        marketprice: ''
      },
      addData: {
        categoryid: '',
        goodsname: '',
        goodsdesc: '',
        goodssn: '',
        goodsimg: '',
        imgdetailed: '',
        goodsdetailed: '',
        goodsstock: 1,
        mobileprice: '',
        appprice: '',
        goodsprice: '',
        memberprice: '',
        marketprice: '',
        keywords: '',
        merchantcode: '',
        typeid: '',
        attrvalue: '',
        isonsale: '1',
        goodstype: '',
        points: 0,
        merchantcoupon: 0,
        coupon: 0,
        intergraluse: 0,
        intergral: 0,
        transportid: '',
        transportnum: 1
      },
      goodsTypesArr: [],
      picArr: ['', '', '', '', '', ''],
      actLi: 0,
      headerImgIndex: -1,
      sortData: [],
      propsData: [],
      propsArr: [],
      transArr: []
    }
  },
  created () {
    this.getMerchantData()
    this.getGoodsType()
    this.getTransArr()
    // this.getSortData()
  },
  methods: {
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
    getTransArr () {
      let d = {
        pagesize: 99999,
        page: 1
      }
      serverApi('/transport/transportList', d,
        response => {
          if (response.data.code === 0){
            this.transArr = response.data.data.result
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
    getSortData () {
      let d = {
        pagesize: 999999,
        page: 1
      }
      this.$store.commit('pageLoading', true)
      serverApi('/goods/attrindex', d,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.sortData = response.data.data.result
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.$store.commit('pageLoading', false)
        },
        error => {
          console.log(error)
          this.$store.commit('pageLoading', false)
          this.$Message.error('连接失败！')
        }
      )
    },
    getSortProps (id) {
      serverApi('/goods/attrcindex', {typeid: id},
        response => {
          if (response.data.code === 0){
            let arr = response.data.data.result
            arr.forEach(item => {
             item.value = ''
             item.price = ''
             item.ismain = '0'
             delete item.createtime
            })
            // console.log(arr)
            this.propsData = [...arr]
            this.propsArr.push(arr)
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
    onSelectSort (e) {
      this.getSortProps(e)
    },
    upLoadHomeImg (e) {
      this.addData.homeimg = e
    },
    getGoodsType () {
      this.$store.commit('pageLoading', true)
      serverApi('/categroy/index', null,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            let cas = response.data.data
            let getCas = function (arr) {
              arr.forEach(item => {
                item.label = item.name,
                item.value = item.id
                item.children = item.child
                if (item.child.length > 0) {
                  getCas(item.child)
                }
              })
            }
            getCas(cas)
            this.goodsTypeData = cas
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
    onSelectDep (e) {
      if (e && e.length) {
        this.addData.categoryid = String(e[e.length-1])
      }
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
        let index = response.data.arrIndex
        this.$set(this.picArr, index, response.data.url)
      }
    },
    onClickSubmit () {
      // if (this.propsArr.length > 0) {
      //   this.addData.attrvalue = JSON.stringify(this.propsArr)
      // } else {
      //   this.addData.attrvalue = ''
      // }
      this.addData.goodstype = this.goodsTypesArr.length > 0 ? JSON.stringify(this.goodsTypesArr) : ''
      console.log(this.addData.goodstype)
      this.$refs.form.validate(valid => {
        if (valid) {
          let arr = []
          if (this.headerImgIndex != -1 && this.picArr[this.headerImgIndex]) {
            this.addData.goodsimg = this.picArr[this.headerImgIndex]
            arr = [].concat(this.picArr)
            arr.splice(this.headerImgIndex, 1)
            let realArr = arr.filter(item => item !== '')
            this.addData.imgdetailed = realArr.toString()
          } else {
            this.$Message.info("请上传或选择商品头图！")
            return false
          }
          let content = this.$refs.ue.getUEContent()
          this.addData.goodsdetailed = content ? encodeURIComponent(content) : ''
          this.submitLoading = true
          serverApi('/goods/goodsadd', this.addData,
            response => {
              this.submitLoading = false
              if (response.data.code === 0) {
                this.$router.push({name: 'ShopGoods'})
              }
              this.$Message.info(response.data.msg)
            },
            error => {
              console.log(error)
              this.submitLoading = false
              this.$Message.error("连接失败！")
            }
          )
        }
      })
    },
    onClickRemoveImg (index) {
      this.$set(this.picArr, index, '')
    },
    backGoodsList () {
      this.$router.push({name: 'ShopGoods'})
    },
    onClickAddArr () {
      let arr = []
      this.propsData.forEach(item => {
        let obj = {
          id: item.id,
          ismain: '0',
          attributevalue: item.attributevalue,
          price: '',
          value: '',
          typeid: item.typeid
        }
        arr.push(obj)
      })
      this.propsArr.push(arr)
    },
    onClickRemoveArr (index) {
      if (this.propsArr.length == 1) return false
      this.propsArr.splice(index, 1)
    },
    onClickAddTypeItem () {
      let obj = Object.assign({}, this.goodsAttrs)
      this.goodsTypesArr.push(obj)
    },
    onClickDelTypeItem (index) {
      this.goodsTypesArr.splice(index, 1)
    },
    previewEditor () {
      let content = this.$refs.ue.getUEContent()
      this.preContent = content
      this.preModal = true
    }
  }
}
</script>
<style lang="less" scoped>
.shopimgs{
  ul{
    padding: 0;
    list-style: none;
    display: block;
    float: left;
    li{
      float: left;
      height: 132px;
      width: 90px;
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
        font-size: 30px;
        color: #e8e8e8;
        cursor: pointer;
      }
      p{
        font-size: 12px;
        color: #e8e8e8;
      }
    }
  }
  .img-box{
    float: left;
    border: 1px solid #e8e8e8;
    height: 133px;
    min-width: 240px;
    input{
      display: block;
      height: 22px;
      border: 1px solid #ddd;
      border-bottom: none;
      border-left: none;
      width: 180px;
      &:nth-child(6){
        border-bottom: 1px solid #ddd;
      }
    }
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
.preview{
  max-height: 500px;
  overflow: auto;
  .swiper{
    height: 300px;
    .demo-carousel{
      height: 300px;
      width: 100%;
      text-align: center;
      img{
        height: 100%;
        max-width: 100%;
        width: auto;
      }
    }
  }
  .goods-title{
    padding: 15px 10px;
    font-size: 16px;
    color: #333;
  }
  .goods-desc{
    margin: 0px 10px 14px 0;
    padding-left: 10px;
    font-size: 14px;
  }
  .preview-box{
    margin-top: 12px;
  }
  .goods-price{
    padding-left: 10px;
    span{
      font-size: 16px;
      color: #f44;
    }
    del{
      font-size: 13px;
      color: #666;
      margin-left: 10px;
      font-weight: 500;
    }
  }
}
.propAdd{
  padding: 8px 12px;
  background-color: #f5f5f5;
  margin-bottom: 10px;
  position: relative;
  ul{
    list-style: none;
    li{
      float: left;
      margin-left: 12px;
    }
  }
  .addbtn{
    position: absolute;
    right: 10px;
  }
}
.types-list{
  list-style: none;
  padding: 0;
  margin: 0;
  li{
    width: 100%;
    height: 30px;
    float: left;
    clear: right;
    margin-bottom: 8px;
  }
  .types-item{
    float: left;
    padding-right: 12px;
  }
}
</style>
