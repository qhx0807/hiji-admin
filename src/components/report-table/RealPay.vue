<template>
  <div class="box">
    <Card :bordered="false">
      <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
      <DatePicker :options="dateOptions" type="daterange" placeholder="日期范围" @on-change="onSelectDate" style="width: 220px"></DatePicker>
      <Button type="primary" :loading="tableLoading" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
      <Button type="primary" style="margin-left:8px" @click="goBackFinace" icon="ios-arrow-back">返回</Button>
      <Button type="primary" style="margin-left:8px; float:right" @click="exportTable" icon="md-arrow-down">导出数据</Button>
    </Card>
    <Card :bordered="false" style="margin-top:10px">
      <Table border ref="table" :loading="tableLoading" size="small" height="520" :columns="columns" :data="filterTable">
        <div slot="footer">
          <div class="tablefooter" v-show="filterTable.length > 0">
            <Row>
              <Col span="6"><span></span><span>共{{filterTable.length}}条</span></Col>
              <Col span="6"><span>代付金额合计：</span><span>{{sumData.dfFee.toFixed(2)}}元</span></Col>
              <Col span="6"><span>平台补助合计：</span><span>{{sumData.bzFee.toFixed(2)}}元</span></Col>
              <Col span="6"><span>结算金额合计：</span><span>{{sumData.jsFee.toFixed(2)}}元</span></Col>
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
          minWidth: 120
        },
        {
          title: '商户名称',
          key: 'merchantname',
          minWidth: 140,
          sortable: true
        },
        {
          title: '付款日期',
          key: 'totime',
          minWidth: 120,
          sortable: true
        },
        {
          title: '账单时间',
          key: 'billdate',
          minWidth: 120,
          sortable: true
        },
        {
          title: '付款方式',
          key: 'merchantcode',
          minWidth: 120,
          sortable: true,
          render: (h, params) => {
            return h('div', {}, '支付宝')
          }
        },
        {
          title: '代付金额',
          key: 'cash',
          minWidth: 120,
          sortable: true,
        },
        {
          title: '平台补贴',
          key: 'coupon',
          minWidth: 120,
          sortable: true,
        },
        {
          title: '结算金额',
          key: 'total',
          minWidth: 120,
          sortable: true,
          align: 'right'
        },
        // {
        //   title: '明细',
        //   key: 'merchantcode',
        //   width: 100,
        //   fixed: 'right',
        //   align: 'center',
        //   render: (h, params) => {
        //     return h('a', {
        //       on: {
        //         click: () => {
        //           this.onClickSeemx(params.row)
        //         }
        //       }
        //     }, '查看明细')
        //   }
        // }
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
    },
    sumData () {
      let obj = {
        bzFee: 0,
        dfFee: 0,
        jsFee: 0
      }
      this.filterTable.forEach(item => {
        obj.bzFee += Number(item.coupon)
        obj.dfFee += Number(item.cash)
        obj.jsFee += Number(item.total)
      })
      return obj
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
      this.$refs.table.exportCsv({filename: '实付.csv', original: false})
    },
    onClickSeemx (row) {
      console.log(row)
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
