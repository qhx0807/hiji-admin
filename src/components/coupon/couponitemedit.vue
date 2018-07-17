<template>
  <div class="box">
    <Card :bordered="false">
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
    </Card>
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
          </Col>
          <Col span="6">
            <FormItem label="卡券编码" prop="merchantcode">
              <Input v-model="editData.cardcode"></Input>
            </FormItem>
            <FormItem label="结束发放时间">
              <Input v-model="editData.endsendtime"></Input>
            </FormItem>
            <FormItem label="总数量">
              <Input v-model="editData.totalcount"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="卡券类型">
              <Select v-model="editData.typeid" @on-change="onSelectType">
                <Option v-for="item in typeData" :value="item.id" :key="item.id">{{ item.typename }}</Option>
              </Select>
            </FormItem>
            <FormItem label="开始使用时间">
             <Input v-model="editData.startusetime"></Input>
            </FormItem>
            <FormItem label="关联活动">
             <Input v-model="editData.assignactiveid"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="剩余数量">
              <Input v-model="editData.remaincount"></Input>
            </FormItem>
            <FormItem label="开始使用时间">
             <Input v-model="editData.endusetime"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="扩展信息">
              <Input type="textarea" :rows="1" disabled v-model="editData.cardextrainfo"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <hr style="margin-bottom:20px">
      <div style="text-align:center">
        <Icon v-show="propLoading" type="load-d" color="#2d8cf0" size="30" class="loading-icon"></Icon>
      </div>
      <Form :model="extProps" :label-width="200">
        <Row>
          <Col span="12" v-for="item in typePropsData" :key="item.id">
            <FormItem :label="item.extrainfovalue">
              <Input v-model="extProps[item.extrainfocode]"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col span="24">
          <TextEditor ref="ue" :config="ueConfig" :defaultMsg="defaultMsg"></TextEditor>
        </Col>
      </Row>
      <Row>
        <Col span="24" style="text-align:center; padding-top:30px">
          <Button :loading="modal_loading" style="width:180px" @click="onClickEdit" type="primary">保存</Button>
          <Button style="width:100px; margin-left:10px" @click="previewCoupon" type="info">预览卡券</Button>
        </Col>
      </Row>
    </Card>

    <Modal v-model="recModal" width="410">
      <p slot="header" style="text-align:center">
        <span>预览卡券</span>
      </p>
      <div>
        <div class="preview" v-html="ueContent"></div>
      </div>
      <div slot="footer">
        <Button type="ghost"  @click="recModal = false">取消</Button>
        <Button type="primary" @click="recModal = false">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
import TextEditor from '../common/text-editor'
export default {
  name: 'CouponItemEdit',
  components: {
    TextEditor
  },
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
      rules: {
        extrainfocode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        extrainfovalue: [{ required: true, message: '不能为空', trigger: 'blur' }]
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
        { name: '发布', value: 1 },
        { name: '有效', value: 2 },
        { name: '停止', value: 3 },
        { name: '无效', value: 4 },
        { name: '过期', value: 5 }
      ],
      typePropsData: [],
      propsObj: {},
      ueContent: '',
      defaultMsg: ''
    }
  },
  created () {
    this.getCardType()
    if (this.$route.params.id) {
      this.id = this.$route.params.id
      this.getOneById(this.$route.params.id)
    }
  },
  computed: { },
  methods: {
    getOneById (id) {
      this.$store.commit('pageLoading', true)
      serverApi('/card/getcouponbyid', {id: id},
        response => {
          console.log(response)
          this.$store.commit('pageLoading', false)
          if (response.data.code == 0) {
            this.editData = response.data.data
            this.extProps = response.data.data.cardextrainfo ? JSON.parse(response.data.data.cardextrainfo) : ''
            this.defaultMsg = response.data.data.carddesc ? decodeURIComponent(response.data.data.carddesc) : ''
            this.$refs.ue.setContent(this.defaultMsg)
            this.getPropsByid(this.editData.typeid)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.$store.commit('pageLoading', false)
          this.$Message.error('连接失败！')
        })
    },
    onSelectType (e) {
      this.getPropsByid(e)
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
      let content = this.$refs.ue.getUEContent()
      this.editData.carddesc = content ?  encodeURIComponent(content) : ''
      this.editData.cardextrainfo = JSON.stringify(this.extProps)
        serverApi('/card/couponedit', this.editData,
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
    }
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
.tips{
  padding-left: 100px;
  h4{
    margin-top: 17px;
  }
}
</style>
