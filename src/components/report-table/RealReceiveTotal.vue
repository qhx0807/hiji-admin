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
      <Table border ref="table" :loading="tableLoading" size="small" height="600" :columns="columns" :data="filterTable">
        <div slot="footer">
          <div class="tablefooter" v-show="filterTable.length > 0">
            <ul class="sta-ul">
              <li><span>共{{filterTable.length}}条</span></li>
              <li><span>本期收款：</span><span>{{hejiData.cash}}元</span></li>
              <li><span>前期收款：</span><span>{{hejiData.qqcash}}元</span></li>
              <li><span>收款合计：</span><span>{{hejiData.t_cash}}元</span></li>
              <li><span>本期优惠：</span><span>{{hejiData.coupon}}元</span></li>
              <li><span>前期优惠：</span><span>{{hejiData.qqcoupon}}元</span></li>
              <li><span>优惠合计：</span><span>{{hejiData.t_coupon}}元</span></li>
              <li><span>本期补贴：</span><span>{{hejiData.subsidy}}元</span></li>
              <li><span>前期补贴：</span><span>{{hejiData.qqsubsidy}}元</span></li>
              <li><span>补贴合计：</span><span>{{hejiData.t_subsidy}}元</span></li>
              <li><span>应结算合计：</span><span>{{hejiData.alltotal}}元</span></li>
            </ul>
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
  name: 'RealReceiveTotal',
  data () {
    return {
      searchKey: '',
      tableLoading: false,
      tableData: [],
      hejiData: {},
      columns: [
        {
          type: 'index',
          width: 60
        },
        {
          title: '商户编码',
          key: 'merchantcode',
          width: 120
        },
        {
          title: '商户名称',
          key: 'merchanname',
          minWidth: 140,
          sortable: true
        },
        {
          title: '本期收款小计',
          key: 'bqcash',
          minWidth: 130,
          sortable: true,
          align: 'right'
        },
        {
          title: '前期收款小计',
          key: 'qqcash',
          minWidth: 130,
          sortable: true,
          align: 'right'
        },
        {
          title: '收款合计',
          key: 't_cash',
          minWidth: 120,
          sortable: true,
          align: 'right'
        },
        {
          title: '本期优惠',
          key: 'bqcoupon',
          minWidth: 100,
          sortable: true,
          align: 'right'
        },
        {
          title: '前期优惠',
          key: 'qqcoupon',
          minWidth: 100,
          sortable: true,
          align: 'right'
        },
        {
          title: '优惠合计',
          key: 't_coupon',
          minWidth: 100,
          sortable: true,
          align: 'right'
        },
        {
          title: '本期补贴',
          key: 'bqsubsidy',
          minWidth: 100,
          sortable: true,
          align: 'right'
        },
        {
          title: '前期补贴',
          key: 'qqsubsidy',
          minWidth: 100,
          sortable: true,
          align: 'right'
        },
        {
          title: '补贴合计',
          key: 't_subsidy',
          minWidth: 100,
          sortable: true,
          align: 'right'
        },
        {
          title: '应结算总额',
          key: 'alltotal',
          minWidth: 120,
          fixed: 'right',
          align: 'right',
          sortable: true
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
      serverApi('/Finance/receiptstotal', d,
        response => {
          console.log(response)
          let arr = []
          if (response.data.code === 0){
            this.hejiData = response.data.data.heji
            let obj = response.data.data.result
            for (let key in obj) {
              let arritem =  {
                merchantcode: obj[key].merchantcode,
                merchanname: obj[key].merchanname,
                qqcash: obj[key].qqcash,
                qqtotal: obj[key].qqtotal,
                qqsubsidy: obj[key].qqsubsidy,
                qqcoupon: obj[key].qqcoupon,
                bqcash: obj[key].cash,
                bqtotal: obj[key].total,
                bqcoupon: obj[key].coupon,
                bqsubsidy: obj[key].subsidy,
                t_cash: obj[key].t_cash,
                t_subsidy: obj[key].t_subsidy,
                t_coupon: obj[key].t_coupon,
                alltotal: obj[key].alltotal
              }
              arr.push(arritem)
            }
            this.tableData = arr
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
      this.$refs.table.exportCsv({filename: '实收汇总.csv', original: false})
    }
  }
}
</script>
<style lang="less">
.tablefooter{
  padding: 0 10px;
  overflow: auto;
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
.sta-ul{
  list-style: none;
  li{
    float: left;
    margin-right: 15px;
  }
}
</style>
