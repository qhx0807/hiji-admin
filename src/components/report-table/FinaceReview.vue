<template>
  <div class="box">
    <Card :bordered="false">
      <!-- <Input v-model="searchKey" placeholder="关键字搜索..." style="width: 200px"></Input>
      <Select v-model="isapply" clearable style="width: 200px; margin-left:15px">
        <Option value="9">全部</Option>
        <Option value="1">已申请</Option>
        <Option value="0">未申请</Option>
      </Select>
      <Select v-model="isauditing" clearable style="width: 200px; margin-left:15px">
        <Option value="9">全部</Option>
        <Option value="1">已审核</Option>
        <Option value="0">未审核</Option>
      </Select>
      <Select v-model="isapprove" clearable style="width: 200px; margin-left:15px">
        <Option value="9">全部</Option>
        <Option value="1">已审批</Option>
        <Option value="0">未审批</Option>
      </Select>
      <Select v-model="ispayment" clearable style="width: 200px; margin-left:15px">
        <Option value="9">全部</Option>
        <Option value="1">已打款</Option>
        <Option value="0">未打款</Option>
      </Select>
      <Select v-model="timetype" clearable style="width: 120px; margin-left:15px">
        <Option v-for="(item, index) in timeTypeList" :key="index" :value="item.value">{{item.name}}</Option>
      </Select>
      <DatePicker :options="dateOptions" type="daterange" placeholder="日期范围" @on-change="onSelectDate" style="width: 220px;margin-left:-3px"></DatePicker>
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
          <Select v-model="isapply" placeholder="申请状态" clearable>
            <Option value="9">全部</Option>
            <Option value="1">已申请</Option>
            <Option value="0">未申请</Option>
          </Select>
        </Col>
        <Col span="4">
          <Select v-model="isauditing" placeholder="财务会计审核状态" clearable>
            <Option value="9">全部</Option>
            <Option value="1">已审核</Option>
            <Option value="0">未审核</Option>
          </Select>
        </Col>
        <Col span="4">
          <Select v-model="isapprove" clearable placeholder="财务总监审批状态">
            <Option value="9">全部</Option>
            <Option value="1">已审批</Option>
            <Option value="0">未审批</Option>
          </Select>
        </Col>
        <Col span="4">
          <Select v-model="ispayment" clearable placeholder="财务出纳打款状态">
            <Option value="9">全部</Option>
            <Option value="1">已打款</Option>
            <Option value="0">未打款</Option>
          </Select>
        </Col>
      </Row>
      <Row style="margin-top:10px">
        <Col span="8">
          <Select v-model="timetype" clearable placeholder="选择时间条件" style="width: 120px;">
            <Option v-for="(item, index) in timeTypeList" :key="index" :value="item.value">{{item.name}}</Option>
          </Select>
          <DatePicker :options="dateOptions" type="daterange" placeholder="日期范围" @on-change="onSelectDate" ></DatePicker>
        </Col>
        <Col span="16" style="text-align:right">
          <Button type="primary" :loading="tableLoading" icon="ios-search" @click="onClickSearch">搜索</Button>
          <Button type="primary" style="margin-left:8px" @click="goBackFinace" icon="ios-arrow-back">返回</Button>
          <Dropdown style="margin-left: 8px" @on-click="onClickDownLoadData">
            <Button type="primary">
                下载数据
                <Icon type="ios-arrow-down"></Icon>
            </Button>
            <DropdownMenu slot="list">
                <DropdownItem name="" divided>导出数据</DropdownItem>
                <DropdownItem name="out" divided>导出详细数据</DropdownItem>
                <DropdownItem name="pdf" divided>下载PDF</DropdownItem>
                <DropdownItem name="xlsx" divided>下载Excel</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <!-- <Button type="primary" :loading="exportLoading" style="margin-left:8px" @click="exportTable" icon="md-arrow-down">导出数据</Button> -->
          <!-- <Button type="primary" :loading="exportLoading" style="margin-left:8px" @click="exportTableDetail" icon="ios-cloud-download-outline">导出详细数据</Button> -->
          <Button type="error"  :loading="passLoading" style="margin-left:8px" @click="onClickNotAllow" icon="ios-information-circle-outline">批量审核</Button>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false" style="margin-top:10px">
      <Table border ref="table" highlight-row @on-selection-change="onSelectTableItem" :loading="tableLoading" size="small" height="550" :columns="columns" :data="tableData"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="counts" show-sizer show-total :page-size-opts="pageSizeOpts" :page-size="15" :current.sync="page" @on-page-size-change="onChangeSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal v-model="shModal" width="1000" :styles="{top: '50px'}">
      <p slot="header" style="text-align:center">
        <span>申请单号 {{shData.applyno}}</span>
      </p>
      <div>
        <Table border ref="tableSh" highlight-row size="small" height="400" :columns="columnsSH" :data="orderData">
          <div slot="footer">
            <ul class="sta-li">
              <li>合计：</li>
              <li>支付金额：{{shStaData.cash.toFixed(2)}}元</li>
              <li>平台优惠：{{shStaData.coupon.toFixed(2)}}元</li>
              <li>订单优惠：{{shStaData.subsidy.toFixed(2)}}元</li>
              <li>商家优惠：{{shStaData.merchantcoupon.toFixed(2)}}元</li>
              <li>合计金额：{{shStaData.total.toFixed(2)}}元</li>
            </ul>
          </div>
        </Table>
      </div>
      <div slot="footer">
        <Button @click="shModal = false">取消</Button>
        <Button type="default" @click="downLoadShData">下载数据</Button>
        <Button type="error" :loading="refuseLoading" @click="onClickSH(2)">不通过</Button>
        <Button type="primary" :loading="passLoading" @click="onClickSH(1)">审核通过</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { downloadFile } from '../../utlis/tools.js'
