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
    <Modal v-model="shModal" width="1000" :styles="{top: '50px'}">
      <p slot="header" style="text-align:center">
        <span>申请单号 {{shData.applyno}}</span>
      </p>
      <div>
        <Table border ref="tableSh" highlight-row size="small" height="400" :columns="columnsSH" :data="orderData">
          <div slot="footer">
            <ul class="sta-li">
              <li>合计：</li>
              <li>支付金额：{{shStaData.cash.toFixed(2)}}元</li>
              <li>平台优惠：{{shStaData.coupon.toFixed(2)}}元</li>
              <li>订单优惠：{{shStaData.subsidy.toFixed(2)}}元</li>
              <li>商家优惠：{{shStaData.merchantcoupon.toFixed(2)}}元</li>
              <li>合计金额：{{shStaData.total.toFixed(2)}}元</li>
            </ul>
          </div>
        </Table>
      </div>
      <div slot="footer">
        <Button @click="shModal = false">取消</Button>
        <Button type="default" @click="downLoadShData">下载数据</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
import exportExcel from  '../../utlis/table2excel.js'
export default {
  name: 'FinaceTotal',
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
      orderData: [],
      columns: [
        {
          title: '#',
          width: 50,
          key: 'id'
        },
        {
          title: '商户',
          key: 'merchantname',
          width: 120,
          tooltip: true
        },
        {
          title: '申请单号',
          key: 'applyno',
          minWidth: 170,
        },
        {
          title: '设备号id',
          key: 'equipmentid',
          width: 80,
          tooltip: true
        },
        {
          title: '支付金额',
          key: 'cash',
          width: 100,
          sortable: true,
          align: 'right'
        },
        {
          title: '总金额',
          key: 'total',
          width: 100,
          sortable: true,
          align: 'right'
        },
        {
          title: '平台优惠',
          key: 'coupon',
           width: 100,
          sortable: true,
          align: 'right'
        },
        {
          title: '商户优惠',
          key: 'merchantcoupon',
          width: 100,
          sortable: true,
          align: 'right'
        },
        {
          title: '订单优惠',
          key: 'subsidy',
          width: 100,
          sortable: true,
          align: 'right'
        },
        // {
        //   title: '对账状态',
        //   key: 'ischeck',
        //   width: 120,
        //   render: (h, params) => {
        //     let text = params.row.ischeck == 1 ? '已对账' : '未对账'
        //     let color = params.row.ischeck == 1 ? 'success' : 'warning'
        //     let el = h('Tag', {
        //       props: {
        //         type: 'dot',
        //         color: color
        //       }
        //     }, text)
        //     return el
        //   }
        // },
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
          title: '收款状态',
          key: 'isreceivables',
          width: 120,
          render: (h, params) => {
            let text = params.row.isreceivables == 1 ? '已收款' : '未收款'
            let color = params.row.isreceivables == 1 ? 'success' : 'warning'
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
        // {
        //   title: '应付',
        //   key: 'mertotal',
        //   minWidth: 110,
        //   sortable: true,
        //   align: 'right'
        // },
        {
          title: '付款方式',
          key: 'paymenttype',
          minWidth: 110,
        },
        {
          title: '查看',
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
            }, '查看')
            return sh
          }
        }
      ],
      columnsSH: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '类型',
          key: 'type',
          width: 80,
        },
        {
          title: '设备号',
          key: 'equipmentno',
          width: 90,
          tooltip: true,
        },
        {
          title: '订单号',
          key: 'orderno',
          width: 140,
        },
        {
          title: '支付金额',
          key: 'cash',
          width: 100,
          align: 'right',
          sortable: true
        },
        {
          title: '平台优惠',
          key: 'coupon',
          width: 100,
          align: 'right',
          sortable: true
        },
        {
          title: '订单优惠',
          key: 'subsidy',
          width: 100,
          align: 'right',
          sortable: true
        },
        {
          title: '商家优惠',
          key: 'merchantcoupon',
          width: 100,
          align: 'right',
          sortable: true
        },
        {
          title: '实收',
          key: 'total',
          width: 100,
          align: 'right',
          sortable: true
        },
        {
          title: '支付方式',
          key: 'paytypename',
          width: 80,
        },
        {
          title: '时间',
          key: 'createtime',
          width: 140,
        },
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
    shStaData () {
      let obj = {
        cash: 0,
        coupon: 0,
        subsidy: 0,
        merchantcoupon: 0,
        total: 0
      }
      if (this.orderData.length > 0) {
        this.orderData.forEach(item => {
            obj.cash += Number(item.cash)
            obj.coupon += Number(item.coupon)
            obj.subsidy += Number(item.subsidy)
            obj.merchantcoupon += Number(item.merchantcoupon)
            obj.total += Number(item.total)
        })
      }
      return obj
    }
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
        type: 99
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
      this.$Message.loading({
        content: '数据加载中...',
        duration: 0
      })
      let d = {
        id: row.id
      }
      serverApi('/Finance/auditororderlist', d,
        response => {
          // console.log(response)
          this.$Message.destroy()
          if (response.data.code === 0){
            this.orderData = response.data.data
            this.shModal = true
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.$Message.destroy()
          this.$Message.warning(error.toString())
        }
      )

    },
    downLoadShData () {
      if (this.orderData.length < 1) {
        this.$Message.info('暂无数据')
        return false
      }
      let para = {
        filename: this.shData.merchantname + '_' + this.shData.applyno,
        original: false
      }
      this.$refs.tableSh.exportCsv(para)
    },
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
.sta-li{
  list-style: none;
  li{
    float: left;
    margin-right: 20px;
  }
}
</style>
