<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Form :label-width="80">
        <FormItem label="选择时间段" style="margin-bottom:0">
          <DatePicker type="daterange" @on-change="onSelectDate" :options="dateOptions" placeholder="选择日期" style="width: 250px"></DatePicker>
          <Button type="primary" style="margin-left:10px;" @click="onClickQuery" :loading="loading1">查询</Button>
          <Button style="margin-left:10px;" @click="onClickExport" :loading="loading2">导出数据</Button>
        </FormItem>
      </Form>
    </Card>
    <Card :bordered="false">
      <Table :height="600" border stripe :loading="loading1" size="small" :columns="columns" :data="tableData"></Table>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { downloadFile } from '../../utlis/tools.js'
export default {
  name: 'ShopStatistics',
  data () {
    return {
      loading1: false,
      loading2: false,
      starttime: '',
      endtime: '',
      columns: [
        {
          title: '时间段',
          key: 'dates',
        },
        {
          title: '订单类型',
          key: 'type',
        },
        {
          title: '数量',
          key: 'number',
        },
        {
          title: '应付',
          key: 'total',
        },
        {
          title: '实付',
          key: 'cash',
        },
        {
          title: '附加费',
          key: 'fee',
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
          title: '邮费',
          key: 'shippingamout',
        },
        {
          title: '扣点',
          key: 'pointsprice',
        },
        {
          title: '结算金额',
          key: 'settlementprice',
        }
      ],
      tableData: []
    }
  },
  created () {
    this.getAllOrderData()
  },
  computed: {
    dateOptions () {
      return this.$store.state.dateOptions
    }
  },
  methods: {
    getAllOrderData () {
      this.loading1 = true
      let d = {
        starttime: this.starttime,
        endtime: this.endtime
      }
      serverApi('/depar/statistics', d,
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.tableData = response.data.data
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.loading1 = false
        },
        error => {
          this.loading1 = false
          console.log(error)
          this.$Message.error(error.toString())
        }
      )
    },
    onSelectDate (e) {
      this.starttime = e[0]
      this.endtime = e[1]
    },
    onClickQuery () {
      if (this.starttime && this.endtime) {
        this.columns = [
          {
            title: '订单类型',
            key: 'type',
          },
          {
            title: '数量',
            key: 'number',
          },
          {
            title: '应付',
            key: 'total',
          },
          {
            title: '实付',
            key: 'cash',
          },
          {
            title: '附加费',
            key: 'fee',
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
            title: '邮费',
            key: 'shippingamout',
          },
          {
            title: '扣点',
            key: 'pointsprice',
          },
          {
            title: '结算金额',
            key: 'settlementprice',
          },
          {
            title: '订单付款金额',
            key: 'orderpay',
          },
          {
            title: '邮费结算',
            key: 'settlementpostageprice',
          },
          {
            title: '折扣率',
            key: 'discountrate',
          },
          {
            title: '同比',
            key: 'chainratio',
          },
          {
            title: '环比',
            key: 'yearonyear',
          }
        ]
      } else {
        this.columns = [
          {
            title: '时间段',
            key: 'dates',
          },
          {
            title: '订单类型',
            key: 'type',
          },
          {
            title: '数量',
            key: 'number',
          },
          {
            title: '应付',
            key: 'total',
          },
          {
            title: '实付',
            key: 'cash',
          },
          {
            title: '附加费',
            key: 'fee',
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
            title: '邮费',
            key: 'shippingamout',
          },
          {
            title: '扣点',
            key: 'pointsprice',
          },
          {
            title: '结算金额',
            key: 'settlementprice',
          }
        ]
      }
      this.getAllOrderData()
    },
    onClickExport () {
      this.$Message.loading({
        duration: 0,
        content: '正在生成Excel...'
      })
      this.loading2 = true
      let d = {
        starttime: this.starttime,
        endtime: this.endtime,
        exports: 'out'
      }
      serverApi('/depar/statistics', d,
        response => {
          this.$Message.destroy()
          this.loading2 = false
          if (response.data.code === 0) {
            if (typeof(response.data.data) === 'string') {
              downloadFile(response.data.data)
            } else {
              this.$Message.warning('返回数据格式不正确！')
            }
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.destroy()
          console.log(error)
          this.loading2 = false
          this.$Message.warning('连接失败！')
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>

</style>