export default {
  name: 'FinaceReview',
  data () {
    return {
      searchKey: '',
      timetype: '',
      tableLoading: false,
      exportLoading: false,
      shModal: false,
      passLoading: false,
      refuseLoading: false,
      counts: 0,
      page: 1,
      pageSize: 15,
      pageSizeOpts: [10, 15, 25, 50, 70, 100, 200],
      tableData: [],
      shData: {},
      orderData: [],
      columns: [
        {
          type: 'selection',
          width: 50,
          align: 'center'
        },
        {
          title: '商户',
          key: 'merchantname',
          width: 140,
          tooltip: true
        },
        {
          title: '设备号id',
          key: 'equipmentid',
          width: 90,
          tooltip: true
        },
        {
          title: '申请单号',
          key: 'applyno',
          minWidth: 170,
        },
        {
          title: '支付金额',
          key: 'cash',
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
          title: '提现金额',
          key: 'total',
          width: 110,
          sortable: true,
          align: 'right'
        },
        {
          title: '剩余提现金额',
          key: 'merchantsurplus',
          width: 140,
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
          key: 'point',
          width: 110,
          sortable: true,
          align: 'right'
        },
        {
          title: '领导审批',
          key: 'isapprove',
          width: 120,
          render: (h, params) => {
            let text = params.row.isapprove == 1 ? '已审批' : '未审批'
            let color = params.row.isapprove == 1 ? 'success' : 'warning'
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
          title: '对账状态',
          key: 'ispay',
          width: 120,
          render: (h, params) => {
            let text = '已对账'
            let color = 'success'
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
          title: '扣点',
          key: 'points',
          minWidth: 110,
        },
        {
          title: '审核',
          key: 'id',
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
            if (params.row.isauditing == 0) {
              return sh
            } else if (params.row.isauditing == 1) {
              return ysh
            } else if (params.row.isauditing == 2) {
              return refuse
            } else {
              return null
            }
          }
        }
      ],
      columnsSH: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '类型',
          key: 'type',
          width: 80,
        },
        {
          title: '设备号',
          key: 'equipmentno',
          width: 90,
          tooltip: true,
        },
        {
          title: '订单号',
          key: 'orderno',
          width: 140,
        },
        {
          title: '顾客实付',
          key: 'cash',
          width: 100,
          align: 'right',
          sortable: true
        },
        {
          title: '平台优惠',
          key: 'coupon',
          width: 100,
          align: 'right',
          sortable: true
        },
        {
          title: '订单优惠',
          key: 'subsidy',
          width: 100,
          align: 'right',
          sortable: true
        },
        {
          title: '商家优惠',
          key: 'merchantcoupon',
          width: 100,
          align: 'right',
          sortable: true
        },
        {
          title: '扣点',
          key: 'pointsprice',
          width: 100,
          align: 'right',
          sortable: true
        },
        {
          title: '商家应收',
          key: 'total',
          width: 100,
          align: 'right',
          sortable: true
        },
        {
          title: '邮费定价',
          key: 'postagefee',
          width: 100,
          align: 'right',
          sortable: true
        },
        {
          title: '邮费扣率',
          key: 'postageponit',
          width: 100,
          align: 'right',
          sortable: true
        },
        {
          title: '邮费结算',
          key: 'settlementpostagefee',
          width: 100,
          align: 'right',
          sortable: true
        },
        {
          title: '支付方式',
          key: 'paytypename',
          width: 80,
        },
        {
          title: '提现总额',
          key: 'orderno',
          width: 100,
          align: 'right',
          render: (h, params) => {
            let text = (Number(params.row.total) + Number(params.row.settlementpostagefee)).toFixed(2)
            return h('div', {}, text)
          }
        },
        {
          title: '时间',
          key: 'createtime',
          width: 140,
        },
      ],
      timeTypeList: [
        {value: 'applytime', name: '申请时间'},
        {value: 'auditingtime', name: '财务审核时间'},
        {value: 'paymenttime', name: '付款时间'},
        {value: 'approvetime', name: '审批时间'},
        {value: 'receivablestime', name: '收款时间'}
      ],
      starttime: '',
      endtime: '',
      isapply: '',
      isauditing: '',
      isapprove: '',
      ispayment: '',
      merchantid: '',
      merchantData: [],
      selectTableItem: []
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
    shStaData () {
      let obj = {
        cash: 0,
        coupon: 0,
        subsidy: 0,
        merchantcoupon: 0,
        total: 0
      }
      if (this.orderData.length > 0) {
        this.orderData.forEach(item => {
            obj.cash += Number(item.cash)
            obj.coupon += Number(item.coupon)
            obj.subsidy += Number(item.subsidy)
            obj.merchantcoupon += Number(item.merchantcoupon)
            obj.total += Number(item.total)
        })
      }
      return obj
    }
  },
  methods: {
    onClickSearch () {
      this.page = 1
      this.getTableData()
    },
    getTableData () {
      this.tableLoading = true
      let d = {
        page: this.page,
        pagesize: this.pageSize,
        type: 2,
        like: this.searchKey,
        timetype: this.timetype,
        starttime: this.starttime,
        endtime: this.endtime,
        isapply: this.isapply,
        isauditing: this.isauditing,
        isapprove: this.isapprove,
        ispayment: this.ispayment,
        merchantid: this.merchantid
      }
      serverApi('/Finance/accountlist', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.tableData = response.data.data.result
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
        type: 2,
        like: this.searchKey,
        timetype: this.timetype,
        starttime: this.starttime,
        endtime: this.endtime,
        isapply: this.isapply,
        isauditing: this.isauditing,
        isapprove: this.isapprove,
        ispayment: this.ispayment,
        merchantid: this.merchantid,
        exports: 'out'
      }
      serverApi('/Finance/accountlist', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
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
    exportTableDetail () {
      if (this.tableData.length < 1) {
        this.$Message.info('暂无数据')
        return false
      }
      this.exportLoading = true
      let d = {
        page: this.page,
        pagesize: this.pageSize,
        type: 2,
        like: this.searchKey,
        timetype: this.timetype,
        starttime: this.starttime,
        endtime: this.endtime,
        isapply: this.isapply,
        isauditing: this.isauditing,
        isapprove: this.isapprove,
        ispayment: this.ispayment,
        merchantid: this.merchantid,
        exports: 'out',
        isdetail: 'out'
      }
      serverApi('/Finance/accountlist', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
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
    downLoadShData () {
      if (this.orderData.length < 1) {
        this.$Message.info('暂无数据')
        return false
      }
      // let para = {
      //   filename: this.shData.merchantname + '_' + this.shData.applyno,
      //   original: false
      // }
      // this.$refs.tableSh.exportCsv(para)
      this.downLoading = true
      let d = {
        id: this.shData.id,
        isout: '1'
      }
      serverApi('/Finance/auditororderlist', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            if (typeof(response.data.data) === 'string') {
              downloadFile(response.data.data)
            } else {
              this.$Message.warning('返回数据错误！')
            }
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.downLoading = false
        },
        error => {
          console.log(error)
          this.downLoading = false
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
      this.$Message.loading({
        content: '数据加载中...',
        duration: 0
      })
      let d = {
        id: row.id
      }
      serverApi('/Finance/auditororderlist', d,
        response => {
          // console.log(response)
          this.$Message.destroy()
          if (response.data.code === 0){
            this.orderData = response.data.data
            this.orderData.forEach(item => {
              item.total = (Number(item.total) + Number(item.settlementpostagefee)).toFixed(2)
            })
            this.shModal = true
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.$Message.destroy()
          this.$Message.warning(error.toString())
        }
      )
    },
    onClickSH (e) {
      if (e === 1) {
        this.passLoading = true
      } else if (e === 0) {
        this.refuseLoading = true
      }
      let d = {
        id: this.shData.id,
        auditing: e
      }
      serverApi('/Finance/auditor', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.$Message.success(response.data.msg)
            this.shModal = false
            this.getTableData()
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
    onSelectDate (e) {
      this.starttime = e[0]
      this.endtime = e[1]
    },
    onClickNotAllow () {
      this.passLoading = true
      this.$Modal.confirm({
        title: '提示',
        content: '<p>选中的申请将会<b style="color: #f44">不通过</b style="color: #f44">！！未选中的将会通过！</p>',
        onOk: () => {
          let arr = []
          this.selectTableItem.forEach(item => {
            arr.push(item.id)
          })
          let d = {
            ids: arr.toString(),
            auditing: '1',
            starttime: this.starttime,
            endtime: this.endtime
          }
          serverApi('/Finance/auditor', d,
            response => {
              console.log(response)
              if (response.data.code === 0){
                this.$Message.success(response.data.msg)
                this.getTableData()
              }else{
                this.$Message.warning(response.data.msg)
              }
              this.passLoading = false
              this.refuseLoading = false
            },
            error => {
              this.passLoading = false
              console.log(error)
              this.$Message.warning(error.toString())
              this.refuseLoading = false
              this.tableLoading = false
            }
          )
        },
        onCancel: () => {
          this.passLoading = false
        }
      })
    },
    onSelectTableItem (e) {
      this.selectTableItem = e
    },
    onClickDownLoadData (name) {
      if (this.tableData.length < 1) {
        this.$Message.info('暂无数据')
        return false
      }
      this.exportLoading = true
      let d = {
        page: this.page,
        pagesize: this.pageSize,
        type: 2,
        like: this.searchKey,
        timetype: this.timetype,
        starttime: this.starttime,
        endtime: this.endtime,
        isapply: this.isapply,
        isauditing: this.isauditing,
        isapprove: this.isapprove,
        ispayment: this.ispayment,
        merchantid: this.merchantid,
        exports: 'out',
        isdetail: name
      }
      serverApi('/Finance/accountlist', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
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
.sta-li{
  list-style: none;
  li{
    float: left;
    margin-right: 20px;
  }
}
</style>
