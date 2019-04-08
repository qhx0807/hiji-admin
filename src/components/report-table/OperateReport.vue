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
  name: 'OperateReport',
  data () {
    return {
      tableLoading: false,
      page: 1,
      pagesize: 10,
      count: 0,
      tableData: [],
      columns: [
        {
          title: '品类',
          key: 'typeb',
          width: 100
        },
        {
          title: '订单数量',
          align: 'center',
          children: [
            {
              title: '本期',
              key: 'numberb',
              align: 'center',
              width: 100
            },
            {
              title: '对比',
              key: 'numberd',
              align: 'center',
              width: 100
            },
          ]
        },
        {
          title: '销售金额',
          align: 'center',
          children: [
            {
              title: '本期',
              key: 'totalb',
              align: 'center',
              width: 100
            },
            {
              title: '对比期',
              key: 'totald',
              align: 'center',
              width: 100
            },
          ]
        },
        {
          title: '订单付款金额',
          align: 'center',
          children: [
            {
              title: '本期',
              key: 'cashb',
              align: 'center',
              width: 100
            },
            {
              title: '对比期',
              key: 'cashd',
              align: 'center',
              width: 100
            },
          ]
        },
        {
          title: '邮费付款金额',
          align: 'center',
          children: [
            {
              title: '本期',
              key: 'shippingamoutb',
              align: 'center',
              width: 100
            },
            {
              title: '对比期',
              key: 'shippingamoutd',
              align: 'center',
              width: 100
            },
          ]
        },
        {
          title: '平台优惠金额',
          align: 'center',
          children: [
            {
              title: '本期',
              key: 'couponb',
              align: 'center',
              width: 100
            },
            {
              title: '对比期',
              key: 'coupond',
              align: 'center',
              width: 100
            },
          ]
        },
        {
          title: '商家优惠金额',
          align: 'center',
          children: [
            {
              title: '本期',
              key: 'merchantcouponb',
              align: 'center',
              width: 100
            },
            {
              title: '对比期',
              key: 'merchantcoupond',
              align: 'center',
              width: 100
            },
          ]
        },
        {
          title: '商品结算金额',
          align: 'center',
          children: [
            {
              title: '本期',
              key: 'settlementpriceb',
              align: 'center',
              width: 100
            },
            {
              title: '对比期',
              key: 'settlementpriced',
              align: 'center',
              width: 100
            },
          ]
        },
        {
          title: '邮费结算金额',
          align: 'center',
          children: [
            {
              title: '本期',
              key: 'settlementpostagepriceb',
              align: 'center',
              width: 100
            },
            {
              title: '对比期',
              key: 'settlementpostagepriced',
              align: 'center',
              width: 100
            },
          ]
        },
        {
          title: '优惠总和',
          align: 'center',
          children: [
            {
              title: '本期',
              key: 'discountb',
              align: 'center',
              width: 100
            },
            {
              title: '对比期',
              key: 'discountd',
              align: 'center',
              width: 100
            },
          ]
        },
        {
          title: '扣点金额',
          align: 'center',
          children: [
            {
              title: '本期',
              key: 'pointspriceb',
              align: 'center',
              width: 100
            },
            {
              title: '对比期',
              key: 'pointspriced',
              align: 'center',
              width: 100
            },
          ]
        },
        {
          title: '附加费',
          align: 'center',
          children: [
            {
              title: '本期',
              key: 'feeb',
              align: 'center',
              width: 100
            },
            {
              title: '对比期',
              key: 'feed',
              align: 'center',
              width: 100
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
      serverApi('/Reportform/orderreportform', this.searchObj,
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.tableData = response.data.data
            let obj = {
              "numberb":0,
              "numberd":0,
              "totalb":0,
              "totald":0,
              "cashb":0,
              "cashd":0,
              "shippingamoutb":0,
              "shippingamoutd":0,
              "couponb":0,
              "coupond":0,
              "merchantcouponb":0,
              "merchantcoupond":0,
              "settlementpriceb":0,
              "settlementpriced":0,
              "settlementpostagepriceb":0,
              "settlementpostagepriced":0,
              "discountb":0,
              "discountd":0,
              "pointspriceb":0,
              "pointspriced":0,
              "feeb":0,
              "feed":0
            }
            response.data.data.forEach(item => {
              Object.keys(obj).forEach(k => {
                obj[k] += Number(item[k])
              })
            })
            Object.keys(obj).forEach(k => {
              obj[k] = obj[k].toFixed(2)
            })
            obj.typeb = '合计'
            this.tableData.push(obj)
            console.log(obj)
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
      serverApi('/Reportform/orderreportform', this.searchObj,
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
