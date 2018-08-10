<template>
  <div class="box">
    <Card :bordered="false">
      <div class="head">
        <Input v-model="searchKey" placeholder="关键字搜索..." style="width: 220px"></Input>
        <!-- <Button type="primary" :loading="tableLoading" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button> -->
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
            <table class="table">
              <tbody>
                <tr>
                  <td width="48">{{filterTable.length}}</td>
                  <td></td>
                  <td></td>
                  <td style="text-align:right;padding-right:16px">{{shouldFee}}</td>
                  <td style="text-align:right;padding-right:16px">{{bqFee}}</td>
                  <td style="text-align:right;padding-right:16px">{{qqFee}}</td>
                  <td style="text-align:right;padding-right:16px">{{syFee}}</td>
                </tr>
              </tbody>
            </table>
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
  name: 'Remain',
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
          key: 'merchantname',
          minWidth: 140,
          sortable: true
        },
        {
          title: '应结算总额',
          key: 't_total',
          minWidth: 140,
          sortable: true,
          align: 'right'
        },
        {
          title: '本期结算金额',
          key: 'bqtotal',
          minWidth: 140,
          sortable: true,
          align: 'right'
        },
        {
          title: '前期结算金额',
          key: 'qqtotal',
          minWidth: 140,
          sortable: true,
          align: 'right'
        },
        {
          title: '剩余结算金额',
          key: 'sltotal',
          minWidth: 140,
          sortable: true,
          align: 'right'
        }
      ]
    }
  },
  created () {
    this.getTableData()
  },
  computed: {
    filterTable () {
      return arrSearch(this.tableData, this.searchKey)
    },
    shouldFee () {
      let fee = 0
      this.filterTable.forEach(item => {
        fee += Number(item.t_total)
      })
      return fee.toFixed(2)
    },
    bqFee () {
      let fee = 0
      this.filterTable.forEach(item => {
        fee += Number(item.bqtotal)
      })
      return fee.toFixed(2)
    },
    qqFee () {
      let fee = 0
      this.filterTable.forEach(item => {
        fee += Number(item.qqtotal)
      })
      return fee.toFixed(2)
    },
    syFee () {
      let fee = 0
      this.filterTable.forEach(item => {
        fee += Number(item.sltotal)
      })
      return fee.toFixed(2)
    },
  },
  methods: {
    onClickSearch () {
      this.getTableData()
    },
    getTableData () {
      this.tableLoading = true
      serverApi('/Finance/settlement', {},
        response => {
          // console.log(response)
          let arr = []
          if (response.data.code === 0){
            let obj = response.data.data
            let arr = []
            for (const key in obj) {
              let arritem = {
                merchantname: obj[key].merchantname,
                merchantcode: obj[key].merchantcode,
                merchantcode: obj[key].merchantcode,
                t_total: (Number(obj[key].sltotal) + Number(obj[key].bqtotal) + Number(obj[key].qqtotal)).toFixed(2),
                sltotal: obj[key].sltotal,
                bqtotal: obj[key].bqtotal,
                qqtotal: obj[key].qqtotal
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
      this.$router.push({name: 'FinaceTable', original: false})
    },
    exportTable () {
      if (this.filterTable.length < 1) {
        this.$Message.info('暂无数据')
        return false
      }
      this.$refs.table.exportCsv({filename: '结余.csv'})
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
