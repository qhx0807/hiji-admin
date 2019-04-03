<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Form :label-width="80">
        <Row>
          <Col span="5">
            <FormItem prop="typename" label="开始时间" style="margin-bottom:0">
              <DatePicker type="date" style="width: 100%" placeholder="选择日期" @on-change="e => searchObj.starttime = e"></DatePicker>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem prop="typename" label="结束时间" style="margin-bottom:0">
              <DatePicker type="date" style="width: 100%" placeholder="选择日期" @on-change="e => searchObj.endtime = e"></DatePicker>
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
        <Table border size="small" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
      </div>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer></Page>
      </div>
      <div style="clear:both"></div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { downloadFile } from '../../utlis/tools.js'
export default {
  name: 'ShopGoodsCxReport',
  data () {
    return {
      tableLoading: false,
      page: 1,
      pagesize: 10,
      count: 0,
      tableData: [],
      columns: [
        {
          title: '商户名称',
          key: 'merchantname',
        },
        {
          title: '订单类型',
          key: 'type',
        },
        {
          title: '商品',
          key: 'goodsname',
          width: 200
        },
        {
          title: '市场价',
          key: 'marketprice',
        },
        {
          title: '定价',
          key: 'goodsprice',
        },
        {
          title: '销售价',
          key: 'buyprice',
        },
        {
          title: '订单实付价',
          key: 'cash_amount',
        },
        {
          title: '平台优惠',
          key: 'coupon',
        },
        {
          title: '商户优惠',
          key: 'merchantcoupon',
        },
        {
          title: '抵用券金额',
          key: 'ordercoupon',
        },
        {
          title: '抵用券名称',
          key: 'cardname',
        },
        {
          title: '购买数量',
          key: 'goodsnum',
        },
        {
          title: '下单时间',
          key: 'createtime',
          width: 150
        },
        {
          title: '折扣率',
          key: 'discount',
        },
      ],
      isloading: false,
      searchObj: {
        starttime: '',
        endtime: '',
        exports: '',
        page: 1,
        pagesize: 10
      }
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.tableLoading = true
      this.isloading = true
      this.searchObj.exports = ''
      serverApi('/goods/ispidreportform', this.searchObj,
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.count = response.data.data.counts
            this.tableData = response.data.data.result
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
      this.searchObj.page = e
      this.getTableData()
    },
    onClickExport () {
      this.isloading = true
      this.$Message.loading({
        duration: 0,
        content: '加载中...'
      })
      this.searchObj.exports = 'out'
      serverApi('/goods/ispidreportform', this.searchObj,
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
