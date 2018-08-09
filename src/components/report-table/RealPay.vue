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
            <!-- <Row>
              <Col span="3"><span></span><span>共{{filterTable.length}}条</span></Col>
              <Col span="3"><span>微信收款：</span><span>{{wxFee}}元</span></Col>
              <Col span="3"><span>支付宝收款：</span><span>{{aliFee}}元</span></Col>
              <Col span="3"><span>合计收款：</span><span>{{totalFee}}元</span></Col>
              <Col span="3"><span>合计笔数：</span><span>{{totalSum}}条</span></Col>
              <Col span="3"><span>合计应收：</span><span>{{yingFee}}元</span></Col>
              <Col span="3"><span>合计优惠：</span><span>{{couFee}}元</span></Col>
            </Row> -->
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
  name: 'RealPay',
  data () {
    return {
      searchKey: '',
      tableLoading: false,
      tableData: [],
      columns: [
        {
          type: 'index',
          width: 60
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
          title: '付款日期',
          key: 'paytime',
          minWidth: 140,
          sortable: true
        },
        {
          title: '账单时间',
          key: 'paytype',
          minWidth: 140,
          sortable: true
        },
        {
          title: '付款方式',
          key: 'paytype',
          minWidth: 120,
          sortable: true,
        },
        {
          title: '代付金额',
          key: 'coupon',
          minWidth: 140,
          sortable: true,
        },
        {
          title: '平台补贴',
          key: 'cash',
          minWidth: 140,
          sortable: true,
        },
        {
          title: '结算金额',
          key: 'num',
          width: 120,
          sortable: true,
          fixed: 'right',
          align: 'right'
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
      serverApi('/Finance/outofpocket', d,
        response => {
          console.log(response)
          let arr = []
          if (response.data.code === 0){
            let obj = response.data.data
            for (let key in obj) {
              console.log(obj[key])
              let arritem =  {
                merchantcode: obj[key].qqmerchntotal.merchantcode,
                merchanname: obj[key].qqmerchntotal.merchanname,
                qqcash: obj[key].qqmerchntotal.cash,
                qqtotal: obj[key].qqmerchntotal.total,
                qqsubsidy: obj[key].qqmerchntotal.subsidy,
                qqcoupon: obj[key].qqmerchntotal.coupon,
                bqcash: obj[key].bqmerchntotal.cash,
                bqtotal: obj[key].bqmerchntotal.total,
                bqsubsidy: obj[key].bqmerchntotal.subsidy,
                bqcoupon: obj[key].bqmerchntotal.coupon
              }
            }
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
      this.$refs.table.exportCsv({filename: '实付.csv'})
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
