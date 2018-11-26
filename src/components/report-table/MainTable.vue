<template>
  <div class="box">
    <Card :bordered="false">
      <!-- <Select v-model="merchantid" filterable clearable placeholder="搜索商户" style="width:200px">
        <Option v-for="(item, index) in merchantData" :key="index" :value="item.id">{{item.name}}</Option>
      </Select>
      <Input v-model="searchKey" clearable placeholder="关键字搜索..." style="width: 200px"></Input>
      <DatePicker :options="dateOptions" clearable type="daterange" placeholder="日期范围" @on-change="onSelectDate" style="width: 220px"></DatePicker>
      <Select v-model="type" clearable placeholder="订单类型" style="width:200px">
        <Option value="0">全部</Option>
        <Option value="1">扫码支付</Option>
        <Option value="2">停车缴费</Option>
        <Option value="3">团购订单</Option>
        <Option value="4">邮购订单</Option>
      </Select>
      <Select v-model="paytype" clearable placeholder="支付方式" style="width:200px">
        <Option value="0">全部</Option>
        <Option value="1">微信支付</Option>
        <Option value="2">支付宝</Option>
      </Select>
      <Select v-model="shstatus" clearable placeholder="审核状态" style="width:200px">
        <Option value="9">全部</Option>
        <Option value="0">未审核</Option>
        <Option value="1">已审核</Option>
      </Select>
      <Button type="primary" :loading="tableLoading" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
      <Button type="primary" style="margin-left:8px" @click="goBackFinace" icon="ios-arrow-back">返回</Button>
      <Button type="primary" :loading="exportLoading" style="margin-left:8px; float:right" @click="exportTable" icon="md-arrow-down">导出数据</Button> -->
      <Row :gutter="10">
        <Col span="4">
          <Select v-model="merchantid" filterable clearable placeholder="搜索商户">
            <Option v-for="(item, index) in merchantData" :key="index" :value="item.id">{{item.name}}</Option>
          </Select>
        </Col>
        <Col span="4">
          <Input v-model="searchKey" clearable placeholder="关键字搜索..."></Input>
        </Col>
        <Col span="4">
          <DatePicker :options="dateOptions" clearable type="daterange" placeholder="日期范围" @on-change="onSelectDate" style="width:100%"></DatePicker>
        </Col>
        <Col span="4">
          <Select v-model="type" clearable placeholder="订单类型" style="width:100%">
            <Option value="0">全部</Option>
            <Option value="1">扫码支付</Option>
            <Option value="2">停车缴费</Option>
            <Option value="3">团购订单</Option>
            <Option value="4">邮购订单</Option>
          </Select>
        </Col>
        <Col span="4">
          <Select v-model="paytype" clearable placeholder="支付方式" style="width:100%">
            <Option value="0">全部</Option>
            <Option value="1">微信支付</Option>
            <Option value="2">支付宝</Option>
          </Select>
        </Col>
        <Col span="4">
          <Select v-model="shstatus" clearable placeholder="审核状态" style="width:100%">
            <Option value="0">全部</Option>
            <Option value="2">未审核</Option>
            <Option value="1">已审核</Option>
          </Select>
        </Col>
      </Row>
      <Row>
        <Col span="24" style="padding-top: 10px">
          <Button type="primary" :loading="tableLoading" icon="ios-search" @click="onClickSearch">搜索</Button>
          <Button type="default" style="margin-left:8px" @click="goBackFinace" icon="ios-arrow-back">返回</Button>
          <Button type="primary" :loading="exportLoading" style="margin-left:8px; float:right" @click="exportTable" icon="md-arrow-down">导出数据</Button>
          <Button type="warning" :loading="plshLoading" style="margin-left:8px; float:right" @click="onClickPlsh" icon="md-checkmark">批量审核</Button>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" style="margin-top:10px">
      <Table border @on-selection-change="onSelectTable" ref="table" highlight-row :loading="tableLoading" size="small" height="520" :columns="columns" :data="tableData"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="counts" show-sizer show-total :page-size-opts="pageSizeOpts" :page-size="15" :current.sync="page" @on-page-size-change="onChangeSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal v-model="shModal" :width="shOrderList.length > 0 ? 1000 : 500">
      <p slot="header" style="color:#f60;">
        <Icon type="ios-information-circle"></Icon>
        <span>提示</span>
      </p>
      <div style="">
        <p style="margin-bottom:10px">对此订单审核？</p>
        <p>订单号：{{shData.orderno}}</p>
        <p>流水号：{{shData.transaction_id}}</p>
        <p>订单金额: {{shData.total}} &nbsp;&nbsp;支付金额: {{shData.cash}}
          <!-- &nbsp;&nbsp;平台优惠: {{shData.coupon}}
          &nbsp;&nbsp;商家优惠: {{shData.merchantcoupon}} -->
        </p>
        <table class="table" style="margin-top:8px;" v-show="shOrderList.length>0">
          <thead>
            <tr>
              <th>订单ID</th>
              <th>商品ID</th>
              <th>商户</th>
              <th>商品</th>
              <th>属性</th>
              <th>数量</th>
              <th>单价</th>
              <th>平台优惠</th>
              <th>商家优惠</th>
              <th style="width:60px;text-align:center" v-if="shData.type==4">审核</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in shOrderList" :key="index">
              <td :rowspan="item.orderidspan" :class="{'hidden':item.orderiddis}">{{item.orderid}}</td>
              <td>{{item.goodsid}}</td>
              <td :rowspan="item.merchantnamespan" :class="{'hidden':item.merchantnamedis}">{{item.merchantname}}</td>
              <td class="goodsInfo">
                <img v-if="item.goodsimg" v-imgview :src="item.goodsimg" alt="">
                <span>{{item.goodsname}}</span>
              </td>
              <td>{{item.goodstypename}}</td>
              <td>{{item.goodsnum}}</td>
              <td>{{item.goodsprice}}</td>
              <td :rowspan="item.couponspan" :class="{'hidden':item.coupondis}">{{item.coupon}}</td>
              <td :rowspan="item.merchantcouponspan" :class="{'hidden':item.merchantcoupondis}">{{item.merchantcoupon}}</td>
              <td style="width:60px;text-align:center" :rowspan="item.orderidspan" :class="{'hidden':item.ischeckdis}" v-if="shData.type==4">
                <a v-if="item.ischeck == 0 && item.order_status == '3'" @click="onClickSHGoods(item)">审核</a>
                <span v-if="item.ischeck == 1">已审核</span>
                <!-- <span v-if="item.ischeck == 0 && item.order_status != '3'">未核销</span> -->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div slot="footer" v-if="shOrderList.length==0">
        <Button @click="shModal = false">取消</Button>
        <Button type="error" :loading="refuseLoading" @click="onClickSH(0)">不通过</Button>
        <Button type="primary" :loading="passLoading" @click="onClickSH(1)">确认审核</Button>
      </div>
      <div slot="footer" v-if="shData.type == 3">
        <Button @click="shModal = false">取消</Button>
        <Button type="error" :loading="refuseLoading" @click="onClickSH(0)">不通过</Button>
        <Button type="primary" :loading="passLoading" @click="onClickSH(1)">确认审核</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { combineCell, downloadFile } from '../../utlis/tools.js'
