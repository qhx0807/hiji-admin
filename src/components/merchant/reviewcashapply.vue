<template>
  <div class="box">
    <Card :bordered="false" v-show="isList">
      <div class="head">
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <DatePicker :options="dateOptions" @on-change="onSelectDate" type="daterange" placeholder="日期范围" style="width: 220px"></DatePicker>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
      </div>
      <Row>
        <Col span="24">
          <Tabs type="card" size="small" @on-click="onClickTabItem" :animated="false">
            <TabPane label="全部" name="-1"></TabPane>
            <TabPane :label="awaitReviewLabel" name="0"></TabPane>
            <!-- <TabPane label="已通过"></TabPane> -->
            <TabPane label="已拒绝" name="2"></TabPane>
            <TabPane label="已完成" name="1"></TabPane>
          </Tabs>
        </Col>
        <Col span="24">
          <Table :columns="columns" :loading="tableLoading" :border="false" :data="tableData"></Table>
          <div style="float: right; padding-top:12px">
            <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
          </div>
        </Col>
      </Row>
    </Card>
    <div v-show="!isList">
      <Card :bordered="false">
        <div class="tips">
          <h4>提现申请详细信息 / {{seeOneData.auditnumber}}</h4>
          <Row>
            <Col :lg="3" :md="5" :sm="8"><p>申请账户：{{seeOneData.username}}</p></Col>
            <Col :lg="3" :md="5" :sm="8"><p>可用余额：{{seeOneData.balance}}</p></Col>
            <Col :lg="3" :md="5" :sm="8"><p>提现金额：<span class="applyFee">￥{{seeOneData.price}}</span></p></Col>
            <Col :lg="3" :md="5" :sm="8"><p>
              状态：
              <span style="color: #f90" v-if="seeOneData.ispass == 0">等待审核</span>
              <span style="color: #2d8cf0; font-weight: 600" v-if="seeOneData.ispass == 1">审核通过</span>
              <span style="color: #ed3f14; font-weight: 600" v-if="seeOneData.ispass == 2">审核未通过</span>
              </p></Col>
          </Row>
          <Row>
            <Col :lg="3" :md="5" :sm="8"><p>申请时间：{{seeOneData.createtime}}</p></Col>
            <Col :lg="3" :md="5" :sm="8"><p>商户名称：{{seeOneData.name}}</p></Col>
            <Col :lg="3" :md="5" :sm="8"><p>商户编码：{{seeOneData.merchantcode}}</p></Col>
            <Col :lg="3" :md="5" :sm="8"><p>联系人：{{seeOneData.contact}}</p></Col>
            <Col :lg="3" :md="5" :sm="8"><p>联系电话：{{seeOneData.mobile}}</p></Col>
          </Row>
        </div>
      </Card>
      <Card :bordered="false" style="margin-top: 10px">
        <Row>
          <Col span="24">
            <Steps :current="stepNum" style="max-width:880px; margin:20px auto 0 auto">
              <Step title="查看信息" content="这里是该步骤的描述信息"></Step>
              <Step title="确认信息" content="这里是该步骤的描述信息"></Step>
              <Step title="完成" content="这里是该步骤的描述信息"></Step>
            </Steps>
          </Col>
          <Col span="24">
            <div class="review-info">
              <Form :label-width="180" v-show="stepNum == 0">
                <FormItem label="提现金额："><span class="applyFee">￥{{seeOneData.price}}</span></FormItem>
                <FormItem label="支付宝账户："><span>{{seeOneData.aliphone}}</span></FormItem>
                <FormItem label="支付宝姓名："><span>{{seeOneData.realname}}</span></FormItem>
                <FormItem label="可提现余额："><span>￥{{seeOneData.balance}}</span></FormItem>
                <FormItem>
                  <Button v-show="seeOneData.ispass==0" type="primary" @click="nextStepReview">下一步</Button>
                  <Button v-show="seeOneData.ispass==0" type="error" style="margin: 0 8px" @click="refuseApply">驳回提现申请</Button>
                  <Button type="ghost" @click="reviewBack">返回</Button>
                </FormItem>
              </Form>
              <Form :label-width="180" v-show="stepNum == 1">
                <FormItem label="金额："><span class="applyFee">￥{{seeOneData.price}}</span></FormItem>
                <FormItem label="打款至："><span>{{seeOneData.aliphone}}</span></FormItem>
                <FormItem label="收款人姓名："><span>{{seeOneData.realname}}</span></FormItem>
                <FormItem>
                  <Button v-show="seeOneData.ispass==0" type="primary" :loading="submitLoading" @click="confirmApplyReview">确认打款</Button>
                  <Button v-show="seeOneData.ispass==0" type="error" style="margin: 0 8px" @click="refuseApply">驳回提现申请</Button>
                  <Button type="ghost" @click="reviewBack">返回</Button>
                </FormItem>
              </Form>
              <div>
                <div class="apply-succ" v-show="stepNum == 2">
                  <div v-show="seeOneData.ispass==1" style="text-align:center;padding-bottom:30px">
                    <Icon :size="75" color="#52c41a" type="ios-checkmark"></Icon>
                    <h4>操作成功</h4>
                    <p>预计两小时内到账</p>
                  </div>
                  <div v-show="seeOneData.ispass==2" style="text-align:center;padding-bottom:30px">
                    <Icon :size="75" color="#ed3f14" type="ios-close"></Icon>
                    <h4>已拒绝</h4>
                    <p>提现申请已驳回</p>
                    <p>{{seeOneData.audittime}}</p>
                  </div>
                  <Form :label-width="320" v-show="seeOneData.ispass==1">
                    <FormItem style="margin-bottom:5px" label="金额："><span class="applyFee">￥{{seeOneData.price}}</span></FormItem>
                    <FormItem style="margin-bottom:5px" label="打款至："><span>{{seeOneData.aliphone}}</span></FormItem>
                    <FormItem style="margin-bottom:5px" label="收款人姓名："><span>{{seeOneData.realname}}</span></FormItem>
                    <FormItem style="margin-bottom:5px" label="审核时间："><span>{{seeOneData.audittime}}</span></FormItem>
                  </Form>
                  <div style="text-align:center;padding-top:25px">
                    <Button type="primary" style="width:180px"  @click="reviewBack">返回</Button>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'ReviewCashApply',
  data () {
    return {
      searchKey: '',
      count: 0,
      page: 1,
      pageSize: 10,
      isList: true,
      stepNum: 0,
      submitLoading: false,
      waitReviewNum: 0,
      awaitReviewLabel: (h) => {
        return h('div', [
          h('span', '待审核'),
          h('Badge', {
            props: {
              count: this.waitReviewNum,
              overflowCount: 99,
              className: 'await'
            }
          })
        ])
      },
      tableData: [],
      columns: [
        {
          title: '编号',
          key: 'auditnumber',
          width: 170
        },
        {
          title: '商户名称',
          key: 'name',
          minWidth: 100,
        },
        {
          title: '申请账户',
          key: 'username',
          minWidth: 100,
        },
        {
          title: '支付宝账户',
          key: 'aliphone',
          minWidth: 100
        },
        {
          title: '账户姓名',
          key: 'realname',
          width: 100
        },
        {
          title: '提现金额',
          key: 'price',
          minWidth: 100,
        },
        {
          title: '申请时间',
          key: 'createtime',
          width: 150
        },
        {
          title: '审核时间',
          key: 'audittime',
          width: 150
        },
        {
          title: '状态',
          key: 'ispass',
          width: 140,
          render: (h, params) => {
            const color = params.row.ispass === 0 ? 'yellow' : params.row.ispass === 1 ? 'green' : 'red'
            const text = params.row.ispass === 0 ? '待审核' : params.row.ispass === 1 ? '审核通过' : '已拒绝'
            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '操作',
          key: 'id',
          width: 100,
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.onClickAppleItem(params.row)
                }
              }
            }, '查看详情')
          }
        }
      ],
      tableLoading: false,
      seeOneData: {},
      dateOptions: {
        shortcuts: [
          {
            text: '最近一周',
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              return [start, end]
            }
          },
          {
            text: '最近一月',
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              return [start, end]
            }
          },
          {
            text: '最近三月',
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              return [start, end]
            }
          }
        ]
      },
      selectDateRange: ['','']
    }
  },
  created () {
    this.getWaitNum()
    this.getTableData('-1')
  },
  methods: {
    getTableData (type) {
      this.$store.commit('pageLoading', true)
      let d = {
        userid: sessionStorage.userid,
        pagesize: this.pageSize,
        page: this.page,
        like: this.searchKey,
        starttime: this.selectDateRange[0] || '',
        endtime: this.selectDateRange[1] || '',
        ispass: type || ''
      }
      serverApi('/putforward/auditshow', d,
        response => {
          this.$store.commit('pageLoading', false)
          if (response.data.code == 0) {
            this.count = response.data.data.count
            this.tableData = response.data.data.result
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$store.commit('pageLoading', false)
          this.$Message.error('连接失败')
        }
      )
    },
    getWaitNum () {
      let d = {
        userid: sessionStorage.userid,
        pagesize: '100',
        ispass: '0'
      }
      serverApi('/putforward/auditshow', d,
        response => {
          if (response.data.code == 0) {
            this.waitReviewNum = response.data.data.count
          }
        },
        error => {
          this.$Message.error('连接失败')
        }
      )
    },
    onClickSearch () {
      this.getTableData()
    },
    onClickTabItem (name) {
      this.getTableData(name)
      // this.tableLoading = true
    },
    changePage (e) {
      this.page = e
      // this.getTableData()
    },
    onChangeSize (e) {
      this.pageSize = e
      // this.getTableData()
    },
    onClickAppleItem (row) {
      this.seeOneData = row
      if (this.seeOneData.ispass != 0) {
        this.stepNum = 2
      }
      this.isList = false
    },
    nextStepReview () {
      this.stepNum = 1
    },
    refuseApply () {
      this.$Modal.confirm({
        title: '提示',
        content: '确认驳回此提现申请？',
        onOk: () => {
          serverApi('/putforward/auditedit', {id: this.seeOneData.id, ispass: '2'},
            response => {
              console.log(response)
              if (response.data.code == 0) {
                this.$Message.info('已拒绝该提现申请！')
                this.seeOneData.ispass = '2'
                this.stepNum = 2
              } else {
                this.$Message.warning(response.data.msg)
              }
            },
            error => {
              this.$Message.error('连接失败')
            }
          )
        }
      })
    },
    confirmApplyReview () {
      serverApi('/putforward/auditedit', {id: this.seeOneData.id, ispass: '1'},
        response => {
          console.log(response)
          if (response.data.code == 0) {
             this.stepNum = 2
             this.seeOneData.ispass = 1
             this.$Notice.success({
              title: '审核通过',
              desc: '资金将打款到相应账户。'
            })
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.error('连接失败')
        }
      )
    },
    reviewBack () {
      this.stepNum = 0
      this.isList = true
    },
    onSelectDate (e) {
      if (e) {
        this.selectDateRange = e
      } else {
        this.selectDateRange = ['','']
      }
    }
  }
}
</script>
<style lang="less">
.head{
  padding-bottom: 16px;
}
.await{
  background: #f60 !important;
  margin-left: 4px;
}
.tips {
  h4{
    font-size: 14px;
    margin-top: 4px;
  }
  p{
    font-size: 12px;
    margin-top: 10px;
  }
}
.review-info{
  max-width: 650px;
  margin: 0 auto;
  padding-top: 40px;
}
.applyFee{
  font-size: 14px;
  font-weight: 600;
  color: #f90;
}
.apply-succ{
  // text-align: center;
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


