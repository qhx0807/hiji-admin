<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
       <Form label-width="60">
         <Row :gutter="10">
            <Col span="5">
              <FormItem label="关键字" style="margin-bottom:0">
                <Input v-model="like" clearable placeholder="关键字搜索..."></Input>
              </FormItem>
            </Col>
            <Col span="4">
              <Button type="primary" @click="getTableData">查询</Button>
            </Col>
          </Row>
       </Form>
    </Card>
    <Card :bordered="false">
      <Table :columns="columns" :data="tableData"></Table>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" :page-size-opts="pageSizeOpts" show-sizer show-elevator @on-page-size-change="onChangeSize"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'ShopOrderRefund',
  data () {
    return {
      like: '',
      page: 1,
      count: 0,
      pagesize: 10,
      tableData: [],
      columns: [
        {
          title: '用户',
          width: 170,
          key: 'userid'
        },
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
          minWidth: 180
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
          width: 120,
          render: (h, params) => {
            return h('Tag', {
              props: {
                color: params.row.pay_status == '已支付' ? 'success' : 'warning',
                type: 'dot'
              }
            }, params.row.pay_status)
          }
        },
        {
          title: '支付流水',
          key: 'pay_no',
          minWidth: 160,
          ellipsis: true,
          tooltip: true
        },
        {
          title: '创建时间',
          key: 'createtime',
          minWidth: 160
        },
        {
          title: '详情',
          key: 'orderno',
          fixed: 'right',
          align: 'center',
          width: 140,
          render: (h, params) => {
            const see = h('a', {
              on: {
                click: () => {
                  this.onClickSeeInfo(params.row)
                }
              }
            }, '查看详情')
            const ca = h('a', {
              style: {
                color: '#f90',
                marginLeft: '10px'
              },
              on: {
                click: () => {
                  this.onClickRefund(params.row)
                }
              }
            }, '同意退款')
            return h('div', null, [see, ca])
          }
        },
      ],
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    changePage (e) {
      this.page = e
      this.getTableData()
    },
    onChangeSize (e) {
      this.pagesize = e
      this.getTableData()
    },
    getTableData () {
      let d = {
        pagesize: this.pagesize,
        page: this.page,
        like: this.like
      }
      this.$store.commit('pageLoading', true)
      serverApi('/order/orderrefund', d,
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
    onClickRefund (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '同意退款此订单？',
        loading: true,
        onOk: () => {
          serverApi('/order/confirmrefund', {orderid: row.orderid},
            response => {
              if (response.data.code === 0) {
                this.$Message.success(response.data.msg)
                this.getTableData()
              } else {
                this.$Message.warning(response.data.msg)
              }
              this.$Modal.remove()
            },
            error => {
              this.$Message.warning(error.toString())
              this.$Modal.remove()
            }
          )

        }
      })
    }
  }
}
</script>
<style lang="less" scoped>

</style>
