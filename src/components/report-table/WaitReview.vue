<template>
  <div class="box">
    <Card :bordered="false">
      <div class="head">
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <DatePicker :options="dateOptions" type="daterange" placeholder="日期范围" @on-change="onSelectDate" style="width: 220px"></DatePicker>
        <Button type="primary" :loading="tableLoading" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <Button type="primary" style="margin-left:8px" @click="goBackFinace" icon="ios-arrow-back">返回</Button>
        <Button type="primary" style="margin-left:8px; float:right" @click="exportTable" icon="md-arrow-down">导出数据</Button>
      </div>
    </Card>
    <Card :bordered="false" style="margin-top:10px">
      <Table border ref="table" :loading="tableLoading" size="small" height="600" :columns="columns" :data="filterTable">
        <div slot="footer">
          <div class="tablefooter" v-show="filterTable.length > 0">
            <Row>
              <Col span="4"><span></span><span>共{{filterTable.length}}条</span></Col>
              <Col span="4"><span>微信收款：</span><span>{{wxFee}}元</span></Col>
              <Col span="4"><span>支付宝收款：</span><span>{{aliFee}}元</span></Col>
              <Col span="4"><span>合计收款：</span><span>{{totalFee}}元</span></Col>
              <Col span="4"><span>合计笔数：</span><span>{{totalSum}}条</span></Col>
            </Row>
          </div>
        </div>
      </Table>
    </Card>

    <Modal v-model="seeModal" width="1050" :styles="{top: '40px'}">
      <p slot="header" style="text-align:center">
        <span>详细流水</span>
      </p>
      <Table border ref="seeTable" :loading="seeTableLoading" size="small" height="500" :columns="seeColumns" :data="seeTableData"></Table>
      <div slot="footer" style="text-align:center">
        <Button   @click="seeModal = false">关闭</Button>
        <Button type="primary" @click="downLoadData">下载数据</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { arrSearch } from '../../utlis/tools.js'
export default {
  name: 'WaitReview',
  data () {
    return {
      searchKey: '',
      tableLoading: false,
      seeTableLoading: false,
      seeModal: false,
      tableData: [],
      seeTableData: [],
      seeColumns: [
        {
          type: 'index',
          width: 60
        },
         {
          title: '商户名称',
          key: 'merchanname',
          minWidth: 120
        },
        {
          title: '支付时间',
          key: 'paytime',
          minWidth: 140
        },
        {
          title: '支付方式',
          key: 'paytype',
          minWidth: 90
        },
        {
          title: '应收',
          key: 'total',
          minWidth: 80,
          sortable: true
        },
        {
          title: '实收',
          key: 'cash',
          minWidth: 80,
          sortable: true
        },
        {
          title: '优惠',
          key: 'coupon',
          minWidth: 80,
          sortable: true
        },
        {
          title: '流水号',
          key: 'transaction_id',
          minWidth: 150
        }
      ],
      columns: [
        {
          type: 'index',
          width: 80
        },
        {
          title: '商户编码',
          key: 'merchantcode',
          minWidth: 140
        },
        {
          title: '商户名称',
          key: 'merchanname',
          minWidth: 140,
          sortable: true
        },
        {
          title: '收款日期',
          key: 'paytime',
          minWidth: 140,
          sortable: true
        },
        {
          title: '微信收款',
          key: 'wxcash',
          minWidth: 140,
          sortable: true,
          align: 'right',
          render: (h, params) => {
            let fee = params.row.wxcash ? Number(params.row.wxcash).toFixed(2) : '0.00'
            return h('div', {}, fee)
          }

        },
        {
          title: '支付宝收款',
          key: 'alicash',
          minWidth: 140,
          align: 'right',
          sortable: true,
          render: (h, params) => {
            let fee = params.row.alicash ? Number(params.row.alicash).toFixed(2) : '0.00'
            return h('div', {}, fee)
          }
        },
        // {
        //   title: '应收金额',
        //   key: 'total',
        //   minWidth: 140,
        //   sortable: true,
        //   className: 'shouldReceive'
        // },
        // {
        //   title: '优惠金额',
        //   key: 'coupon',
        //   minWidth: 140,
        //   sortable: true,
        //   className: 'discount'
        // },
        {
          title: '实收合计',
          key: 'cash',
          minWidth: 140,
          align: 'right',
          sortable: true,
        },
        {
          title: '收款小计',
          key: 'num',
          minWidth: 140,
          align: 'right',
          sortable: true
        },
        {
          title: '明细',
          key: 'merchantcode',
          width: 90,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            return h('a', {
              on: {
                click: (e) => {
                  this.onClickSeemx(params.row)
                }
              }
            }, '查看流水')
          }
        }
      ],
      starttime: '',
      endtime: '',
    }
  },
  created () {
    // this.getTableData()
  },
  computed: {
    dateOptions () {
      return this.$store.state.dateOptions
    },
    wxFee () {
      let fee = 0
      this.tableData.forEach(item => {
        fee += Number(item.wxcash)
      })
      return fee.toFixed(2)
    },
    aliFee () {
      let fee = 0
      this.tableData.forEach(item => {
        fee += Number(item.alicash)
      })
      return fee.toFixed(2)
    },
    totalFee () {
      return (Number(this.wxFee) + Number(this.aliFee)).toFixed(2)
    },
    totalSum () {
      let num = 0
      this.tableData.forEach(item => {
        num += item.num
      })
      return num
    },
    filterTable () {
      return arrSearch(this.tableData, this.searchKey)
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
    getTableData () {
      let d = {
        starttime: this.starttime,
        endtime: this.endtime
      }
      this.tableLoading = true
      serverApi('/Finance/index', d,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.tableData = response.data.data
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
      this.$router.push({name: 'FinaceTable'})
    },
    exportTable () {
      if (this.filterTable.length < 1) {
        this.$Message.info('暂无数据')
        return false
      }
      this.$refs.table.exportCsv({filename: '实收.csv', original: false})
    },
    onClickSeemx (row) {
      let d = {
        paytime: row.paytime,
        merchantcode: row.merchantcode
      }
      this.$Message.loading({
        content: '数据加载中...',
        duration: 0
      })
      serverApi('/Finance/index', d,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.seeTableData = response.data.data
            this.seeModal = true
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.$Message.destroy()
        },
        error => {
          console.log(error)
          this.$Message.destroy()
        }
      )
    },
    downLoadData () {
      if (this.seeTableData.length < 1) {
        this.$Message.info('暂无数据')
        return false
      }
      let name = this.seeTableData[0].merchanname + ' ' + this.seeTableData[0].paytime.substring(0,10) + '流水'
      this.$refs.seeTable.exportCsv({filename: name+'.csv', original: false})
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
</style>
