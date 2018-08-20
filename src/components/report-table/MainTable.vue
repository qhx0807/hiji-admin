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
  </div>
</template>
<script>
import serverApi from '../../axios'
import exportExcel from  '../../utlis/table2excel.js'
export default {
  name: 'MainTable',
  data () {
    return {
      searchKey: '',
      tableLoading: false,
      exportLoading: false,
      counts: 0,
      page: 1,
      pageSize: 15,
      pageSizeOpts: [15, 25, 50, 70, 100, 200],
      tableData: [],
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
          title: '设备号',
          key: 'equipmentno',
          width: 90,
          tooltip: true
        },
        {
          title: '订单号',
          key: 'orderno',
          width: 151
        },
        {
          title: '支付流水',
          key: 'transaction_id',
          minWidth: 140,
        },
        {
          title: '支付金额',
          key: 'cash',
          width: 110,
          sortable: true,
          align: 'right'
        },
        {
          title: '订单金额',
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
          title: '订单时间',
          key: 'createtime',
          width: 140,
        },
        {
          title: '对账状态',
          key: 'ischeck',
          minWidth: 110,
        },
        {
          title: '申请状态',
          key: 'isapply',
          minWidth: 110,
        },
        {
          title: '审核状态',
          key: 'isauditing',
          minWidth: 110,
        },
        {
          title: '打款状态',
          key: 'ispayment',
          minWidth: 110,
        },
        {
          title: '扣点',
          key: 'points',
          minWidth: 110,
        },
        {
          title: '应付',
          key: 'mertotal',
          minWidth: 110,
          sortable: true,
          align: 'right'
        },
        {
          title: '付款方式',
          key: 'paymenttype',
          minWidth: 110,
        },
        {
          title: '申请单号',
          key: 'applyno',
          minWidth: 140,
        },
        {
          title: '收款状态',
          key: 'isreceivables',
          minWidth: 110,
        },
        {
          title: '审核',
          key: 'isreceivables',
          fixed: 'right',
          width: 80,
          align: 'center',
          render: (h, params) => {
            let text = '审核'
            return h('a', {
              on: {
                click: () => {
                  this.onClickReview(params.row)
                }
              }
            }, text)
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
      }
      serverApi('/Finance/orderlist', d,
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
      // this.$refs.table.exportCsv({filename: '结余.csv'})
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
      console.log(row)
      this.$Message.info('建设中...')
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
