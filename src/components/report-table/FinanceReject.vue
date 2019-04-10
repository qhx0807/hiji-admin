<template>
  <div class="box">
    <Card :bordered="false">
      <div class="table-box">
        <Table border size="small" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
      </div>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer></Page>
      </div>
      <div style="clear:both"></div>
    </Card>
    <Modal v-model="shModal" width="1000" :styles="{top: '50px'}">
      <p slot="header" style="text-align:center">
        <span>申请单号 {{shData.applyno}}</span>
      </p>
      <div>
        <Table border ref="tableSh" highlight-row size="small" height="400" :columns="columnsSH" :data="orderData"></Table>
      </div>
      <div slot="footer">
        <Button @click="shModal = false">关闭</Button>
        <Button type="default" @click="downLoadShData">下载数据</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'FinanceReject',
  data () {
    return {
      tableLoading: false,
      page: 1,
      pagesize: 10,
      count: 0,
      tableData: [],
      columns: [
        {
          title: '#',
          key: 'id',
          width: 80
        },
        {
          title: '商户',
          key: 'merchantname',
        },
        {
          title: '申请时间',
          key: 'applytime',
          width: 130
        },
        {
          title: '申请单号',
          key: 'applyno',
          width: 160
        },
        {
          title: '总金额',
          key: 'total',
          align: 'right'
        },
        {
          title: '实付金额',
          key: 'cash',
          align: 'right'
        },
        {
          title: '平台优惠',
          key: 'coupon',
          align: 'right'
        },
        {
          title: '补贴金额',
          key: 'subsidy',
          align: 'right'
        },
        {
          title: '商户优惠',
          key: 'merchantcoupon',
          align: 'right'
        },
        {
          title: '扣点金额',
          key: 'point',
          align: 'right'
        },
        {
          title: '驳回时间',
          key: 'rejecttime',
          width: 130
        },
        {
          title: '驳回时间',
          key: 'rejecttime',
          width: 130
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
          width: 90,
        },
        // {
        //   title: '设备号',
        //   key: 'equipmentno',
        //   width: 90,
        //   tooltip: true,
        // },
        {
          title: '订单号',
          key: 'orderno',
          width: 140,
        },
        {
          title: '流水号',
          key: 'transaction_id',
          width: 140,
        },
        {
          title: '支付金额',
          key: 'cash',
          width: 110,
          align: 'right',
          sortable: true
        },
        {
          title: '平台优惠',
          key: 'coupon',
          width: 110,
          align: 'right',
          sortable: true
        },
        {
          title: '订单优惠',
          key: 'subsidy',
          width: 110,
          align: 'right',
          sortable: true
        },
        {
          title: '商家优惠',
          key: 'merchantcoupon',
          width: 110,
          align: 'right',
          sortable: true
        },
        {
          title: '扣点',
          key: 'pointsprice',
          width: 100,
          align: 'right',
          sortable: true
        },
        {
          title: '应收',
          key: 'total',
          width: 100,
          align: 'right',
          sortable: true
        },
        {
          title: '邮费定价',
          key: 'postagefee',
          width: 100,
          align: 'right',
          sortable: true
        },
        {
          title: '邮费扣率',
          key: 'postageponit',
          width: 100,
          align: 'right',
          sortable: true
        },
        {
          title: '邮费结算',
          key: 'settlementpostagefee',
          width: 100,
          align: 'right',
          sortable: true
        },
        {
          title: '支付',
          key: 'paytypename',
          width: 80,
        },
        {
          title: '时间',
          key: 'createtime',
          width: 150,
        },
      ],
      shData: {},
      isloading: false,
      orderData: [],
      shModal: false
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.tableLoading = true
      this.isloading = true
      let d = {
        page: this.page,
        pagesize: this.pagesize
      }
      serverApi('/finance/rejectlist', d,
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.tableData = response.data.data.result
            this.count = response.data.data.counts
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.tableLoading = false
          this.isloading = false
        },
        error => {
          console.log(error)
          this.tableLoading = false
          this.isloading = false
          this.$Message.error(error.toString())
        }
      )
    },
    changePage (e) {
      this.page = e
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
<style lang="less" scoped>

</style>
