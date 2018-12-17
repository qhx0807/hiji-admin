<template>
  <div class="box">
    <Card :bordered="false">
      <div class="head">
        <Input v-model="searchKey" @on-enter="getTableData" placeholder="搜索..." style="width: 200px"></Input>
        <Select v-model="ordertype" style="width:210px">
          <Option v-for="(item, index) in orderTypeArr" :key="index" :value="item.value">{{item.label}}</Option>
        </Select>
        <Select v-model="ispay" style="width:190px">
          <Option value="">全部</Option>
          <Option value="1">已支付</Option>
          <Option value="0">未支付</Option>
        </Select>
        <DatePicker :options="dateOptions" type="daterange" placeholder="日期范围" @on-change="onSelectDate" style="width: 220px;"></DatePicker>
        <Select v-if="merchantShow" v-model="merchantcode" filterable clearable @on-clear="onCLickClear" style="width:200px" placeholder="选择商户">
          <Option value="">全部商户</Option>
          <Option v-for="(item, index) in merchantData" :key="index" :value="item.merchantcode">{{item.name}}</Option>
        </Select>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <Button type="primary" :loading="expLoading" style="margin-left:8px" icon="md-arrow-down" @click="onClickExport">导出订单</Button>
      </div>
    </Card>
    <Card :bordered="false" style="margin-top:10px">
      <Table :columns="columns" :data="tableData"></Table>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { downloadFile } from '../../utlis/tools.js'
export default {
  name: 'ShopOrders',
  data () {
    return {
      searchKey: '',
      ordertype: 0,
      pageSize: 10,
      expLoading: false,
      page: 1,
      count: 0,
      starttime: '',
      endtime: '',
      ispay: '',
      merchantcode: '',
      tableData: [],
      merchantData: [],
      columns: [
        {
          title: '订单编号',
          key: 'orderno',
          width: 150
        },
        {
          title: '订单类型',
          key: 'type',
          width: 120
        },
        {
          title: '订单金额',
          key: 'amount',
          width: 100
        },
        {
          title: '支付金额',
          key: 'cash_amount',
          width: 100
        },
        {
          title: '商户',
          key: 'merchantname',
          width: 180
        },
        {
          title: '订单状态',
          key: 'order_status',
          width: 90
        },
        {
          title: '物流状态',
          key: 'shipping_status',
          width: 90
        },
        {
          title: '支付',
          key: 'pay_status',
          width: 100,
          render: (h, params) => {
            return h('Tag', {
              props: {
                color: params.row.pay_status == '已支付' ? 'success' : 'warning'
              }
            }, params.row.pay_status)
          }
        },
        {
          title: '创建时间',
          key: 'createtime',
          minWidth: 160
        },
        // {
        //   title: '订单编号',
        //   key: 'orderno',
        // },
        // {
        //   title: '订单编号',
        //   key: 'orderno',
        // },
        {
          title: '详情',
          key: 'orderno',
          fixed: 'right',
          align: 'center',
          width: 90,
          render: (h, params) => {
            return h('a', {
              on: {
                click: () => {
                  this.onClickSeeInfo(params.row)
                }
              }
            }, '查看详情')
          }
        },
      ]
    }
  },
  created () {
    this.getTableData()
    this.getMerchant()
  },
  computed: {
    dateOptions () {
      return this.$store.state.dateOptions
    },
    orderTypeArr () {
      return this.$store.state.orderTypeConst
    },
    merchantShow () {
      let role = sessionStorage.roleid
      if (role == 6 || role == 10) {
        return false
      } else {
        return true
      }
    }
  },
  methods: {
    getMerchant () {
      let d = {
        pagesize: 999999,
        page: 1
      }
      this.$store.commit('pageLoading', true)
      serverApi('/Merchant/index', d,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.merchantData = response.data.data.result
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.$store.commit('pageLoading', false)
        },
        error => {
          console.log(error)
          this.$store.commit('pageLoading', false)
        }
      )
    },
    onClickSearch () {
      this.page = 1
      this.getTableData()
    },
    changePage (e) {
      this.page = e
      this.getTableData()
    },
    onCLickClear () {
      this.merchantcode = ''
    },
    onChangeSize (e) {
      this.pageSize = e
      this.getTableData()
    },
    getTableData () {
      let d = {
        pagesize: this.pageSize,
        page: this.page,
        like: this.searchKey,
        ordertype: this.ordertype,
        starttime: this.starttime,
        endtime: this.endtime,
        ispay: this.ispay,
        merchantcode: this.merchantcode || ''
      }
      this.$store.commit('pageLoading', true)
      serverApi('/order/orderlist', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.tableData = response.data.data.result
            this.count = response.data.data.counts
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.$store.commit('pageLoading', false)
        },
        error => {
          console.log(error)
          this.$Message.warning('连接失败！')
          this.$store.commit('pageLoading', false)
        }
      )
    },
    onClickSeeInfo (row) {
      this.$router.push({name: 'ShopOrdersInfo', params: {id: row.orderid}})
    },
    onSelectDate (e) {
      this.starttime = e[0]
      this.endtime = e[1]
    },
    onClickExport () {
      this.expLoading = true
      this.$Message.loading({
        duration: 0,
        content: '正在生成Excel...'
      })
      let d = {
        userid: sessionStorage.userid,
        like: this.searchKey,
        ordertype: this.ordertype,
        starttime: this.starttime,
        endtime: this.endtime,
        ispay: this.ispay,
        merchantcode: this.merchantcode || ''
      }
      serverApi('/order/orderout', d,
        response => {
          console.log(response)
          this.$Message.destroy()
          if (response.data.code === 0) {
            if (typeof(response.data.data) === 'string') {
              downloadFile(response.data.data)
            } else {
              this.$Message.warning('返回数据格式不正确！')
            }
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.expLoading = false
        },
        error => {
          this.$Message.destroy()
          console.log(error)
          this.expLoading = false
          this.$Message.warning('连接失败！')
        }
      )
    },
  }
}
</script>
<style lang="less" scoped>

</style>
