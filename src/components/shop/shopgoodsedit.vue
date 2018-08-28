<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img v-imgview :src="editData.goodsimg" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">编辑商品信息</span></h4>
        <p>
          <Upload
            :action="uploadApiUrl"
            :on-error="uploadImgErr"
            :on-success="uploadImgSuccHead"
            :show-upload-list="false"
            >
            <a><Icon type="ios-cloud-upload-outline"></Icon>上传头图</a>
          </Upload>
          维护商品信息，图文编辑。
          <router-link :to="{name: 'ShopGoods'}">返回【商品列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card :bordered="false">
      <Form :model="editData" ref="form" :rules="rules" :label-width="90">
        <Row>
          <Col span="6">
            <FormItem label="商品名称" prop="goodsname">
              <Input v-model="editData.goodsname"></Input>
            </FormItem>
            <FormItem label="商品简介"  prop="goodsdesc">
              <Input type="textarea" autosize v-model="editData.goodsdesc"></Input>
            </FormItem>
            <FormItem label="关键字"  prop="keywords">
              <Input autosize v-model="editData.keywords"></Input>
            </FormItem>
            <FormItem label="头图"  prop="keywords">
              <Input autosize v-model="editData.goodsimg"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="所属目录" prop="goodsname">
              <Input autosize disabled v-model="editData.categoryname"></Input>
            </FormItem>
            <FormItem label="库存数量" prop="goodsname">
              <InputNumber :max="9999999" style="width:100%" :min="0" v-model="editData.goodsstock"></InputNumber>
            </FormItem>
            <FormItem label="移动端价格" prop="mobileprice">
              <InputNumber :max="9999999" style="width:100%" :min="0" v-model="editData.mobileprice"></InputNumber>
            </FormItem>
            <!-- <FormItem label="属性类型">
              <Select v-model="editData.typeid" @on-change="onSelectSort" filterable>
                <Option v-for="item in sortData" :value="item.id" :key="item.id">{{ item.typename }}</Option>
              </Select>
            </FormItem> -->
             <FormItem label="商品状态">
              <Select v-model="editData.isonsale">
                <Option :value="0">下架</Option>
                <Option :value="1">正常销售</Option>
                <Option :value="2">存放仓库</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="所属商户" prop="goodsname">
              <Select v-model="editData.merchantcode" filterable>
                <Option v-for="item in merchantData" :value="item.merchantcode" :key="item.id">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="商品价格" prop="goodsname">
              <InputNumber :max="9999999" style="width:100%" :min="0" v-model="editData.goodsprice"></InputNumber>
            </FormItem>
            <FormItem label="APP价格" prop="appprice">
              <InputNumber :max="9999999" style="width:100%" :min="0" v-model="editData.appprice"></InputNumber>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="自定义编码">
              <Input v-model="editData.goodssn"></Input>
            </FormItem>
            <FormItem label="市场价" prop="goodsname">
              <InputNumber :max="9999999" style="width:100%" :min="0" v-model="editData.marketprice"></InputNumber>
            </FormItem>
            <FormItem label="会员价" prop="memberprice">
              <InputNumber :max="9999999" style="width:100%" :min="0" v-model="editData.memberprice"></InputNumber>
            </FormItem>
          </Col>
        </Row>
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
        <!-- <Row>
          <Col span="6" v-for="(item, index) in propsData" :key="index">
            <FormItem :label="item.attributevalue">
              <Input v-model="item.value"></Input>
            </FormItem>
          </Col>
        </Row> -->
        <!-- <Row v-if="editData.typeid">
          <Col span="24" v-for="(prop, index) in propsArr" :key="index">
            <div class="propAdd">
              <ul>
                <li v-for="(item, indexs) in prop" :key="indexs">
                  <span>{{item.attrname}}</span>
                  <Input v-model="item.attrvalue" style="width:90px" placeholder="属性值"></Input>
                  <Select style="width:60px" v-model="item.ismain">
                    <Option :value="0">否</Option>
                    <Option :value="1">是</Option>
                  </Select>
                  <Input v-show="item.ismain == '1'" v-model="item.prcie" style="width:50px" placeholder="差价"></Input>
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
            <FormItem label="商品图片">
              <div class="shopimgs">
                <ul>
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
                      <a @click="onClickRemoveImg(index)">移除</a>
                    </p>
                  </li>
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
        <Col span="24">
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
      <Row>
        <Col span="24">
          <div class="btn-box">
            <Button type="primary" @click="onClickEdit" :loading="submitLoading">提交数据</Button>
            <Button   @click="backGoodsList" style="margin-left:10px;">返回列表</Button>
            <Button   @click="previewEditor" style="margin-left:10px;">预览详情</Button>
          </div>
        </Col>
      </Row>
    </Card>
    <Modal v-model="preModal" width="500">
      <p slot="header" style="text-align:center">
        <span>预览</span>
      </p>
      <div v-html="preContent" class="preview"></div>
      <div slot="footer">
        <Button    @click="preModal = false">取消</Button>
        <Button type="primary" @click="preModal = false">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
