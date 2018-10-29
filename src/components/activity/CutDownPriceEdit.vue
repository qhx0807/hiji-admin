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
            <FormItem label="商品名称" prop="goodsid">
              <Input v-model="editData.goodsname" disabled></Input>
            </FormItem>
            <FormItem label="活动时间">
              <Input v-model="editData.starttime"></Input>
              <!-- <DatePicker type="datetimerange" @on-change="onSelectDateTime" style="width:100%" placeholder="选择起始日期"></DatePicker> -->
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="商品属性" prop="goodstypeid">
              <Input v-model="editData.goodstypename" disabled></Input>
            </FormItem>
            <FormItem label="有效时间(秒)" required>
              <InputNumber :max="999999999" style="width:100%" :min="1" v-model="editData.bargintime"></InputNumber>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="商品价格"  prop="goodsprice">
              <Input v-model="editData.goodsprice" disabled></Input>
            </FormItem>
            <FormItem label="砍价目标(元)"  prop="lowerprice">
              <InputNumber :max="999999999" style="width:100%" :min="1" v-model="editData.lowerprice"></InputNumber>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="活动状态" prop="ison">
              <Select v-model="editData.ison">
                <Option :value="1">立即发布</Option>
                <Option :value="0">暂不发布</Option>
              </Select>
            </FormItem>
            <FormItem label="每次砍价最高金额"  prop="topprice">
              <InputNumber :max="999999999" style="width:100%" :min="1" v-model="editData.topprice"></InputNumber>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="活动描述"  prop="rule">
              <Input type="textarea" :rows="1" v-model="editData.rule"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="分享标题"  prop="title">
              <Input v-model="editData.title"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="分享描述"  prop="desc">
              <Input v-model="editData.desc"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="分享图片"  prop="shareimg">
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
export default {
  name: 'CutDownPriceEdit',
  data () {
    return {
      editData: {},
      cutRules: [],
      msgcontent: [],
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
