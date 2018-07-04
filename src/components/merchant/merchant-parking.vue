<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="tips">
        <h4>发放停车券</h4>
        <p>给指定的车辆车牌发放停车优惠券。当前可发优惠券数量：
          <a style="color:#f60;font-size:14px">{{ticketsNum}}</a>
          &nbsp;&nbsp;&nbsp;详情请咨询【宏帆Hi集客服】。点击
          <a v-show="action === 'records'" @click="action='send'">去发放优惠券</a>
          <a v-show="action === 'send'" @click="onClickSeeRecords">查看我的发放记录</a>
        </p>
      </div>
    </Card>
    <Card :bordered="false">
      <Row v-show="action === 'send'">
        <Col span="24">
          <Steps :current="stepNum" style="max-width:880px; margin:20px auto 0 auto">
            <Step title="输入车牌" content="输入车牌车牌号码信息"></Step>
            <Step title="确认信息" content="确认车牌号"></Step>
            <Step title="完成" content="优惠券发放成功"></Step>
          </Steps>
        </Col>
        <Col span="24">
          <div style="max-width: 600px;margin:0 auto; padding-top: 60px;">
            <div v-show="stepNum == 0">
              <Form ref="formValidate"  :label-width="100">
                <FormItem label="车牌号码：">
                  <Input
                    v-model="carNum"
                    style="width: 400px"
                    placeholder="输入车牌号码"
                    ></Input>
                </FormItem>
                <FormItem label="优惠券面值：">
                  无门槛立减4元优惠券
                </FormItem>
                <FormItem>
                  <Button type="primary" @click="nextStepSend">下一步</Button>
                </FormItem>
              </Form>
            </div>
            <div style="max-width: 450px;" v-show="stepNum == 1">
              <Row class="infoitem">
                <Col span="24">
                  <Alert show-icon closable>确认车牌号码，优惠券将直接发放给此账户，无法退回。</Alert>
                </Col>
              </Row>
              <Form ref="formValidate"  :label-width="100">
                <FormItem label="车牌号码：">
                  <span class="car-num">{{carNum}}</span>
                </FormItem>
                <FormItem label="优惠券面值：">
                  无门槛立减4元优惠券
                </FormItem>
              </Form>
              <Row class="infoitem">
                <Col span="13" style="text-align:right">
                  <Button type="primary" @click="confirmSend" :loading="submitLoading">确认</Button>
                  <Button type="ghost" @click="stepNum = 0" style="margin-left:8px">上一步</Button>
                </Col>
              </Row>
            </div>
            <div style="max-width: 450px;" v-show="stepNum == 2">
              <div class="apply-succ">
                <Icon :size="75" color="#52c41a" type="ios-checkmark"></Icon>
                <h4 >操作成功</h4>
                <p>优惠券将直接发放给此账户</p>
              </div>
              <Form ref="formValidate"  :label-width="200">
                <FormItem label="车牌号码：">
                  <span class="car-num">{{carNum}}</span>
                </FormItem>
                <FormItem label="优惠券面值：">
                  无门槛立减4元优惠券
                </FormItem>
              </Form>
              <Row class="infoitem" >
                <Col span="24" style="text-align:center">
                  <Button type="primary" @click="sendTicketsFinaly">继续发放卡券</Button>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
      <Row v-show="action === 'records'">
        <Col span="24">
          <Table size="small" :columns="columns" :data="recordsData"></Table>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'MerchantParking',
  data () {
    return {
      stepNum: 0,
      carNum: '',
      action: 'send',
      submitLoading: false,
      ticketsNum: 0,
      recordsData: [],
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 80
        },
        {
          title: '车牌号',
          key: 'carnum'
        },
        {
          title: '卡券',
          key: 'cost'
        },
        {
          title: '发放者',
          key: 'username'
        },
        {
          title: '发放时间',
          key: 'createtime'
        },
        {
          title: '是否使用',
          key: 'is_check'
        }
      ]
    }
  },
  created () {
    this.getTicketsNum()
    this.getMySendRecords()
  },
  methods: {
    getTicketsNum () {
      serverApi('/Merchant/showparkingvoucher', {},
        response => {
          // console.log(response)
          if (response.data.code == 0) {
            this.ticketsNum = response.data.data
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        })
    },
    getMySendRecords () {
      serverApi('/Merchant/parkingvoucherlist', {},
        response => {
          // console.log(response)
          if (response.data.code == 0) {
            this.recordsData = response.data.data
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        })
    },
    nextStepSend () {
      if (this.ticketsNum == 0) {
        this.$Message.warning('可发放券数量为 0！请联系客服购买卡券。')
        return false
      }
      let reg =/^[\u4e00-\u9fa5]{1}[A-Z]{1}[A-Z_0-9]$/
      if (!this.carNum.search(reg) || this.carNum.length<6 || this.carNum.length>9) {
        this.$Message.warning('请输入正确的车牌号码！')
        return false
      }
      this.stepNum = 1
    },
    confirmSend () {
      this.submitLoading = true
      let d = {
        carnum: this.carNum
      }
      serverApi('/Merchant/sendparkingvoucher', d,
        response => {
          // console.log(response)
          if (response.data.code == 0) {
            this.stepNum = 2
            this.$Notice.success({
              title: '卡券发放成功',
              desc: `${d.carnum} 已发放停车优惠券`
            })
            this.getMySendRecords()
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        })
    },
    sendTicketsFinaly () {
      this.carNum = ''
      this.stepNum = 0
    },
    onClickSeeRecords () {
      this.action = 'records'
    }
  }
}
</script>
<style lang="less" scoped>
.infoitem{
  margin-bottom: 24px;
}
.car-num{
  font-size: 14px;
  font-weight: 600;
  color: #f90;
}
.apply-succ{
  text-align: center;
  margin-bottom: 40px;
  h4{
    margin-top: 10px;
    font-size: 18px;
    color: #444;
  }
  p{
    color: #999;
    margin-top: 5px;
  }
}
</style>
