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
  name: 'OperateMerchantReportScan',
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
          fixed: 'left',
          minWidth: 130
        },
        {
          title: '交易笔数',
          align: 'center',
          children: [
            {
              title: '本期',
              key: 'ordernumb',
              align: 'right',
              minWidth: 100
            },
            {
              title: '对比期',
              key: 'ordernumd',
              align: 'right',
              minWidth: 100
            },
          ]
        },
        {
          title: '应收合计',
          align: 'center',
          children: [
            {
              title: '本期',
              key: 'totalb',
              align: 'right',
              minWidth: 100
            },
            {
              title: '对比期',
              key: 'totald',
              align: 'right',
              minWidth: 100
            },
          ]
        },
        {
          title: '实收合计',
          align: 'center',
          children: [
            {
              title: '本期',
              key: 'cashb',
              align: 'right',
              minWidth: 100
            },
            {
              title: '对比期',
              key: 'cashd',
              align: 'right',
              minWidth: 100
            },
          ]
        },
        {
          title: '平台优惠',
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
          title: '商家优惠',
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
      serverApi('/Reportform/sellercodereportform', this.searchObj,
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
      serverApi('/Reportform/sellercodereportform', this.searchObj,
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
