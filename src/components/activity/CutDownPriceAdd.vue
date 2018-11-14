<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="http://cdn.cqyyy.cn/cutdown.png" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">新增砍价活动</span></h4>
        <p>
          编辑砍价活动信息
          <router-link :to="{name: 'CutDownPrice'}">返回【活动列表】</router-link>
        </p>
      </div>

      <div class="clear-fix"></div>
    </Card>
    <Card :bordered="false" class="mb10">
      <Form :model="addData" ref="form" :rules="ruleValidate" :label-width="80">
        <Row>
          <Col span="6">
            <FormItem label="选择商品" prop="goodsid">
              <Select v-model="addData.goodsid" clearable filterable remote @on-change="onSelectGoods" :loading="selectLoading" :remote-method="getGoodsList">
                <Option v-for="item in goodsList" :value="item.id" :key="item.id">{{ item.goodsname }}</Option>
              </Select>
            </FormItem>
            <FormItem label="活动时间" required>
              <DatePicker type="datetimerange" @on-change="onSelectDateTime" style="width:100%" placeholder="选择起始日期"></DatePicker>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="商品属性" prop="goodstypeid">
              <Select v-model="addData.goodstypeid" :disabled="goodsTypeData.length<1"  @on-change="onSelectGoodsType">
                <Option v-for="item in goodsTypeData" :value="item.id" :key="item.id">{{ item.typename }}</Option>
              </Select>
            </FormItem>
            <FormItem label="有效时间(秒)" required>
              <Poptip trigger="focus" word-wrap width="220"  content="提示：活动有效时间以秒(s)为单位">
                <InputNumber :max="999999999" style="width:100%" :min="1" v-model="addData.bargintime"></InputNumber>
              </Poptip>
              <Tooltip placement="top" max-width="240" content="用户分享出去的有效砍价时间，以秒(s)为单位。 如：1天=24小时x60分x60秒 = 86400秒">
                <Icon type="ios-alert" size="20"/>
              </Tooltip>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="商品价格"  prop="goodsprice">
              <Input v-model="addData.goodsprice" disabled></Input>
            </FormItem>
            <FormItem label="砍价目标(元)"  prop="lowerprice">
              <InputNumber :max="999999999" style="width:100%" :min="1" v-model="addData.lowerprice"></InputNumber>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="活动状态" prop="ison">
              <Select v-model="addData.ison">
                <Option :value="1">立即发布</Option>
                <Option :value="0">暂不发布</Option>
              </Select>
            </FormItem>
            <FormItem label="每次砍价最高金额"  prop="topprice">
              <InputNumber :max="999999999" style="width:100%" :min="1" v-model="addData.topprice"></InputNumber>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="活动描述"  prop="rule">
              <Input type="textarea" :rows="1" v-model="addData.rule"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="分享标题"  prop="sharetitle">
              <Input v-model="addData.sharetitle"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="分享描述"  prop="sharedesc">
              <Input v-model="addData.sharedesc"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="分享图片"  prop="shareimg">
              <Input v-model="addData.shareimg"></Input>
            </FormItem>
          </Col>
          <Col span="3" style="padding-left:6px;padding-top:1px;">
            <Upload
              :action="uploadApiUrl"
              :on-error="uploadImgErr"
              :on-success="uploadImgSucc"
              :show-upload-list="false"
              accept="image/*">
              <Button icon="ios-cloud-upload-outline">上传图片</Button>
            </Upload>
          </Col>
          <Col span="3">
            <img v-imgview :src="addData.shareimg" class="share-img" alt="">
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span="12">
            <FormItem label="砍价规则">
              <Alert>设置砍价规则，砍价次数对应砍价金额占单次最高砍价金额的百分百。</Alert>
              <Row>
                <Col span="24" style="margin-bottom:8px" v-for="(item, index) in cutRules" :key="index">
                  <span>砍价次数 前</span>
                  <InputNumber size="small" :max="999999999" style="width:60px" :min="1" v-model="item.rank"></InputNumber>次
                  &nbsp;
                  <span>最高可砍价金额(元)</span>
                  <InputNumber  size="small" :max="999999999" style="width:100px" :min="1" v-model="item.maxprice"></InputNumber>
                  <Button  size="small" style="margin-left:6px" type="dashed" icon="ios-close" @click="onCLickDelRules(index)">删除</Button>
                </Col>
                <Col span="24">
                  <Button size="small" style="margin-top:6px" icon="ios-add" type="dashed" @click="onClickAddRules">添加规则</Button>
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="提示消息">
              <Alert>砍价完成的提示语，与砍价金额占单次最高砍价金额的百分百。</Alert>
              <Row>
                <Col span="24">
                  <span>最后一次砍价完成提示语：</span>
                  <Input size="small" style="width:320px"  v-model="addData.lastmsg"></Input>
                </Col>
                <Col span="24" style="margin-top:8px" v-for="(item, index) in msgcontent" :key="index">
                  <span>占最高砍价金额的</span>
                  <InputNumber size="small" :max="80" style="width:60px" :min="1" v-model="item.percent"></InputNumber>%
                  &nbsp;
                  <span>消息提示语</span>
                  <Input size="small" style="width:160px"  v-model="item.msg"></Input>
                  <Button size="small" style="margin-left:6px" icon="ios-close" @click="onCLickDelMsgs(index)" type="dashed">删除</Button>
                </Col>
                <Col span="24">
                  <Button size="small" style="margin-top:6px" icon="ios-add" @click="onClickAddMsgs" type="dashed">添加规则</Button>
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <Divider />
        <div class="btn-box">
          <Button type="primary" :loading="submitLoading" @click="onSubmitData">提交数据</Button>
          <Button style="margin-left:10px;" @click="onClickBack">返回</Button>
        </div>
      </Form>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { uploadApiUrl } from '../../config/'
