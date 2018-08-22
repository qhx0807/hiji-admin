<template>
  <div class="box">
    <Card :bordered="false">
      <Input v-model="searchKey" placeholder="关键字搜索..." style="width: 200px"></Input>
      <DatePicker :options="dateOptions" type="daterange" placeholder="日期范围" @on-change="onSelectDate" style="width: 220px"></DatePicker>
      <Button type="primary" :loading="tableLoading" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
      <Button type="primary" style="margin-left:8px" @click="goBackFinace" icon="ios-arrow-back">返回</Button>
      <Button type="primary" :loading="exportLoading" style="margin-left:8px; float:right" @click="exportTable" icon="md-arrow-down">导出数据</Button>
    </Card>
    <Card :bordered="false" style="margin-top:10px">
      <Table border ref="table" highlight-row :loading="tableLoading" size="small" height="600" :columns="columns" :data="tableData"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :total="counts" show-sizer show-total :page-size-opts="pageSizeOpts" :page-size="15" :current="page" @on-page-size-change="onChangeSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal v-model="shModal" width="460">
      <p slot="header" style="color:#f60;">
        <Icon type="ios-information-circle"></Icon>
        <span>提示</span>
      </p>
      <div style="">
        <p style="margin-bottom:10px">对此订单审核？</p>
        <p>订单金额: {{shData.total}} &nbsp;&nbsp;支付金额: {{shData.cash}} &nbsp;&nbsp;平台优惠: {{shData.coupon}}
          &nbsp;&nbsp;商家优惠: {{shData.merchantcoupon}}
        </p>
      </div>
      <div slot="footer">
        <Button @click="shModal = false">取消</Button>
        <Button type="error" :loading="refuseLoading" @click="onClickSH(2)">不通过</Button>
        <Button type="primary" :loading="passLoading" @click="onClickSH(1)">审核通过</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
import exportExcel from  '../../utlis/table2excel.js'
export default {
  name: 'FinaceReview',
  data () {
    return {
      searchKey: '',
      tableLoading: false,
      exportLoading: false,
      shModal: false,
      passLoading: false,
      refuseLoading: false,
      counts: 0,
      page: 1,
      pageSize: 15,
      pageSizeOpts: [10, 15, 25, 50, 70, 100, 200],
      tableData: [],
      shData: {},
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
          align: 'right'
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
        // {
        //   title: '对账状态',
        //   key: 'ischeck',
        //   minWidth: 110,
        // },
        // {
        //   title: '申请状态',
        //   key: 'isapply',
        //   minWidth: 110,
        // },
        // {
        //   title: '审核状态',
        //   key: 'isauditing',
        //   minWidth: 110,
        // },
        // {
        //   title: '打款状态',
        //   key: 'ispayment',
        //   minWidth: 110,
        // },
        {
          title: '对账状态',
          key: 'ischeck',
          width: 120,
          render: (h, params) => {
            let text = params.row.ischeck == 1 ? '已对账' : '未对账'
            let color = params.row.ischeck == 1 ? 'success' : 'warning'
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
          title: '审核状态',
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
          minWidth: 110,
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
            }, '审核')
            let ysh = h('a', {
              style: {
                color: '#19be6b'
              }
            }, '已审核')
            let refuse = h('a', {
              style: {
                color: '#ed4014'
              }
            }, '拒绝')
            if (params.row.isauditing == 0) {
              return sh
            } else if (params.row.isauditing == 1) {
              return ysh
            } else if (params.row.isauditing == 2) {
              return refuse
            } else {
              return null
            }
          }
        }
      ]
    }
  },
  created () {
    this.getTableData()
  },
  computed: {
    dateOptions () {
      return this.$store.state.dateOptions
    },
  },
  methods: {
    onClickSearch () {
      this.getTableData()
    },
    getTableData () {
      this.tableLoading = true
      let d = {
        page: this.page,
        pagesize: this.pageSize,
        type: 2
      }
      serverApi('/Finance/accountlist', d,
        response => {
          console.log(response)
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
      exportExcel(this.tableData, "data")
      this.exportLoading = false
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
      this.shModal = true
    },
    onClickSH (e) {
      if (e === 1) {
        this.passLoading = true
      } else if (e === 0) {
        this.refuseLoading = true
      }
      let d = {
        id: this.shData.id,
        auditing: e
      }
      serverApi('/Finance/auditor', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.$Message.warning(response.data.msg)
            this.shModal = false
            this.getTableData()
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.passLoading = false
          this.refuseLoading = false
        },
        error => {
          console.log(error)
          this.$Message.warning(error.toString())
          this.refuseLoading = false
          this.tableLoading = false
        }
      )
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
</style>
