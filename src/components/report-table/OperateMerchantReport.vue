<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Form :label-width="60">
        <Row>
          <Col span="5">
            <FormItem prop="typename" label="本期" style="margin-bottom:0">
              <DatePicker type="daterange" style="width: 100%" placeholder="选择日期范围" @on-change="e => {searchObj.starttime = e[0];searchObj.endtime=e[1]}"></DatePicker>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem prop="typename" label="对比期" style="margin-bottom:0">
              <DatePicker type="daterange" style="width: 100%" placeholder="选择日期范围" @on-change="e => {searchObj.upstarttime = e[0];searchObj.upendtime=e[1]}"></DatePicker>
            </FormItem>
          </Col>
          <Col span="14">
            <FormItem prop="typename" style="margin-bottom:0">
              <Button @click="getTableData" type="primary" :loading="isloading">查询</Button>
              <Button style="margin-left:10px" @click="onClickExport" :loading="isloading">导出</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
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
import { downloadFile } from '../../utlis/tools.js'
export default {
  name: 'OperateMerchantReport',
  data () {
    return {
      tableLoading: false,
      page: 1,
      pagesize: 10,
      count: 0,
      tableData: [],
      columns: [
        {
          title: '商户',
          key: 'merchantnamed',
          minWidth: 100
        },
        {
          title: '订单数量',
          align: 'center',
          children: [
            {
              title: '本期',
              key: 'ordernumb',
              align: 'right',
              minWidth: 100
            },
            {
              title: '对比',
              key: 'ordernumd',
              align: 'right',
              minWidth: 100
            },
          ]
        },
        {
          title: '定价金额（定价之和）',
          align: 'center',
          children: [
            {
              title: '本期',
              key: 'amountb',
              align: 'right',
              minWidth: 100
            },
            {
              title: '对比期',
              key: 'amountd',
              align: 'right',
              minWidth: 100
            },
          ]
        },
        {
          title: '成交价格（实付）',
          align: 'center',
          children: [
            {
              title: '本期',
              key: 'cash_amountb',
              align: 'right',
              minWidth: 100
            },
            {
              title: '对比期',
              key: 'cash_amountd',
              align: 'right',
              minWidth: 100
            },
          ]
        },
        {
          title: '结算金额',
          align: 'center',
          children: [
            {
              title: '本期',
              key: 'settlementpriceb',
              align: 'right',
              minWidth: 100
            },
            {
              title: '对比期',
              key: 'settlementpriced',
              align: 'right',
              minWidth: 100
            },
          ]
        },
        {
          title: '平台优惠（汇总）',
          align: 'center',
          children: [
            {
              title: '本期',
              key: 'couponb',
              align: 'right',
              minWidth: 100
            },
            {
              title: '对比期',
              key: 'coupond',
              align: 'right',
              minWidth: 100
            },
          ]
        },
        {
          title: '商家优惠（汇总）',
          align: 'center',
          children: [
            {
              title: '本期',
              key: 'merchantcouponb',
              align: 'right',
              minWidth: 100
            },
            {
              title: '对比期',
              key: 'merchantcoupond',
              align: 'right',
              minWidth: 100
            },
          ]
        },
        // {
        //   title: '商品结算金额',
        //   align: 'center',
        //   children: [
        //     {
        //       title: '本期',
        //       key: 'settlementpriceb',
        //       align: 'center',
        //       width: 100
        //     },
        //     {
        //       title: '对比期',
        //       key: 'settlementpriced',
        //       align: 'center',
        //       width: 100
        //     },
        //   ]
        // },
        // {
        //   title: '邮费结算金额',
        //   align: 'center',
        //   children: [
        //     {
        //       title: '本期',
        //       key: 'settlementpostagepriceb',
        //       align: 'center',
        //       width: 100
        //     },
        //     {
        //       title: '对比期',
        //       key: 'settlementpostagepriced',
        //       align: 'center',
        //       width: 100
        //     },
        //   ]
        // },
        // {
        //   title: '优惠总和',
        //   align: 'center',
        //   children: [
        //     {
        //       title: '本期',
        //       key: 'discountb',
        //       align: 'center',
        //       width: 100
        //     },
        //     {
        //       title: '对比期',
        //       key: 'discountd',
        //       align: 'center',
        //       width: 100
        //     },
        //   ]
        // },
        // {
        //   title: '扣点金额',
        //   align: 'center',
        //   children: [
        //     {
        //       title: '本期',
        //       key: 'pointspriceb',
        //       align: 'center',
        //       width: 100
        //     },
        //     {
        //       title: '对比期',
        //       key: 'pointspriced',
        //       align: 'center',
        //       width: 100
        //     },
        //   ]
        // },
        // {
        //   title: '附加费',
        //   align: 'center',
        //   children: [
        //     {
        //       title: '本期',
        //       key: 'feeb',
        //       align: 'center',
        //       width: 100
        //     },
        //     {
        //       title: '对比期',
        //       key: 'feed',
        //       align: 'center',
        //       width: 100
        //     },
        //   ]
        // },
      ],
      isloading: false,
      searchObj: {
        starttime: '',
        endtime: '',
        upstarttime: '',
        upendtime: '',
        exports: '',
      }
    }
  },
  created () {
    // this.getTableData()
  },
  methods: {
    getTableData () {
      this.tableLoading = true
      this.isloading = true
      this.searchObj.exports = ''
      serverApi('/Reportform/sellerreportform', this.searchObj,
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.tableData = response.data.data
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
    onClickExport () {
      this.isloading = true
      this.$Message.loading({
        duration: 0,
        content: '加载中...'
      })
      this.searchObj.exports = 'out'
      serverApi('/Reportform/sellerreportform', this.searchObj,
        response => {
          this.$Message.destroy()
          this.isloading = false
          if (response.data.code === 0) {
            downloadFile(response.data.data)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.isloading = false
          this.$Message.destroy()
          console.log(error)
          this.$Message.warning('连接失败！')
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>

</style>
