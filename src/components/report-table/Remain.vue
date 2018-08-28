<template>
  <div class="box">
    <Card :bordered="false">
      <Input v-model="searchKey" placeholder="关键字搜索..." style="width: 220px"></Input>
      <!-- <Button type="primary" :loading="tableLoading" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button> -->
      <Button type="primary" style="margin-left:8px" @click="goBackFinace" icon="ios-arrow-back">返回</Button>
      <Button type="primary" style="margin-left:8px; float:right" @click="exportTable" icon="md-arrow-down">导出数据</Button>
    </Card>
    <Card :bordered="false" style="margin-top:10px">
      <Table border ref="table" :loading="tableLoading" size="small" height="600" :columns="columns" :data="filterTable">
        <!-- <div slot="footer">
          <div class="tablefooter" v-show="filterTable.length > 0">
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
        </div> -->
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
          title: '设备码',
          key: 'equipmentno',
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
          align: 'center',
          children: [
            {
              title: '收款',
              key: 'total',
              align: 'right',
              sortable: true,
              minWidth: 100
            },
            {
              title: '优惠',
              key: 'coupon',
              align: 'right',
              sortable: true,
              minWidth: 100
            }
          ]
        },
        {
          title: '已算总额 (已审核支付)',
          align: 'center',
          children: [
            {
              title: '收款',
              key: 'yjtotal',
              align: 'right',
              sortable: true,
              minWidth: 100
            },
            {
              title: '优惠',
              key: 'yjcoupon',
              align: 'right',
              sortable: true,
              minWidth: 100
            }
          ]
        },
        // {
        //   title: '本期结算金额',
        //   key: 'bqtotal',
        //   minWidth: 140,
        //   sortable: true,
        //   align: 'right'
        // },
        // {
        //   title: '前期结算金额',
        //   key: 'qqtotal',
        //   minWidth: 140,
        //   sortable: true,
        //   align: 'right'
        // },
        {
          title: '剩余结算金额',
          align: 'center',
          children: [
            {
              title: '收款',
              key: 'sstotal',
              align: 'right',
              sortable: true,
              minWidth: 100
            },
            {
              title: '优惠',
              key: 'sscoupon',
              align: 'right',
              sortable: true,
              minWidth: 100
            }
          ]
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
    }
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
            this.tableData = obj
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
