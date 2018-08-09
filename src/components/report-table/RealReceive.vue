<template>
  <div class="box">
    <Card :bordered="false">
      <div class="head">
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <DatePicker :options="dateOptions" type="daterange" placeholder="日期范围" @on-change="onSelectDate" style="width: 220px"></DatePicker>
        <Button type="primary" :loading="tableLoading" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <Button type="primary" style="margin-left:8px" @click="goBackFinace" icon="chevron-left">返回</Button>
        <Button type="primary" style="margin-left:8px; float:right" @click="exportTable" icon="android-arrow-down">导出数据</Button>
      </div>
    </Card>
    <Card :bordered="false" style="margin-top:10px">
      <Table border ref="table" :loading="tableLoading" size="small" height="600" :columns="columns" :data="filterTable">
        <div slot="footer">
          <div class="tablefooter" v-show="filterTable.length > 0">
            <Row>
              <Col span="3"><span></span><span>共{{filterTable.length}}条</span></Col>
              <Col span="3"><span>微信收款：</span><span>{{wxFee}}元</span></Col>
              <Col span="3"><span>支付宝收款：</span><span>{{aliFee}}元</span></Col>
              <Col span="3"><span>合计收款：</span><span>{{totalFee}}元</span></Col>
              <Col span="3"><span>合计笔数：</span><span>{{totalSum}}条</span></Col>
              <Col span="3"><span>合计应收：</span><span>{{yingFee}}元</span></Col>
              <Col span="3"><span>合计优惠：</span><span>{{couFee}}元</span></Col>
            </Row>
          </div>
        </div>
      </Table>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { arrSearch } from '../../utlis/tools.js'
export default {
  name: 'RealReceive',
  data () {
    return {
      searchKey: '',
      tableLoading: false,
      tableData: [],
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
          title: '收款方式',
          key: 'paytype',
          minWidth: 140,
          sortable: true
        },
        {
          title: '应收金额',
          key: 'total',
          minWidth: 140,
          sortable: true,
          className: 'shouldReceive'
        },
        {
          title: '优惠金额',
          key: 'coupon',
          minWidth: 140,
          sortable: true,
          className: 'discount'
        },
        {
          title: '实收金额',
          key: 'cash',
          minWidth: 140,
          sortable: true,
          className: 'realReceive'
        },
        {
          title: '收款小计',
          key: 'num',
          minWidth: 140,
          sortable: true
        }
      ],
      starttime: '',
      endtime: '',
    }
  },
  created () {
    this.getTableData()
  },
  computed: {
    dateOptions () {
      return this.$store.state.dateOptions
    },
    wxFee () {
      let fee = 0
      this.tableData.forEach(item => {
        if (item.paytype == '微信') {
          fee += Number(item.cash)
        }
      })
      return fee.toFixed(2)
    },
    aliFee () {
      let fee = 0
      this.tableData.forEach(item => {
        if (item.paytype == '支付宝') {
          fee += Number(item.cash)
        }
      })
      return fee.toFixed(2)
    },
    totalFee () {
      return Number(this.wxFee) + Number(this.aliFee)
    },
    totalSum () {
      let num = 0
      this.tableData.forEach(item => {
        num += item.num
      })
      return num
    },
    yingFee () {
      let fee = 0
      this.tableData.forEach(item => {
        fee += Number(item.total)
      })
      return fee.toFixed(2)
    },
    couFee () {
      let fee = 0
      this.tableData.forEach(item => {
        fee += Number(item.coupon)
      })
      return fee.toFixed(2)
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
          console.log(response)
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
      this.$refs.table.exportCsv({filename: '实收.csv'})
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