export default {
  name: 'CutDownPriceAdd',
  data () {
    return {
      uploadApiUrl: uploadApiUrl,
      addData: {
        type: 1,
        starttime: '',
        endtime: '',
        bargintime: 24*60*60,
        peoplenum: '',
        residue: '',
        topprice: null,
        lowerprice: 0,
        goodsid: '',
        goodstypeid: '',
        goodsprice: '',
        msgcontent: '',
        lastmsg: '大刀阔斧，一招定乾坤，完成最后一刀！',
        ison: 0,
        rule: '',
        shareimg: '',
        sharetitle: '',
        sharedesc: '',
        cutrules: ''
      },
      ruleValidate: {
        starttime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endtime: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ],
        goodsid: [
          { required: true, message: '请选择商品', type: 'number', trigger: 'blur' }
        ],
        goodsprice: [
          { required: true, message: '请选择商品', trigger: 'blur' }
        ],
        lowerprice: [
          { required: true, message: '请输入', type: 'number', trigger: 'blur' }
        ],
        topprice: [
          { required: true, message: '请输入', type: 'number', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请输入分享标题', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入分享描述', trigger: 'blur' }
        ],
        shareimg: [
          { required: true, message: '分享图片', trigger: 'blur' }
        ],
      },
      goodsList: [],
      goodsTypeData: [],
      selectLoading: false,
      submitLoading: false,
      cutRules: [
        {rank: 10, maxprice: 1},
        {rank: 20, maxprice: 2}
      ],
      msgcontent: [
        {percent: 10, msg: '初出茅庐，小试牛刀'},
        {percent: 50, msg: '一刀砍过半边天'},
        {percent: 70, msg: '家传刀法，盖世神功'},
        {percent: 90, msg: '刀法如神，犹如庖丁解牛'}
      ]
    }
  },
  created () {
    this.getGoodsList('')
  },
  methods: {
    getGoodsList (e) {
      let d = {
        pagesize: 20,
        page: 1,
        like: e
      }
      this.selectLoading = true
      serverApi('/goods/index', d,
        response => {
          if (response.data.code === 0){
            this.goodsList = response.data.data.result
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.selectLoading = false
        },
        error => {
          console.log(error)
          this.selectLoading = false
          this.$Message.error('连接失败！')
        }
      )
    },
    onSelectGoods (e) {
      if (e) {
        let row = this.goodsList.find(item => {
          return item.id === e
        })
        console.log(row);
        this.goodsTypeData = row.goodstype
        this.addData.goodsid = e
        this.addData.goodsprice = row.goodsprice
        this.addData.shareimg = row.goodsimg

      } else {
        this.getGoodsList('')
        this.goodsTypeData = []
        this.addData.goodsid = ''
        this.addData.goodsprice = ''
        this.addData.goodstypeid = ''
      }
    },
    onSelectGoodsType (e) {
      if (e) {
        this.addData.goodstypeid = e
        let row = this.goodsTypeData.find(item => {
          return item.id === e
        })
        this.addData.goodsprice = row.goodsprice
      } else {
        this.addData.goodstypeid = ''
        this.addData.goodsprice = ''
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
        let url = response.data.url
        this.addData.shareimg = url
      } else {
        this.$Message.error('上传失败')
      }
    },
    onSelectDateTime (e) {
      this.addData.starttime = e[0]
      this.addData.endtime = e[1]
    },
    onClickAddRules () {
      let obj = {rank: null, maxprice: null}
      this.cutRules.push(obj)
    },
    onCLickDelRules (index) {
      this.cutRules.splice(index, 1)
    },
    onClickAddMsgs () {
      let obj = {percent: null, msg: '初出茅庐，小试牛刀'}
      this.msgcontent.push(obj)
    },
    onCLickDelMsgs (index) {
      this.msgcontent.splice(index, 1)
    },
    onSubmitData () {
      console.log(this.addData)
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          this.addData.cutrules = JSON.stringify(this.cutRules)
          this.addData.msgcontent = JSON.stringify(this.msgcontent)
          serverApi('/activity/activityadd', this.addData,
            response => {
              if (response.data.code === 0) {
                this.$Message.success(response.data.msg)
              } else {
                this.$Message.warning(response.data.msg)
              }
              this.submitLoading = false
            },
            error => {
              this.submitLoading = false
              console.log(error)
              this.$Message.error(error.toString())
            }
          )
        }
      })
    },
    onClickBack () {
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
.box{
  position: relative;
}
.shop-img{
  width: 40px;
  height: 40px;
  float: left;
  img{
    height: 100%;
    width: 100%;
  }
}
.tips{
  padding-left: 50px;
  h4{
    margin-top: 2px;
  }
  p{
    margin-top: 3px;
  }
}
.share-img{
  height: 40px;
}
.btn-box{
  text-align: center;
  padding-bottom: 30px;
}
</style>
