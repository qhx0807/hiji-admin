<template>
  <div class="box">
    <Card :bordered="false">
      <!-- <Input v-model="searchKey" placeholder="关键字搜索..." style="width: 200px"></Input>
      <Select v-model="timetype" clearable style="width: 120px; margin-left:15px">
        <Option v-for="(item, index) in timeTypeList" :key="index" :value="item.value">{{item.name}}</Option>
      </Select>
      <DatePicker :options="dateOptions" type="daterange" placeholder="日期范围" @on-change="onSelectDate" style="width: 220px;margin-left:-3px"></DatePicker>
      <Button type="primary" :loading="tableLoading" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
      <Button type="primary" style="margin-left:8px" @click="goBackFinace" icon="ios-arrow-back">返回</Button>
      <Button type="primary" :loading="exportLoading" style="margin-left:8px; float:right" @click="exportTable" icon="md-arrow-down">导出数据</Button> -->
      <Row :gutter="10">
        <Col span="4">
          <Select v-model="merchantid" filterable clearable placeholder="搜索商户">
            <Option v-for="(item, index) in merchantData" :key="index" :value="item.id">{{item.name}}</Option>
          </Select>
        </Col>
        <Col span="4">
          <Input v-model="searchKey" clearable placeholder="关键字搜索..."></Input>
        </Col>
        <Col span="4">
          <Select v-model="isapply" placeholder="商户申请状态" clearable>
            <Option value="9">全部</Option>
            <Option value="1">已申请</Option>
            <Option value="0">未申请</Option>
          </Select>
        </Col>
        <Col span="4">
          <Select v-model="isauditing" placeholder="财务会计审核状态" clearable>
            <Option value="9">全部</Option>
            <Option value="1">已审核</Option>
            <Option value="0">未审核</Option>
          </Select>
        </Col>
        <Col span="4">
          <Select v-model="isapprove" clearable placeholder="财务总监审批状态">
            <Option value="9">全部</Option>
            <Option value="1">已审批</Option>
            <Option value="0">未审批</Option>
          </Select>
        </Col>
        <Col span="4">
          <Select v-model="ispayment" clearable placeholder="打款状态">
            <Option value="9">全部</Option>
            <Option value="1">已打款</Option>
            <Option value="0">未打款</Option>
          </Select>
        </Col>
      </Row>
      <Row style="margin-top:10px">
        <Col span="8">
          <Select v-model="timetype" clearable placeholder="选择时间条件" style="width: 140px;">
            <Option v-for="(item, index) in timeTypeList" :key="index" :value="item.value">{{item.name}}</Option>
          </Select>
          <DatePicker :options="dateOptions" type="daterange" placeholder="日期范围" @on-change="onSelectDate" ></DatePicker>
        </Col>
        <Col span="16" style="text-align:right">
          <Button type="primary" :loading="tableLoading" icon="ios-search" @click="onClickSearch">搜索</Button>
          <Button type="primary" style="margin-left:8px" @click="goBackFinace" icon="ios-arrow-back">返回</Button>
          <Button type="primary" :loading="exportLoading" style="margin-left:8px; float:right" @click="exportTable" icon="md-arrow-down">导出数据</Button>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" style="margin-top:10px">
      <Table border ref="table" highlight-row :loading="tableLoading" size="small" height="550" :columns="columns" :data="tableData">
        <div slot="footer">
          <p style="text-align:center" v-if="tableData.length > 0">当前页提现金额合计：<span style="font-size:16px;color:#f40">￥{{txTotal}}</span></p>
        </div>
      </Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="counts" show-sizer show-total :page-size-opts="pageSizeOpts" :page-size="100" :current="page" @on-page-size-change="onChangeSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import exportExcel from  '../../utlis/table2excel.js'
