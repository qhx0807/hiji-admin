<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="tips">
        <h4>发放停车券</h4>
        <p>给指定的车辆车牌发放停车优惠券。当前可发优惠券金额：
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
                  <Select v-model="selectValue" style="width:400px">
                    <Option v-for="(item, index) in cardList" :value="item" :key="item">{{item}}元</Option>
                  </Select>
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
                  无门槛立减{{selectValue}}元优惠券
                </FormItem>
              </Form>
              <Row class="infoitem">
                <Col span="13" style="text-align:right">
                  <Button type="primary" @click="confirmSend" :loading="submitLoading">确认</Button>
                  <Button   @click="stepNum = 0" style="margin-left:8px">上一步</Button>
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
                  无门槛立减{{selectValue}}元优惠券
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
          <Table size="default" :columns="columns" :data="recordsData"></Table>
          <div style="float: right; padding-top:12px">
            <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
          </div>
          <div style="clear:both"></div>
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
      count: 0,
      page: 1,
      pageSize: 10,
      submitLoading: false,
      getReLoading: false,
      ticketsNum: 0,
      recordsData: [],
      selectValue: 4,
      cardList: [2, 4, 6, 8, 10, 12, 24, 36],
      columns: [
        {
          title: '#',
          key: 'id',
          width: 90
        },
        {
          title: '车牌号',
          key: 'carnum'
        },
        {
          title: '卡券',
          key: 'cost',
          sortable: true
        },
        {
          title: '发放者',
          key: 'username',
          sortable: true
        },
        {
          title: '发放时间',
          key: 'createtime',
          sortable: true
        },
        {
          title: '是否使用',
          key: 'is_check',
          sortable: true,
          render: (h, params) => {
            let text = params.row.is_check == '1' ? '已使用' : '未使用'
            let color = params.row.is_check == '1' ? '#2d8cf0' : '#ff9900'
            return h('span', {
              style: {
                color: color
              }
            }, text)
          }
        }
      ]
    }
  },
  created () {
    this.getTicketsNum()
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
      let d = {
        pagesize: this.pageSize,
        page: this.page,
        like: ''
      }
      this.$Message.loading({
        content: '数据加载中...',
        duration: 0
      })
      serverApi('/Merchant/parkingvoucherlist', d,
        response => {
          console.log(response)
          this.$Message.destroy()
          if (response.data.code == 0) {
            // this.recordsData = response.data.data.result
            // this.count = response.data.counts
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.destroy()
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
        carnum: this.carNum,
        cost: this.selectValue
      }
      serverApi('/Merchant/sendparkingvoucher', d,
        response => {
          // console.log(response)
          this.submitLoading = false
          if (response.data.code == 0) {
            this.stepNum = 2
            this.$Notice.success({
              title: '卡券发放成功',
              desc: `${d.carnum} 已发放停车优惠券`
            })
            this.getTicketsNum()
            // this.getMySendRecords()
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.submitLoading = false
          console.log(error)
        })
    },
    sendTicketsFinaly () {
      this.carNum = ''
      this.stepNum = 0
    },
    onClickSeeRecords () {
      if (this.getReLoading) return false
      let d = {
        pagesize: this.pageSize,
        page: this.page,
        like: ''
      }
      this.getReLoading = true
      this.$Message.loading({
        content: '数据加载中...',
        duration: 0
      })
      serverApi('/Merchant/parkingvoucherlist', d,
        response => {
          // console.log(response)
          this.getReLoading = false
          this.$Message.destroy()
          if (response.data.code == 0) {
            this.recordsData = response.data.data.result
            this.count = response.data.data.counts
            this.action = 'records'
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.destroy()
          this.getReLoading = false
          console.log(error)
        })
    },
    changePage (e) {
      this.page = e
      this.onClickSeeRecords()
    },
    onChangeSize (e) {
      this.pageSize = e
      this.onClickSeeRecords()
    },
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
