<template>
  <div class="box">
    <Card :bordered="false" class="mb10">支付满减活动数据报表</Card>
    <Card :bordered="false">
      <div class="table-box">
        <Table height="600" border size="small" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
      </div>
      <!-- <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer></Page>
      </div>
      <div style="clear:both"></div> -->
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'PayDiscountReport',
  data () {
    return {
      tableLoading: false,
      page: 1,
      pagesize: 10,
      count: 0,
      tableData: [],
      columns: [
        // {
        //   title: '#',
        //   key: 'id',
        //   width: 60
        // },
        {
          title: '商户名称',
          key: 'merchantname',
        },
        {
          title: '交易笔数',
          key: 'num',
        },
        {
          title: '实付合计',
          key: 'cash',
        },
        {
          title: '应收合计',
          key: 'total',
        },
        {
          title: '优惠合计',
          key: 'coupon',
        },
        {
          title: '折扣率',
          key: 'discount',
        },
      ]
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.tableLoading = true
      let d = {
        page: this.page,
        pagesize: this.pagesize,
      }
      serverApi('/Paymentactive/reportform', d,
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.tableData = response.data.data
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.tableLoading = false
        },
        error => {
          console.log(error)
          this.tableLoading = false
          this.$Message.error(error.toString())
        }
      )
    },
    changePage (e) {
      this.page = e
      this.getTableData()
    },
  }
}
</script>
<style lang="less" scoped>

</style>