export default {
  name: 'CashPay',
  data () {
    return {
      searchKey: '',
      tableLoading: false,
      exportLoading: false,
      shModal: false,
      passLoading: false,
      refuseLoading: false,
      payLoading: true,
      counts: 0,
      page: 1,
      pageSize: 100,
      pageSizeOpts: [10, 15, 25, 50, 70, 100, 200, 300],
      tableData: [],
      merchantData: [],
      shData: {},
      starttime: '',
      endtime: '',
      timeTypeList: [
        {value: 'applytime', name: '申请时间'},
        {value: 'auditingtime', name: '财务会计审核时间'},
        {value: 'paymenttime', name: '打款时间'},
        {value: 'approvetime', name: '财务总监审批时间'},
        {value: 'receivablestime', name: '收款时间'}
      ],
      columns: [
        {
          type: 'index',
          width: 50,
          align: 'center'
        },
        {
          title: '商户',
          key: 'merchantname',
          width: 140,
          tooltip: true
        },
        {
          title: '设备号id',
          key: 'equipmentid',
          width: 90,
          tooltip: true
        },
        {
          title: '申请单号',
          key: 'applyno',
          minWidth: 170,
        },
        {
          title: '支付金额',
          key: 'cash',
          width: 110,
          sortable: true,
          align: 'right'
        },
        {
          title: '提现金额',
          key: 'total',
          width: 110,
          sortable: true,
          align: 'right',
          render: (h, params) => {
            return h('span', {
              style: {
                color: '#f40',
                fontWeight: '600',
                fontSize: '14px'
              }
            }, params.row.total)
          }
        },
        {
          title: '平台优惠',
          key: 'coupon',
           width: 110,
          sortable: true,
          align: 'right'
        },
        {
          title: '商户优惠',
          key: 'merchantcoupon',
          width: 110,
          sortable: true,
          align: 'right'
        },
        {
          title: '订单优惠',
          key: 'subsidy',
          width: 110,
          sortable: true,
          align: 'right'
        },
        {
          title: '对账状态',
          key: 'ispay',
          width: 120,
          render: (h, params) => {
            let text = '已对账'
            let color = 'success'
            let el = h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
            return el
          }
        },
        {
          title: '申请状态',
          key: 'isapply',
          width: 120,
          render: (h, params) => {
            let text = params.row.isapply == 1 ? '已申请' : '未申请'
            let color = params.row.isapply == 1 ? 'success' : 'warning'
            let el = h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
            return el
          }
        },
        {
          title: '财务审核',
          key: 'isauditing',
          width: 120,
          render: (h, params) => {
            let text = params.row.isauditing == 1 ? '已审核' : '未审核'
            let color = params.row.isauditing == 1 ? 'success' : 'warning'
            let el = h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
            return el
          }
        },
        {
          title: '领导审批',
          key: 'isapprove',
          width: 120,
          render: (h, params) => {
            let text = params.row.isapprove == 1 ? '已审批' : '未审批'
            let color = params.row.isapprove == 1 ? 'success' : 'warning'
            let el = h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
            return el
          }
        },
        {
          title: '打款状态',
          key: 'ispayment',
          width: 120,
          render: (h, params) => {
            let text = params.row.ispayment == 1 ? '已打款' : '未打款'
            let color = params.row.ispayment == 1 ? 'success' : 'warning'
            let el = h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
            return el
          }
        },
        {
          title: '扣点',
          key: 'points',
          width: 100,
        },
        {
          title: '审核',
          key: 'id',
          fixed: 'right',
          width: 80,
          align: 'center',
          render: (h, params) => {
            let sh = h('a', {
              on: {
                click: () => {
                  this.onClickReview(params.row)
                }
              }
            }, '打款')
            let ysh = h('span', { }, '已打款')
            return params.row.ispayment == 0 ? sh : ysh
          }
        }
      ],
      isapply: '',
      isauditing: '',
      isapprove: '',
      ispayment: '',
      merchantid: ''
    }
  },
  created () {
    this.getTableData()
    this.getMerchant()
  },
  computed: {
    dateOptions () {
      return this.$store.state.dateOptions
    },
    txTotal () {
      let fee = 0
      this.tableData.forEach(item => {
        fee += Number(item.total)
      })
      return fee.toFixed(2)
    }
  },
  methods: {
    onClickSearch () {
      this.getTableData()
    },
    onSelectDate (e) {
      this.starttime = e[0]
      this.endtime = e[1]
    },
    getMerchant () {
      let d = {
        pagesize: 999999,
        page: 1
      }
      this.$store.commit('pageLoading', true)
      serverApi('/Merchant/index', d,
        response => {
          console.log(response)
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
    getTableData () {
      this.tableLoading = true
      let d = {
        page: this.page,
        pagesize: this.pageSize,
        type: 4,
        like: this.searchKey,
        timetype: this.timetype,
        starttime: this.starttime,
        endtime: this.endtime,
        isapply: this.isapply,
        isauditing: this.isauditing,
        isapprove: this.isapprove,
        ispayment: this.ispayment,
        merchantid: this.merchantid
      }
      serverApi('/Finance/accountlist', d,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.tableData = response.data.data.result
            this.counts =  response.data.data.counts
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.tableLoading = false
        },
        error => {
          console.log(error)
          this.tableLoading = false
        }
      )
    },
    goBackFinace () {
      this.$router.push({name: 'FinaceTable', original: false})
    },
    exportTable () {
      if (this.tableData.length < 1) {
        this.$Message.info('暂无数据')
        return false
      }
      this.exportLoading = true
      let d = {
        page: this.page,
        pagesize: this.pageSize,
        type: 4,
        like: this.searchKey,
        timetype: this.timetype,
        starttime: this.starttime,
        endtime: this.endtime,
        isapply: this.isapply,
        isauditing: this.isauditing,
        isapprove: this.isapprove,
        ispayment: this.ispayment,
        merchantid: this.merchantid,
        exports: 'out'
      }
      serverApi('/Finance/accountlist', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            location.href = response.data.data
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.exportLoading = false
        },
        error => {
          console.log(error)
          this.exportLoading = false
        }
      )
    },
    changePage (e) {
      this.page = e
      this.getTableData()
    },
    onChangeSize (e) {
      this.pageSize = e
      this.getTableData()
    },
    onClickReview (row) {
      this.shData = row
      console.log(row)
      let d = {
        id: row.id,
        payment: 1
      }
      this.$Modal.confirm({
        title: '提示',
        content: `到款到${row.merchantname}, 金额：￥${row.total}`,
        loading: true,
        onOk: () => {
          serverApi('/Finance/cashpay', d,
            response => {
              console.log(response)
              if (response.data.code === 0){
                this.$Notice.success({
                  title: '打款成功',
                  desc: `到款到${row.merchantname}, 金额：￥${row.total}， 已打款！`
                })
              }else{
                this.$Message.warning(response.data.msg)
              }
              this.$Modal.remove()
            },
            error => {
              this.$Modal.remove()
              this.$Message.warning(error.toString())
              console.log(error)
            }
          )
        }
      })
    }
  }
}
</script>
<style lang="less">
.tablefooter{
  padding: 0 10px;
}
.ivu-table .shouldReceive{
  // color: #2d8cf0;
  font-size: 14px;
}
.ivu-table .discount{
  // color: #f60;
  font-size: 14px;
}
.ivu-table .realReceive{
  // color: #ff9900;
  font-size: 14px;
}
.table1{
  width: 100%;
  table-layout: fixed;
  border: none;
}
.apply-fee{
  color: #f44;
  font-size: 14px;
  font-weight: 600;
}
</style>
