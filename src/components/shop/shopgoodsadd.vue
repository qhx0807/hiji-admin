<template>
  <div class="">
    <Card :bordered="false">
      <Form :model="addData" ref="form" :rules="rules" :label-width="90">
        <Row>
          <Col span="6">
            <FormItem label="商品名称" prop="goodsname">
              <Input v-model="addData.goodsname"></Input>
            </FormItem>
            <FormItem label="商品简介"  prop="goodsdesc">
              <Input type="textarea" autosize v-model="addData.goodsdesc"></Input>
            </FormItem>
            <FormItem label="关键字"  prop="keywords">
              <Input autosize v-model="addData.keywords"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="所属分类" prop="goodsname">
              <Cascader change-on-select @on-change="onSelectDep" :data="goodsTypeData"></Cascader>
            </FormItem>
            <FormItem label="库存数量" prop="goodsname">
              <InputNumber :max="9999999" style="width:100%" :min="0" v-model="addData.goodsstock"></InputNumber>
            </FormItem>
            <FormItem label="移动端价格" prop="mobileprice">
              <InputNumber :max="9999999" style="width:100%" :min="0" v-model="addData.mobileprice"></InputNumber>
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
          </Col>
        </Row>
        <Row>
          <Col span="24">
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
      <Row>
        <Col span="24">
          <div class="btn-box">
            <Button type="primary" @click="onClickSubmit" :loading="submitLoading">提交数据</Button>
            <Button type="ghost" @click="backGoodsList" style="margin-left:10px;">返回列表</Button>
          </div>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import TextEdit from '../common/text-editor'
import { uploadApiUrl } from '../../config/'
export default {
  name: 'ShopGoodsAdd',
  components: {
    TextEdit
  },
  data () {
    return {
      merchantData: [],
      goodsTypeData: [],
      submitLoading: false,
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
        merchantcode: ''
      },
      picArr: ['', '', '', '', '', ''],
      actLi: 0,
      headerImgIndex: -1,
    }
  },
  created () {
    this.getMerchantData()
    this.getGoodsType()
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
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
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
      width: 120px;
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
      width: 220px;
      &:nth-child(6){
        border-bottom: 1px solid #ddd;
      }
    }
  }
}
.btn-box{
  text-align: center;
}
</style>