import TextEdit from '../common/text-editor'
import { uploadApiUrl } from '../../config'
export default {
  name: 'ShopGoodsEdit',
  components: {
    TextEdit
  },
  data () {
    return {
      editData: {},
      picArr: ['', '', '', '', ''],
      merchantData: [],
      goodsTypeData: [],
      submitLoading: false,
      preModal: false,
      uploadApiUrl: uploadApiUrl,
      rules: {
        goodsname: [{ required: true, message: '不能为空', trigger: 'blur' }],
        goodsimg: [{ required: true, message: '不能为空', trigger: 'blur' }],
        merchantcode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        goodsprice: [{ required: true, message: '不能为空', trigger: 'blur' }],
        marketprice: [{ required: true, message: '不能为空', trigger: 'blur' }],
        goodsstock: [{ required: true, message: '不能为空', trigger: 'blur' }],
      },
      ueConfig: {
        initialFrameWidth: '100%',
        initialFrameHeight: 222,
        toolbars: [['fullscreen', 'source', 'undo', 'redo', 'bold', 'italic',
          'underline','forecolor','fontborder', 'backcolor', 'fontsize', 'fontfamily',
          'justifyleft', 'justifyright','justifycenter', 'justifyjustify',
          'strikethrough','superscript', 'subscript','map', 'inserttable',
           'pasteplain', 'insertimage', 'lineheight', 'edittable', 'edittd', '|',
           'backcolor','insertorderedlist', 'insertunorderedlist',
          'selectall', 'cleardoc', 'link','emotion','preview']
        ]
      },
      preContent: '',
      sortData: [],
      propsArr: [],
      propsData: [],
      goodsTypesArr: [],
      goodsAttrs: {
        typename: '',
        goodsstock: null,
        mobileprice: null,
        appprice: null,
        goodsprice: null,
        memberprice: null,
        marketprice: null
      },
    }
  },
  created () {
    this.getMerchantData()
    this.getGoodsType()
    // this.getSortData()
  },
  mounted () {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      this.getOneById(this.$route.params.id)
    }
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
          console.log(response)
          if (response.data.code === 0){
            this.propsData = response.data.data.result
            this.propsData.forEach(item => {
              item.value = ''
            })
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
    getOneById (id) {
      this.$store.commit('pageLoading', true)
      serverApi('/goods/goodsinfo', {id: id},
        response => {
          console.log(response)
          this.$store.commit('pageLoading', false)
          if (response.data.code == 0) {
            this.editData = response.data.data
            let content = response.data.data.goodsdetailed
            let arr = response.data.data.imgdetailed ? response.data.data.imgdetailed.split(',') : []
            let arr1 = arr.concat(this.picArr)
            // this.propsArr = response.data.data.attrvalue || []
            this.goodsTypesArr = response.data.data.goodstype || []
            if (response.data.data.typeid) {
              this.getPropsData(response.data.data.typeid)
            }
            arr1.length = 5
            this.picArr = arr1
            this.$refs.ue.setContent(decodeURIComponent(content))
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.$Message.warning('连接失败！')
          this.$store.commit('pageLoading', false)
        })
    },
    getPropsData (id) {
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
            this.propsData = [...arr]
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
    uploadImgErr (response, file, fileList) {
      this.$Message.warning('上传失败！')
      console.log('err'+response,file,fileList)
    },
    uploadImgSucc (response, file) {
      if (response.code == 0) {
        this.$Notice.success({
          title: '上传成功',
          desc: '图片上传成功！'
        })
        let index = response.data.arrIndex
        this.$set(this.picArr, index, response.data.url)
      }
    },
    uploadImgSuccHead (response, file) {
      if (response.code == 0) {
        this.editData.goodsimg = response.data.url
        this.$Notice.success({
          title: '上传成功',
          desc: '图片上传成功！'
        })
      }else {
        this.$Message.info(response.msg)
      }
    },
    onClickRemoveImg (index) {
      this.$set(this.picArr, index, '')
    },
    onClickEdit () {
      this.submitLoading = true
      if (this.goodsTypesArr.length> 0) {
        this.editData.goodstype = JSON.stringify(this.goodsTypesArr)
      } else {
        this.editData.goodstype = ''
      }

      let realArr = this.picArr.filter(item => item !== '')
      this.editData.imgdetailed = realArr.toString()
      let content = this.$refs.ue.getUEContent()
      this.editData.goodsdetailed = content ? encodeURIComponent(content) : ''
      console.log(this.editData)
      serverApi('/goods/goodsedit', this.editData,
        response => {
          console.log(response)
          this.submitLoading = false
          if (response.data.code === 0) {
            // this.$router.push({name: 'ShopGoods'})
          }
          this.$Message.info(response.data.msg)
        },
        error => {
          console.log(error)
          this.submitLoading = false
          this.$Message.error("连接失败！")
        }
      )
    },
    backGoodsList () {
      this.$router.push({name: 'ShopGoods'})
    },
    previewEditor () {
      let content = this.$refs.ue.getUEContent()
      this.preContent = content
      this.preModal = true
    },
    onClickAddArr () {
      let arr = []
      this.propsData.forEach(item => {
        let obj = {
          id: item.id,
          ismain: '0',
          attrname: item.attributevalue,
          price: '',
          attrvalue: '',
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
    }
  }
}
</script>
<style lang="less" scoped>
img{
  width: 100%;
}
.ivu-upload{
  display: inline!important;
}
.shopimgs{
  ul{
    padding: 0;
    list-style: none;
    display: block;
    float: left;
    li{
      float: left;
      height: 102px;
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
    // border: 1px solid #e8e8e8;
    height: 133px;
    min-width: 200px;
    input{
      display: block;
      height: 20px;
      border: 1px solid #ddd;
      border-bottom: none;
      // border-left: none;
      width: 200px;
      &:nth-child(5){
        border-bottom: 1px solid #ddd;
      }
    }
  }
}
.btn-box{
  text-align: center;
}
.shop-img{
  width: 80px;
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
.preview{
  max-height: 500px;
  overflow: auto;
  img{
    width: 100%;
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
