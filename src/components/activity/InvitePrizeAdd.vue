<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="shop-img">
        <img src="http://cdn.cqyyy.cn/cutdown.png" alt="">
      </div>
      <div class="tips">
        <h4><span style="font-size:14px;font-weight:500">新增规则</span></h4>
        <p>
          编辑邀请有礼活动规则
          <router-link :to="{name: 'InvitePrize'}">返回【邀请有礼活动列表】</router-link>
        </p>
      </div>

      <div class="clear-fix"></div>
    </Card>
    <Card :bordered="false">
      <Form :model="addData" ref="form" :label-width="80" :rules="rules">
        <Row>
          <Col span="6">
            <FormItem label="选择城市" prop="cityid">
              <Select v-model="addData.cityid" placeholder="请选择">
                <Option v-for="(item, index) in areaData" :key="index" :value="item.id">{{item.areaname}}</Option>
              </Select>
            </FormItem>
            <FormItem label="邀请人数" prop="invitenum">
              <InputNumber :max="999999" :min="1" style="width:100%" v-model="addData.invitenum"></InputNumber>
            </FormItem>
            <FormItem label="奖励名称" prop="goodsname">
              <Input v-model="addData.goodsname"></Input>
            </FormItem>
            <FormItem label="缩略图" prop="goodsname">
              <FileUpload @uploadSucc="uploadimg"></FileUpload>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="开始时间" prop="starttime">
              <DatePicker type="datetime" placeholder="选择时间" style="width:100%" @on-change="onSelectStartTime"></DatePicker>
            </FormItem>
            <FormItem label="奖励对象" prop="invitetype">
              <Select v-model="addData.invitetype" placeholder="请选择">
                <Option :value="1">邀请人</Option>
                <Option :value="2">被邀请人</Option>
              </Select>
            </FormItem>
            <FormItem label="是否需邮费" v-show="addData.type==2" prop="isshipping">
               <i-switch v-model="addData.isshipping" :true-value="1" :false-value="0" size="large">
                  <span slot="open">是</span>
                  <span slot="close">否</span>
                </i-switch>
            </FormItem>
            <FormItem label="邮费" v-show="addData.isshipping == 1" prop="shippingamout">
              <!-- <Input v-model="addData.shippingamout"></Input> -->
              <InputNumber :max="999999" :min="0" style="width:100%" v-model="addData.shippingamout"></InputNumber>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="结束时间" prop="endtime">
              <DatePicker type="datetime" placeholder="选择时间" style="width:100%" @on-change="onSelectEndTime"></DatePicker>
            </FormItem>
            <FormItem label="奖励类型" prop="invitetype">
              <Select v-model="addData.type" placeholder="请选择">
                <Option v-for="(item, index) in inviteTypeArr" :key="index" :value="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
            <FormItem label="属性id" v-show="addData.type==1 || addData.type==2" prop="goodstypeid">
              <Input v-model="addData.goodstypeid"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="状态" prop="ison">
              <Select v-model="addData.ison" placeholder="请选择">
                <Option :value="1">启用</Option>
                <Option :value="0">关闭</Option>
              </Select>
            </FormItem>
            <FormItem label="奖励数量" prop="num">
              <InputNumber :max="999999" :min="1" style="width:100%" v-model="addData.num"></InputNumber>
            </FormItem>
            <FormItem label="奖品ID" prop="prizeid">
              <Input v-model="addData.prizeid"></Input>
            </FormItem>
          </Col>
        </Row>
        <Divider dashed/>
        <Row>
          <Col span="24">
            <FormItem >
              <Button type="primary" :loading="loading" @click="onSubmit">提交</Button>
              <Button style="margin-left: 12px" @click="$router.back()">返回</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import FileUpload from '../common/UploadFile'
export default {
  name: 'InvitePrizeAdd',
  components: {
    FileUpload
  },
  data () {
    return {
      addData: {
        cityid: '',
        starttime: '',
        endtime: '',
        ison: 1,
        invitemsg: '',
        prizeid: '',
        goodstypeid: '',
        type: null,
        num: 1,
        isshipping: 0,
        shippingamout: '0',
        invitenum: 1,
        invitetype: 1,
        goodsname: '',
        goodsimg: '',
      },
      areaData: [],
      rules: {
        cityid: { required: true, type: 'number', message: '不能为空', trigger: 'blur' },
        starttime: { required: true, message: '不能为空', trigger: 'blur' },
        endtime: { required: true, message: '不能为空', trigger: 'blur' },
        ison: { required: true, type: 'number', message: '不能为空', trigger: 'blur' },
        prizeid: { required: true, message: '不能为空', trigger: 'blur' },
        type: { required: true, type: 'number', message: '不能为空', trigger: 'blur' },
        invitetype: { required: true, type: 'number', message: '不能为空', trigger: 'blur' },
        num: { required: true, type: 'number', message: '不能为空', trigger: 'blur' },
        invitenum: { required: true, type: 'number', message: '不能为空', trigger: 'blur' },
        goodsname: { required: true, message: '不能为空', trigger: 'blur' },
        goodsimg: { required: true, message: '不能为空', trigger: 'blur' },
      },
      loading: false
    }
  },
  created () {
    this.getAreaData()
  },
  computed: {
    inviteTypeArr () {
      return this.$store.state.inviteTypeArr
    }
  },
  methods: {
    getAreaData () {
      this.$store.commit('pageLoading', true)
      serverApi('/area/index', '',
        response => {
          if (response.data.code === 0) {
            this.areaData = response.data.data
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.$store.commit('pageLoading', false)
        },
        error => {
          this.$store.commit('pageLoading', false)
          console.log(error)
        }
      )
    },
    onSelectStartTime (e) {
      this.addData.starttime = e
    },
    onSelectEndTime (e) {
      this.addData.endtime = e
    },
    uploadimg (e) {
      this.addData.goodsimg = e
    },
    onSubmit () {
      console.log(this.addData)
      this.$refs.form.validate(val => {
        if (!val) return false
        this.loading = true
        let obj = {
          "type": this.addData.type,
          "num":  this.addData.num,
          "prizeid": this.addData.prizeid,
          "goodstypeid": this.addData.goodstypeid,
          "isshipping": this.addData.isshipping,
          "shippingamout": this.addData.shippingamout,
          "invitenum": this.addData.invitenum,
          "invitetype": this.addData.invitetype,
          "goodsname": this.addData.goodsname,
          "goodsimg": this.addData.goodsimg,
        }
        this.addData.invitemsg = JSON.stringify(obj)
        serverApi('/activity/inviteadd', this.addData,
          response => {
            if (response.data.code === 0) {
              this.$Message.success(response.data.msg)
              this.$router.push({name: 'InvitePrize'})
            } else {
              this.$Message.warning(response.data.msg)
            }
            this.loading = false
          },
          error => {
            this.loading = false
            this.$Message.error(error.toString())
            console.log(error)
          }
        )
      })
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
