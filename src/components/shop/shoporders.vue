<template>
  <div class="box">
    <Card :bordered="false">
      <Form label-width="60">
        <Row :gutter="10">
          <Col span="6">
            <FormItem label="关键字">
              <Input v-model="searchObj.like" clearable placeholder="关键字搜索..."></Input>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="订单类型">
              <Select v-model="searchObj.ordertype" >
                <Option v-for="(item, index) in orderTypeArr" :key="index" :value="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="日期范围">
              <DatePicker :options="dateOptions" style="width:100%" type="daterange" placeholder="日期范围" @on-change="onSelectDate"></DatePicker>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="选择商户">
              <Select v-if="merchantShow" v-model="searchObj.merchantcode" filterable clearable @on-clear="onCLickClear"  placeholder="选择商户">
                <Option v-for="(item, index) in merchantData" :key="index" :value="item.merchantcode">{{item.name}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="6">
            <FormItem label="线下打款" style="margin-bottom:0">
              <Select v-model="searchObj.billtype" clearable>
                <Option value="0">否</Option>
                <Option value="1">是</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="18">
            <FormItem style="margin-bottom:0">
              <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
              <Button type="default" :loading="expLoading" style="margin-left:8px" icon="md-arrow-down" @click="onClickExport">导出订单</Button>
              <Button v-show="isAdmin" type="default" style="margin-left:8px" icon="ios-apps" @click="onClickXxdk">设置为线下打款</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card :bordered="false" style="margin-top:10px">
      <Table @on-selection-change="onSelectOrders" :columns="columns" :data="tableData"></Table>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" :page-size-opts="pageSizeOpts" show-sizer @on-page-size-change="onChangeSize"></Page>
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
      searchObj: {
        pagesize: 10,
        page: 1,
        like: '',
        ordertype: '',
        starttime: '',
        endtime: '',
        ispay: '',
        merchantcode: '',
        billtype: ''
      },
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
          type: 'selection',
          width: 60,
          align: 'center'
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
          title: '创建时间',
          key: 'createtime',
          width: 160
        },
        {
          title: '发货时间',
          key: 'shipping_codetime',
          width: 160
        },
        {
          title: '收货时间',
          key: 'confirmtime',
          width: 160
        },
        {
          title: '线下打款',
          key: 'billtype',
          width: 80,
          render: (h, params) => {
            let text = params.row.billtype == 0 ? '否' : '是'
            let color = params.row.billtype == 0 ? 'orange' : 'cyan'
            return h('Tag', {
              props: {
                color: color,
                type: 'border'
              }
            }, text)
          }
        },
        {
          title: '打款说明',
          key: 'billmsg',
          minWidth: 100,
        },
        {
          title: '详情',
          key: 'orderno',
          fixed: 'right',
          align: 'center',
          width: 120,
          render: (h, params) => {
            const see = h('a', {
              on: {
                click: () => {
                  this.onClickSeeInfo(params.row)
                }
              }
            }, '查看详情')
            const pri = h('a', {
              on: {
                click: () => {
                  this.onClickPrint(params.row)
                }
              },
              style: {
                marginLeft: '12px',
                color: '#f90'
              }
            }, '打印')
            return h('div',[see,pri])
          }
        },
      ],
      billmsg: '',
      selectArr: [],
      pageSizeOpts: [10, 20, 50, 100, 200, 500]
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
    },
    isAdmin () {
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
      this.searchObj.merchantcode = this.searchObj.merchantcode || ''
      this.page = 1
      this.getTableData()
    },
    changePage (e) {
      this.searchObj.page = e
      this.getTableData()
    },
    onCLickClear () {
      this.searchObj.merchantcode = ''
    },
    onChangeSize (e) {
      console.log(e);
      this.searchObj.pagesize = e
      this.getTableData()
    },
    getTableData () {
      // let d = {
      //   pagesize: this.pageSize,
      //   page: this.page,
      //   like: this.searchKey,
      //   ordertype: this.ordertype,
      //   starttime: this.starttime,
      //   endtime: this.endtime,
      //   ispay: this.ispay,
      //   merchantcode: this.merchantcode || ''
      // }
      this.$store.commit('pageLoading', true)
      serverApi('/order/orderlist', this.searchObj,
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
      this.searchObj.starttime = e[0]
      this.searchObj.endtime = e[1]
    },
    onClickExport () {
      this.expLoading = true
      this.$Message.loading({
        duration: 0,
        content: '正在生成Excel...'
      })
      // let d = {
      //   userid: sessionStorage.userid,
      //   like: this.searchKey,
      //   ordertype: this.ordertype,
      //   starttime: this.starttime,
      //   endtime: this.endtime,
      //   ispay: this.ispay,
      //   merchantcode: this.merchantcode || ''
      // }
      serverApi('/order/orderout', this.searchObj,
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
    onSelectOrders (e) {
      console.log(e)
      let arr = []
      e.forEach(item => {
        arr.push(item.orderid)
      })
      this.selectArr = arr
    },
    onClickXxdk () {
      if (this.selectArr.length === 0) {
        this.$Message.warning('请选择要操作的数据！')
        return false
      }
      console.log(this.selectArr)
      this.$Modal.confirm({
        title: '将所选的订单设置为线下打款状态？',
        content: '将选这的订单设置为线下打款状态？',
        render: (h) => {
          return h('Input', {
            props: {
              value: this.billmsg,
              autofocus: true,
              type: 'textarea',
              placeholder: '打款说明...',
              rows: 4
            },
            on: {
              input: (val) => {
                this.billmsg = val
              }
            }
          })
        },
        loading: true,
        onOk: () => {
          let ds = {
            billmsg: this.billmsg,
            orderids: this.selectArr.join(',')
          }
          serverApi('/order/orderbillexchange', ds,
            response => {
              if (response.data.code === 0) {
                this.$Message.success(response.data.msg)
                this.$Notice.info({
                  title: '操作完成',
                  desc: `设置打款方式操作完成，成功：${response.data.data.countsuccess}, 失败： ${response.data.data.countdefault}`,
                })
              } else {
                this.$Message.warning(response.data.msg)
              }
              this.$Modal.remove()
            },
            error => {
              console.log(error)
              this.$Message.warning(error.toString())
              this.$Modal.remove()
            }
          )
        }
      })
    },
    onClickPrint (row) {
      this.$Message.loading({
        duration: 0,
        content: '加载中...'
      })
      serverApi('/order/orderoutone', {orderno: row.orderno},
        response => {
          this.$Message.destroy()
          if (response.data.code === 0) {
            downloadFile(response.data.data)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
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
