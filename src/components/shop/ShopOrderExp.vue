<template>
  <div class="box">
    <Card :bordered="false">
      <div class="head">
        <Input v-model="searchKey" @on-enter="getTableData" placeholder="订单号搜索..." style="width: 200px"></Input>
        <Select v-model="exptype" style="width:200px">
          <Option value="0">全部</Option>
          <Option value="4">已发货</Option>
          <Option value="3">未发货</Option>
        </Select>
        <DatePicker :options="dateOptions" type="daterange" placeholder="日期范围" @on-change="onSelectDate" style="width: 220px;"></DatePicker>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
      </div>
    </Card>
    <Card :bordered="false" style="margin-top:10px">
      <Table :columns="columns" size="small" :data="tableData"></Table>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>

    <Modal v-model="editModal" width="500">
      <p slot="header" style="text-align:center">
        <span>录入单号</span>
      </p>
      <Form :model="editData" ref="form" :label-width="70">
        <FormItem label="订单号">
          <span>{{editData.orderno}}</span>
        </FormItem>
        <FormItem label="物流单号">
          <Input v-model="editData.shipping_code" placeholder="输入物流单号" />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="editModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="onSaveEdit">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'ShopOrderExp',
  data () {
    return {
      searchKey: '',
      ordertype: '0',
      pageSize: 10,
      editModal: false,
      modal_loading: false,
      page: 1,
      count: 0,
      tableData: [],
      starttime: '',
      endtime: '',
      columns: [
        {
          title: '#',
          key: 'orderid',
          width: 80
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
          width: 120
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
          title: '支付状态',
          key: 'pay_status',
          width: 110,
          render: (h, params) => {
            return h('Tag', {
              props: {
                color: params.row.pay_status == '已支付' ? 'success' : 'default',
                type: 'dot'
              }
            }, params.row.pay_status)
          }
        },
        {
          title: '收货地址',
          key: 'address',
          // ellipsis: true,
          minWidth: 180,
          render: (h, params) => {
            let text = ''
            if (params.row.address.indexOf('name') > -1) {
              let obj = JSON.parse(params.row.address)
              text = `${obj.name} ${obj.tel} ${obj.address} `
            } else {
              text = params.row.address
            }
            return h('Tooltip', {
              props: {
                placement: 'top-start',
                maxWidth: '300',
                delay: 200,
                content: text
              }
            }, text)
          }
        },
        {
          title: '创建时间',
          key: 'createtime',
          width: 160
        },
        {
          title: '物流单号',
          key: 'shipping_code',
          width: 120,
          align: 'center',
        },
        {
          title: '物流单号',
          key: 'shipping_code',
          width: 80,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            let text = h('span', {}, params.row.shipping_code)
            let btn = h('Button', {
              props: {
                type: 'default',
                size: 'small',
              },
              on: {
                click: () => {
                  this.onClickInputNum(params.row)
                }
              }
            }, '单号录入')
            return h('div', {}, [btn])
          }
        },
        {
          title: '详情',
          key: 'orderno',
          fixed: 'right',
          align: 'center',
          width: 80,
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
      ],
      editData: {}
    }
  },
  created () {
    this.getTableData()
  },
  computed: {
    dateOptions () {
      return this.$store.state.dateOptions
    },
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
    onSelectDate (e) {
      this.starttime = e[0]
      this.endtime = e[1]
    },
    getTableData () {
      let d = {
        pagesize: this.pageSize,
        page: this.page,
        like: this.searchKey,
        ispay: 1,
        ordertype: 4
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
    onClickInputNum (row) {
      this.editData = Object.assign({}, row)
      this.editModal = true
    },
    onSaveEdit () {
      if (!this.editData.shipping_code) {
        this.$Message.warning('请输入物流单号！')
        return false
      }
      this.modal_loading = true
      let d = {
        shipping_code: this.editData.shipping_code,
        orderid: this.editData.orderid
      }
      serverApi('/order/shipping', d,
        response => {
          this.modal_loading = false
          if (response.data.code === 0){
            this.getTableData()
            this.editModal = false
            this.$Message.success(response.data.msg)
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.modal_loading = false
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
