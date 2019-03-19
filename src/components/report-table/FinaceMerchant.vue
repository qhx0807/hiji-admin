<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
        <Form :label-width="70">
          <Row>
          <Col span="4">
            <FormItem label="模糊搜索" style="margin-bottom:0">
              <Input type="text" v-model="searchObj.like" placeholder="搜索..." clearable></Input>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="申请状态" style="margin-bottom:0">
              <Select v-model="searchObj.isapply" placeholder="申请状态" clearable>
                <Option value="9">全部</Option>
                <Option value="1">已申请</Option>
                <Option value="0">未申请</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="财务会计审核状态" style="margin-bottom:0">
              <Select v-model="searchObj.isauditing" placeholder="财务会计审核状态" clearable>
                <Option value="9">全部</Option>
                <Option value="1">已审核</Option>
                <Option value="0">未审核</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="财务总监审批状态" style="margin-bottom:0">
              <Select v-model="searchObj.isapprove" clearable placeholder="财务总监审批状态">
                <Option value="9">全部</Option>
                <Option value="1">已审批</Option>
                <Option value="0">未审批</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="财务出纳打款状态" style="margin-bottom:0">
              <Select v-model="searchObj.ispayment" clearable placeholder="财务出纳打款状态">
                <Option value="9">全部</Option>
                <Option value="1">已打款</Option>
                <Option value="0">未打款</Option>
              </Select>
            </FormItem>
          </Col>
          </Row>
          <Row>
            <Col span="4">
              <FormItem label="时间条件" style="margin-bottom:0">
                <Select v-model="searchObj.timetype" clearable placeholder="选择时间条件">
                  <Option v-for="(item, index) in timeTypeList" :key="index" :value="item.value">{{item.name}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="4">
              <FormItem label="日期范围" style="margin-bottom:0">
                <DatePicker :options="dateOptions" type="daterange" placeholder="日期范围" @on-change="onSelectDate" ></DatePicker>
              </FormItem>
            </Col>
            <Col span="10">
              <FormItem style="margin-bottom:0">
                <Button type="primary" :loading="tableLoading" icon="ios-search" @click="onClickSearch">搜索</Button>
                <Dropdown style="margin-left: 8px" @on-click="onClickDownLoadData">
                  <Button type="primary">
                      下载数据
                      <Icon type="ios-arrow-down"></Icon>
                  </Button>
                  <DropdownMenu slot="list">
                      <DropdownItem name="" divided>导出数据</DropdownItem>
                      <DropdownItem name="out" divided>导出详细数据</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </FormItem>
            </Col>
          </Row>
        </Form>
    </Card>
    <Card :bordered="false">
      <Table border ref="table" highlight-row @on-selection-change="onSelectTableItem" :loading="tableLoading" size="small"  :columns="columns" :data="tableData"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="counts" show-sizer show-total :page-size-opts="pageSizeOpts" :page-size="10" :current.sync="page" @on-page-size-change="onChangeSize" @on-change="changePage"></Page>
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
        <Button @click="shModal = false">关闭</Button>
        <Button type="default" :loading="downLoading" @click="downLoadShData">下载数据</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { downloadFile } from '../../utlis/tools.js'
export default {
  name: 'FinaceMerchant',
  data () {
    return {
      tableLoading: false,
      exportLoading: false,
      downLoading: false,
      shModal: false,
      pageSizeOpts: [10, 15, 25, 50, 70, 100, 200],
      searchObj: {
        page: 1,
        pagesize: 10,
        type: 2,
        like: '',
        timetype: '',
        starttime: '',
        endtime: '',
        isapply: '',
        isauditing: '',
        isapprove: '',
        ispayment: '',
      },
      counts: 0,
      timeTypeList: [
        {value: 'applytime', name: '申请时间'},
        {value: 'auditingtime', name: '财务审核时间'},
        {value: 'paymenttime', name: '付款时间'},
        {value: 'approvetime', name: '审批时间'},
        {value: 'receivablestime', name: '收款时间'}
      ],
      columns: [
        {
          title: '商户',
          key: 'name',
          width: 140,
          tooltip: true
        },
        // {
        //   title: '设备号id',
        //   key: 'equipmentid',
        //   width: 90,
        //   tooltip: true
        // },
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
        // {
        //   title: '剩余提现金额',
        //   key: 'merchantsurplus',
        //   width: 140,
        //   sortable: true,
        //   align: 'right'
        // },
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
          key: 'pointsprice',
          width: 110,
          sortable: true,
          align: 'right'
        },
        {
          title: '领导审批时间',
          key: 'approvetime',
          width: 130
        },
        {
          title: '申请时间',
          key: 'applytime',
          width: 130
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
        // {
        //   title: '扣点',
        //   key: 'points',
        //   minWidth: 110,
        // },
        {
          title: '详细',
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
            }, '查看')
            return sh
          }
        }
      ],
      orderData: [],
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
      shData: {},
    }
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
  created () {
    this.getTableData()
  },
  methods: {
    onClickSearch () {
      this.searchObj.page = 1
      this.getTableData()
    },
    onSelectDate (e) {
      this.searchObj.starttime = e[0]
      this.searchObj.endtime = e[1]
    },
    changePage (e) {
      this.searchObj.page = e
      this.getTableData()
    },
    onChangeSize (e) {
      this.searchObj.pagesize = e
      this.getTableData()
    },
    getTableData () {
      this.tableLoading = true
      serverApi('/Finance/commercialcaselist', this.searchObj,
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
    onClickDownLoadData (name) {
      if (this.tableData.length < 1) {
        this.$Message.info('暂无数据')
        return false
      }
      this.exportLoading = true
      let d = Object.assign({}, this.searchObj)
      d.exports = 'out'
      d.isdetail = name
      serverApi('/Finance/commercialcaselist', d,
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
    downLoadShData () {
      if (this.orderData.length < 1) {
        this.$Message.info('暂无数据')
        return false
      }
      // let para = {
      //   filename: this.shData.name + '_' + this.shData.applyno,
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
  }
}
</script>
<style lang="less" scoped>
  .sta-li{
    list-style: none;
    li{
      float: left;
      margin-right: 20px;
    }
  }
</style>
