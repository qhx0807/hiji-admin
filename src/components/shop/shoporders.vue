<template>
  <div class="box">
    <Card :bordered="false">
      <div class="head">
        <Input v-model="searchKey" @on-enter="getTableData" placeholder="搜索..." style="width: 200px"></Input>
        <Select v-model="ordertype" style="width:210px">
          <Option value="0">全部</Option>
          <Option value="4">邮寄类商品订单</Option>
          <Option value="3">购买卡券订单</Option>
        </Select>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <!-- <Button type="primary" style="margin-left:8px" icon="md-add">操作</Button> -->
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
export default {
  name: 'ShopOrders',
  data () {
    return {
      searchKey: '',
      ordertype: '0',
      pageSize: 10,
      page: 1,
      count: 0,
      tableData: [],
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
          width: 200
        },
        {
          title: '订单状态',
          key: 'order_status',
          width: 120
        },
        {
          title: '支付',
          key: 'pay_status',
          width: 120,
          render: (h, params) => {
            return h('Tag', {
              props: {
                color: params.row.pay_status == '已支付' ? 'green' : 'default'
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
  },
  methods: {
    onClickSearch () {
      this.page = 1
      this.getTableData()
    },
    changePage (e) {
      this.page = e
      this.getTableData()
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
        ordertype: this.ordertype
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
    }
  }
}
</script>
<style lang="less" scoped>

</style>
