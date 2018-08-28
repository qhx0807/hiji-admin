<template>
  <div class="box">
    <Card :bordered="false">
      <Input v-model="searchKey" placeholder="关键字搜索..." style="width: 200px"></Input>
      <DatePicker :options="dateOptions" type="daterange" placeholder="日期范围" @on-change="onSelectDate" style="width: 220px"></DatePicker>
      <Button type="primary" :loading="tableLoading" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
      <Button type="primary" style="margin-left:8px" @click="goBackFinace" icon="ios-arrow-back">返回</Button>
      <Button type="primary" :loading="exportLoading" style="margin-left:8px; float:right" @click="exportTable" icon="md-arrow-down">导出数据</Button>
    </Card>
    <Card :bordered="false" style="margin-top:10px">
      <Table border ref="table" highlight-row :loading="tableLoading" size="small" height="600" :columns="columns" :data="tableData"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
            <Page :total="counts" show-sizer show-total :page-size-opts="pageSizeOpts" :page-size="15" :current="page" @on-page-size-change="onChangeSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal v-model="shModal" width="460">
      <p slot="header" style="color:#f60;">
        <Icon type="ios-information-circle"></Icon>
        <span>提示</span>
      </p>
      <div style="">
        <p style="margin-bottom:10px">对此订单审核？</p>
        <p>订单号：{{shData.orderno}}</p>
        <p>流水号：{{shData.transaction_id}}</p>
        <p>订单金额: {{shData.total}} &nbsp;&nbsp;支付金额: {{shData.cash}} &nbsp;&nbsp;平台优惠: {{shData.coupon}}
          &nbsp;&nbsp;商家优惠: {{shData.merchantcoupon}}
        </p>
        <table class="table" v-show="shOrderList.length>0">
          <thead>
            <tr>
              <th>商品id</th>
              <th>商品</th>
              <th>数量</th>
              <th>市场价</th>
              <th>会员价</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in shOrderList" :key="index">
              <td>{{item.goodsid}}</td>
              <td class="goodsInfo">
                <img :src="item.goodsimg" alt="">
                <span>{{item.goodsname}}</span>
              </td>
              <td>{{item.goodsnum}}</td>
              <td>{{item.marketprice}}</td>
              <td>{{item.memberprice}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div slot="footer">
        <Button @click="shModal = false">取消</Button>
        <Button type="error" :loading="refuseLoading" @click="onClickSH(0)">不通过</Button>
        <Button type="primary" :loading="passLoading" @click="onClickSH(1)">确认对账</Button>
      </div>
    </Modal>
    <div slot="popTip">
      123
    </div>
  </div>
</template>
<script>
import serverApi from '../../axios'
import exportExcel from  '../../utlis/table2excel.js'
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
      counts: 0,
      page: 1,
      pageSize: 15,
      pageSizeOpts: [10, 15, 25, 50, 70, 100, 200],
      tableData: [],
      shData: {},
      shOrderList: [],
      columns: [
        {
          type: 'index',
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
          title: '类型',
          key: 'type',
          width: 90,
          render: (h, params) => {
            let text = ''
            switch (params.row.type) {
              case 0:
                text = ''
                break
              case 1:
                text = ''
                break
              case 2:
                text = ''
                break
              case 2:
                text = ''
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
                    borderBottom: '1px solid #e8eaec'
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
      ]
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
      this.getTableData()
    },
    getTableData () {
      this.tableLoading = true
      let d = {
        page: this.page,
        pagesize: this.pageSize,
      }
      serverApi('/Finance/orderlist', d,
        response => {
          // console.log(response)
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
    goBackFinace () {
      this.$router.push({name: 'FinaceTable', original: false})
    },
    exportTable () {
      if (this.tableData.length < 1) {
        this.$Message.info('暂无数据')
        return false
      }
      this.exportLoading = true
      exportExcel(this.tableData, "data")
      this.exportLoading = false
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
      this.shOrderList = row.orderlist
      console.log(row)
      this.shModal = true
    },
    onClickSH (e) {
      if (e === 1) {
        this.passLoading = true
      } else if (e === 0) {
        this.refuseLoading = true
      }
      let d = {
        orderno: this.shData.orderno,
        check: e
      }
      serverApi('/Finance/operation', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.$Message.warning(response.data.msg)
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
  white-space:nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  img{
    height: 30px;
    width: 30px;
    vertical-align: bottom;
  }
  span{
    vertical-align: bottom;
  }
}
</style>
