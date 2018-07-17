<template>
  <div class="box">
    <Card :bordered="false">
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
    </Card>
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
          </Col>
          <Col span="6">
            <FormItem label="卡券编码" prop="cardcode">
              <Input v-model="addData.cardcode"></Input>
            </FormItem>
             <FormItem label="关联活动">
             <Input v-model="addData.assignactiveid"></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="卡券类型">
              <Select v-model="addData.typeid" @on-change="onSelectType">
                <Option v-for="item in typeData" :value="item.id" :key="item.id">{{ item.typename }}</Option>
              </Select>
            </FormItem>
            <FormItem label="总数量">
              <Input v-model="addData.totalcount"></Input>
            </FormItem>
          </Col>
          <Col span="6">
          </Col>
        </Row>
        <Row>
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
          <!-- <Col span="24">
            <FormItem label="扩展信息">
              <Input type="textarea" v-model="cardExtraInfo"></Input>
            </FormItem>
          </Col> -->
        </Row>
      </Form>
      <hr style="margin-bottom:20px">
      <div style="text-align:center">
        <Icon v-show="propLoading" type="load-d" color="#2d8cf0" size="30" class="loading-icon"></Icon>
      </div>
      <Form :model="propsObj" :label-width="200">
        <Row>
          <Col span="12" v-for="item in typePropsData" :key="item.id">
            <FormItem :label="item.extrainfovalue">
              <Input v-model="propsObj[item.extrainfocode]"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col span="24">
          <TextEditor ref="ue" :config="ueConfig"></TextEditor>
        </Col>
      </Row>
      <Row>
        <Col span="24" style="text-align:center; padding-top:30px">
          <Button :loading="modal_loading" style="width:180px" @click="onClickAdd" type="primary">保存</Button>
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
  name: 'CouponItemAdd',
  components: {
    TextEditor
  },
  data () {
    return {
      editData: {},
      recModal: false,
      ueConfig: {
        initialFrameWidth: '100%',
        initialFrameHeight: 350
      },
      addData: {
        cardcode: '',
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
        carddesc: ''
      },
      id: null,
      rules: {
        cardcode: [{ required: true, message: '不能为空', trigger: 'blur' }],
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
        { name: '发布', value: 1 },
        { name: '有效', value: 2 },
        { name: '停止', value: 3 },
        { name: '无效', value: 4 },
        { name: '过期', value: 5 }
      ],
      typePropsData: [],
      propsObj: {},
      propLoading: false,
      ueContent: ''
    }
  },
  created () {
    this.getCardType()
  },
  computed: {
    cardExtraInfo () {
      return JSON.stringify(this.propsObj)
    }
  },
  methods: {
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
      this.getPropsByid(e)
    },
    onClickAdd () {
      let content = this.$refs.ue.getUEContent()
      this.addData.carddesc = content ?  encodeURIComponent(content) : ''
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
.loading-icon{
  animation:  loading 1s linear infinite;
}
</style>
