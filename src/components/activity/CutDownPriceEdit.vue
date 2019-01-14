<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="http://cdn.cqyyy.cn/cutdown.png" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">修改信息</span></h4>
        <p>
          编辑砍价活动信息
          <router-link :to="{name: 'CutDownPrice'}">返回【活动列表】</router-link>
        </p>
      </div>
      <div class="clear-fix"></div>
    </Card>
    <Card :bordered="false" class="mb10">
      <Form :model="editData" ref="form" :rules="ruleValidate" :label-width="80">
        <Row>
          <Col span="6">
            <FormItem label="商品名称" required prop="goodsid">
              <Input v-model="editData.goodsname"></Input>
            </FormItem>
            <FormItem label="开始时间">
              <Input v-model="editData.starttime"></Input>
              <!-- <DatePicker type="datetimerange" @on-change="onSelectDateTime" style="width:100%" placeholder="选择起始日期"></DatePicker> -->
            </FormItem>

          </Col>
          <Col span="6">
            <FormItem label="商品属性" prop="goodstypeid">
              <Input v-model="editData.goodstypename" disabled></Input>
            </FormItem>
            <FormItem label="结束时间">
              <Input v-model="editData.endtime"></Input>
              <!-- <DatePicker type="datetimerange" @on-change="onSelectDateTime" style="width:100%" placeholder="选择起始日期"></DatePicker> -->
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="商品价格" required prop="goodsprice">
              <Input v-model="editData.goodsprice" ></Input>
            </FormItem>

            <FormItem label="有效时间(秒)" required>
              <Poptip trigger="focus" word-wrap width="220"  content="提示：有效时间以秒(s)为单位">
                <InputNumber :max="999999999" style="width:140px" :min="1" v-model="editData.bargintime"></InputNumber>
              </Poptip>
              <Tooltip placement="top" max-width="240" content="用户分享出去的有效砍价时间，以秒(s)为单位。 如：1天=24小时x60分x60秒 = 86400秒">
                <Icon type="ios-alert" size="20"/>
              </Tooltip>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="活动状态" prop="ison">
              <Select v-model="editData.ison">
                <Option :value="1">立即发布</Option>
                <Option :value="0">暂不发布</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="砍价目标(元)" required  prop="lowerprice">
              <InputNumber :max="999999999" style="width:100%" :min="0" v-model="editData.lowerprice"></InputNumber>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="每次砍价最高金额" required prop="topprice">
              <InputNumber :max="999999999" style="width:100%" :min="1" v-model="editData.topprice"></InputNumber>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="活动描述"  prop="rule">
              <Input type="textarea" :rows="1" v-model="editData.rule"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="分享标题" required  prop="sharetitle">
              <Input v-model="editData.sharetitle"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="分享描述" required  prop="sharedesc">
              <Input v-model="editData.sharedesc"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="分享图片" required  prop="shareimg">
              <Input v-model="editData.shareimg"></Input>
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
            <img v-imgview :src="editData.shareimg" class="share-img" alt="">
          </Col>
        </Row>
        <Row>
          <!-- <Col span="6">
            <FormItem label="活动页图"  prop="headimg">
              <Input v-model="addData.headimg"></Input>
            </FormItem>
          </Col> -->
           <Col span="6">
            <FormItem label="活动页图" >
              <UploadFile @uploadSucc="uploadHeadImg"></UploadFile>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="库存"  prop="goodsnum">
              <InputNumber :max="999999999" style="width:100%" :min="0" v-model="editData.goodsnum"></InputNumber>
            </FormItem>
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
                  <Input size="small" style="width:320px"  v-model="editData.lastmsg"></Input>
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
import UploadFile from '../common/UploadFile'
export default {
  name: 'CutDownPriceEdit',
  components: {
    UploadFile
  },
  data () {
    return {
      editData: {},
      cutRules: [],
      submitLoading: false,
      msgcontent: [],
      ruleValidate: {
      },
    }
  },
  created () {
    this.getActivityPata()
  },
  methods: {
    getActivityPata () {
      let d = {
        id: this.$route.params.id
      }
      this.$store.commit('pageLoading', true)
      serverApi('/activity/activityinfo', d,
        response => {
          if (response.data.code === 0) {
            console.log(response)
            this.editData = response.data.data
            this.cutRules = response.data.data.cutrules
            this.msgcontent = response.data.data.msgcontent
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.$store.commit('pageLoading', false)
        },
        error => {
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
        this.editData.shareimg = url
      } else {
        this.$Message.error('上传失败')
      }
    },
    onClickBack () {
      this.$router.back()
    },
    onSubmitData () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitLoading = true
          this.editData.msgcontent = JSON.stringify(this.msgcontent)
          this.editData.cutrules = JSON.stringify(this.cutRules)
          serverApi('/activity/activityedit', this.editData,
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
    uploadHeadImg (url) {

    }
  }
}
</script>
<style lang="less" scoped>
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