export default {
  name: 'MainTable',
  data () {
    return {
      searchKey: '',
      tableLoading: false,
      exportLoading: false,
      shModal: false,
      passLoading: false,
      refuseLoading: false,
      plshLoading: false,
      counts: 0,
      page: 1,
      pageSize: 15,
      pageSizeOpts: [10, 15, 25, 50, 70, 100, 200],
      tableData: [],
      shData: {},
      shOrderList: [],
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '商户',
          key: 'merchantname',
          width: 140,
          tooltip: true
        },
        {
          title: '类型',
          key: 'type',
          width: 90,
          render: (h, params) => {
            let text = ''
            switch (params.row.type) {
              case 1:
                text = '扫码支付'
                break
              case 2:
                text = '停车缴费'
                break
              case 3:
                text = '团购订单'
                break
              case 4:
                text = '邮购订单'
                break
            }
            return h('span', {}, text)
          }
        },
        {
          title: '设备号',
          key: 'equipmentno',
          width: 90,
          tooltip: true
        },
        {
          title: '订单号',
          key: 'orderno',
          width: 151,
          tooltip: true
        },
        {
          title: '支付流水',
          key: 'transaction_id',
          minWidth: 140,
          tooltip: true
        },
        {
          title: '商品详情',
          key: 'orderlist',
          width: 300,
          className: 'orderlist',
          render: (h, params) => {
            if (params.row.orderlist.length > 0) {

              let list = h('ul', params.row.orderlist.map(item => {
                let img = h('img', {
                  style: {
                    height: '30px',
                    width: '30px',
                    borderRadius: '50%',
                    verticalAlign: 'bottom'
                  },
                  attrs: {
                    src: item.goodsimg
                  },
                  directives: [
                    {
                      name: 'imgview'
                    }
                  ]
                })
                let name = h('span', {
                  style: {
                    height: '30px',
                    width: '30px',
                    verticalAlign: 'bottom',
                  },
                }, item.goodsname)
                return h('li', {
                  style: {
                    padding: '0',
                    width: '100%',
                    color: '#2d8cf0',
                    verticalAlign: 'bottom',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                  }
                }, [item.goodsimg ? img : null, name])
              }))
              let a = h('a', {}, '详情>>')
              let pop = h('div', {

              }, [list])
              return pop

            } else {
              return h('span', {}, '')
            }
          }
        },
        {
          title: '支付金额',
          key: 'cash',
          width: 110,
          sortable: true,
          align: 'right'
        },
        {
          title: '订单金额',
          key: 'total',
          width: 110,
          sortable: true,
          align: 'right'
        },
        {
          title: '平台优惠',
          key: 'coupon',
           width: 110,
          sortable: true,
          align: 'right'
        },
        {
          title: '商户优惠',
          key: 'merchantcoupon',
          width: 110,
          sortable: true,
          align: 'right'
        },
        {
          title: '订单优惠',
          key: 'subsidy',
          width: 110,
          sortable: true,
          align: 'right'
        },
        {
          title: '扣点金额',
          key: 'points',
          width: 110,
          sortable: true,
          align: 'right'
        },
        {
          title: '订单时间',
          key: 'createtime',
          width: 140,
        },
        {
          title: '对账状态',
          key: 'ispay',
          width: 120,
          render: (h, params) => {
            let text = params.row.ispay == 1 ? '已对账' : '未对账'
            let color = params.row.ispay == 1 ? 'success' : 'warning'
            let el = h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
            return el
          }
        },
        {
          title: '优惠审核',
          key: 'ischeck',
          width: 120,
          render: (h, params) => {
            let text = params.row.ischeck == 1 ? '已审核' : '未审核'
            let color = params.row.ischeck == 1 ? 'success' : 'warning'
            let el = h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
            return el
          }
        },
        {
          title: '申请状态',
          key: 'isapply',
          width: 120,
          render: (h, params) => {
            let text = params.row.isapply == 1 ? '已申请' : '未申请'
            let color = params.row.isapply == 1 ? 'success' : 'warning'
            let el = h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
            return el
          }
        },
        {
          title: '审核状态',
          key: 'isauditing',
          width: 120,
          render: (h, params) => {
            let text = params.row.isauditing == 1 ? '已审核' : '未审核'
            let color = params.row.isauditing == 1 ? 'success' : 'warning'
            let el = h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
            return el
          }
        },
        {
          title: '打款状态',
          key: 'ispayment',
          width: 120,
          render: (h, params) => {
            let text = params.row.ispayment == 1 ? '已打款' : '未打款'
            let color = params.row.ispayment == 1 ? 'success' : 'warning'
            let el = h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
            return el
          }
        },
        {
          title: '收款状态',
          key: 'isreceivables',
          width: 120,
          render: (h, params) => {
            let text = params.row.isreceivables == 1 ? '已收款' : '未收款'
            let color = params.row.isreceivables == 1 ? 'success' : 'warning'
            let el = h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
            return el
          }
        },
        {
          title: '扣点',
          key: 'points',
          minWidth: 110,
        },
        {
          title: '应付',
          key: 'mertotal',
          minWidth: 110,
          sortable: true,
          align: 'right'
        },
        {
          title: '付款方式',
          key: 'paymenttype',
          minWidth: 110,
        },
        {
          title: '申请单号',
          key: 'applyno',
          minWidth: 140,
        },
        {
          title: '优惠审核',
          key: 'isreceivables',
          fixed: 'right',
          width: 80,
          align: 'center',
          render: (h, params) => {
            let sh = h('a', {
              on: {
                click: () => {
                  this.onClickReview(params.row)
                }
              }
            }, '审核')
            let ysh = h('a', {
              style: {
                color: '#19be6b'
              }
            }, '已审核')
            let refuse = h('a', {
              style: {
                color: '#ed4014'
              }
            }, '拒绝')
            if (params.row.ischeck == 0) {
              return sh
            } else if (params.row.ischeck == 1) {
              return ysh
            } else if (params.row.ischeck == 2) {
              return refuse
            } else {
              return null
            }
          }
        }
      ],
      starttime: '',
      endtime: '',
      type: '',
      paytype: '0',
      shstatus: '',
      merchantData: [],
      merchantid: null,
      checkedList: []
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
  },
  methods: {
    onClickSearch () {
      this.page = 1
      this.getTableData()
    },
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
    onSelectDate (e) {
      this.starttime = e[0]
      this.endtime = e[1]
    },
    getTableData () {
      this.tableLoading = true
      let d = {
        page: this.page,
        pagesize: this.pageSize,
        like: this.searchKey,
        starttime: this.starttime,
        endtime: this.endtime,
        paytype: this.paytype,
        type: this.type,
        ischeck: this.shstatus,
        merchantid: this.merchantid
      }
      console.log(d)
      serverApi('/Finance/orderlist', d,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.tableData = response.data.data.result
            this.tableData.map(item => {
              item._disabled = item.ischeck == 1
            })
            this.counts =  response.data.data.counts
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.tableLoading = false
        },
        error => {
          console.log(error)
          this.tableLoading = false
        }
      )
    },
    goBackFinace () {
      this.$router.push({name: 'FinaceTable', original: false})
    },
    exportTable () {
      if (this.tableData.length < 1) {
        this.$Message.info('暂无数据')
        return false
      }
      this.exportLoading = true

      let d = {
        page: this.page,
        pagesize: this.pageSize,
        like: this.searchKey,
        starttime: this.starttime,
        endtime: this.endtime,
        paytype: this.paytype,
        type: this.type,
        ischeck: this.shstatus,
        merchantid: this.merchantid,
        exports: 'out'
      }
      serverApi('/Finance/orderlist', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            // location.href = response.data.data
            console.log(typeof(response.data.data))
            if (typeof(response.data.data) === 'string') {
              downloadFile(response.data.data)
            }
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.exportLoading = false
        },
        error => {
          console.log(error)
          this.exportLoading = false
        }
      )
    },
    changePage (e) {
      this.page = e
      this.getTableData()
    },
    onChangeSize (e) {
      this.pageSize = e
      this.getTableData()
    },
    onClickReview (row) {
      this.shData = row
      this.shOrderList = combineCell(row.orderlist)
      console.log(this.shOrderList)
      this.shModal = true
    },
    onClickSH (e) {
      if (e === 1) {
        this.passLoading = true
      } else if (e === 0) {
        this.refuseLoading = true
      }
      let orderid = ''
      if (this.shData.orderlist.length == 1 && this.shData.type == '3') {
        orderid = this.shData.orderlist[0].orderid
      }
      let d = {
        orderno: this.shData.orderno,
        check: e,
        orderid: orderid
      }
      serverApi('/Finance/operation', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.$Message.success(response.data.msg)
            this.shModal = false
            this.shData.ischeck = 1
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.passLoading = false
          this.refuseLoading = false
        },
        error => {
          console.log(error)
          this.$Message.warning(error.toString())
          this.refuseLoading = false
          this.tableLoading = false
        }
      )
    },
    onClickSHGoods (row) {
      this.$Message.loading({
        content: 'Loading...',
        duration: 0
      })
      let d = {
        orderno: this.shData.orderno,
        check: 1,
        orderid: row.orderid
      }
      serverApi('/Finance/operation', d,
        response => {
          console.log(response)
          this.$Message.destroy()
          if (response.data.code === 0){
            this.$Message.success(response.data.msg)
            this.shModal = false
            row.ischeck = 1
            this.getTableData()
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.destroy()
          console.log(error)
          this.$Message.warning(error.toString())
        }
      )
    },
    onClickItemSh (item) {
      this.$Message.loading({
        content: '加载中...',
        duration: 0
      })
      let d = {
        orderno: this.shData.orderno,
        check: '1',
        orderid: item.orderid
      }
      serverApi('/Finance/operation', d,
        response => {
          console.log(response)
          this.$Message.destroy()
          if (response.data.code === 0){
            item.ischeck = 1
            this.$Message.success(response.data.msg)
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.destroy()
          console.log(error)
          this.$Message.warning(error.toString())
        }
      )
    },
    onClickPlsh () {
      // if (!this.type) {
      //   this.$Message.warning('请选择具体的订单类型！')
      //   return false
      // }
      let arr = []
      if (this.checkedList.length > 0) {
        this.checkedList.forEach(item => {
          arr.push(item.orderno)
        })
      }
      this.$Modal.confirm({
        title: '提示',
        content: '通过所勾选的订单，若未勾选则会通过所有在筛选条件下的订单！',
        loading: true,
        onOk: () => {
          this.plshLoading = true
          let d = {
            like: this.searchKey,
            starttime: this.starttime,
            endtime: this.endtime,
            paytype: this.paytype,
            type: this.type,
            ischeck: this.shstatus,
            merchantid: this.merchantid,
            isbatch: 1,
            check: 1,
            chenckedlist: arr.toString()
          }
          this.$Message.loading({
            content: 'Loading...',
            duration: 0
          })
          serverApi('/finance/operation', d,
            response => {
              console.log(response)
              this.$Message.destroy()
              if (response.data.code === 0){
                this.$Message.success(response.data.msg)
                this.getTableData()
              }else{
                this.$Message.warning(response.data.msg)
              }
              this.plshLoading = false
              this.$Modal.remove()
            },
            error => {
              this.$Modal.remove()
              this.$Message.destroy()
              console.log(error)
              this.plshLoading = false
              this.$Message.warning(error.toString())
            }
          )
        }
      })
    },
    onSelectTable (e) {
      this.checkedList = e
    }
  }
}
</script>
<style lang="less">
.tablefooter{
  padding: 0 10px;
}
.ivu-table .shouldReceive{
  // color: #2d8cf0;
  font-size: 14px;
}
.ivu-table .discount{
  // color: #f60;
  font-size: 14px;
}
.ivu-table .realReceive{
  // color: #ff9900;
  font-size: 14px;
}
.table1{
  width: 100%;
  table-layout: fixed;
  border: none;
}
.orderlist{
  padding: 0!important;
  .ivu-table-cell{
    padding: 0!important;
  }
}
.goodsInfo{
  white-space: wrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 400px;
  img{
    height: 20px;
    width: 20px;
    border-radius: 10px;
    vertical-align: bottom;
  }
  span{
    vertical-align: bottom;
  }
}
</style>
