<template>
  <div class="box">
    <Card :bordered="false">
      <Select v-model="status" clearable style="width:200px;margin-bottom: 20px;" @on-change="statusTab">
        <Option v-for="item in cityList" :value="item.value" :key="item.value" >{{ item.label }}</Option>
      </Select>
      <Select v-model="merchantid" clearable filterable style="width:200px;margin-bottom: 20px;margin-left: 20px;" @on-change="userTab" @on-query-change="userList" placeholder="请选择商户名称">
        <Option v-for="item in userData" :value="item.id" :key="item.id">{{ item.name }}</Option>
      </Select>
      <div class="timeBox">
        <DatePicker type="datetime" style="width:200px;margin-bottom: 20px;"  @on-change="onStarttime" placeholder="选择开始时间"></DatePicker>
      </div>
      <div class="timeBox">
        <DatePicker type="datetime" style="width:200px;margin-bottom: 20px;"  @on-change="onEndtime" placeholder="选择结束时间"></DatePicker>
      </div>
      <div class="table-box">
        <Table border size="small" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
      </div>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-sizer show-total :page-size-opts="pageSizeOpts" :page-size="15" :current.sync="page" @on-page-size-change="onChangeSize" @on-change="changePage"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>
    <Modal v-model="shModal" width="1000" :fullscreen="true" :styles="{top: '50px'}">
      <p slot="header" style="text-align:center">
        <span>申请单号 {{shData.applyno}}</span>
      </p>
      <div>
        <Table border ref="tableSh" highlight-row size="small" height="600" :columns="columnsSH" :data="orderData"></Table>
      </div>
      <div slot="footer">
        <Button @click="shModal = false" v-if="downModSH">关闭</Button>
        <Button type="error" @click="dismissFinancial">驳回财务</Button>
        <Button type="info" @click="downLoadShData">下载数据</Button>
        <Button type="success" @click="shModal = false" v-if="downMod">确认修改</Button>
      </div>
    </Modal>
    <Modal v-model="xgModify" width="500" :styles="{top: '50px'}"
    @on-ok="downLoadxg()"
    @on-cancel="cancel">
      <p slot="header" style="text-align:center">
        <span>修改数据</span>
      </p>
       <Form :model="modData" :label-width="120" ref="from" :rules="rules">
        <FormItem label="平台优惠">
          <Input v-model="modData.coupon" prefix="ios-contact" placeholder="Enter name" style="width: auto" />
        </FormItem>
        <FormItem label="商家优惠">
          <Input v-model="modData.merchantcoupon" prefix="ios-contact" placeholder="Enter name" style="width: auto" />
        </FormItem>
        <FormItem label="扣点金额">
          <Input v-model="modData.pointsprice" prefix="ios-contact" placeholder="Enter name" style="width: auto" />
        </FormItem>
        <div slot="footer">
          <Button @click="xgModify = false">关闭</Button>
          <Button type="default" @click="downLoadShData">提交</Button>
        </div>
      </Form>
    </Modal>
    <Modal v-model="bhModify" width="1000" :styles="{top: '50px'}"
    @on-ok="downLoadbh()"
    @on-cancel="cancel"
    :loading="bhLoading">
      <p slot="header" style="text-align:center">
        <span>修改驳回数据</span>
      </p>
       <Form :model="bhData" v-for="(item,index) in bhData" :key="index" :label-width="120" ref="from" :rules="rules">
        <Row>
          <Col span="8">
            <FormItem label="平台优惠">
              <Input v-model="item.coupon" prefix="ios-contact" placeholder="Enter name" style="width: auto" />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="商家优惠">
              <Input v-model="item.merchantcoupon" prefix="ios-contact" placeholder="Enter name" style="width: auto" />
            </FormItem>
            </Col>
          <Col span="8">
            <FormItem label="扣点金额">
              <Input v-model="item.pointsprice" prefix="ios-contact" placeholder="Enter name" style="width: auto" />
            </FormItem>
           </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'FinanceReject',
  data () {
    return {
      tableLoading: false,
      bhLoading: false,
      xgModify: false,
      bhModify: false,
      downMod: false,
      downModSH: true,
      page: 1,
      pagesize: 20,
      count: 0,
      like: '',
      changetype: '',
      starttime: '',
      endtime: '',
      financialid: '',
      tableData: [],
      modData: {},
      bhData: [],
      userData: [],
      pageSizeOpts: [10, 15, 25, 50, 70, 100, 200],
      status: 3,
      idx: '',
      oldidx: '',
      ordernox: '',
      orderidx: '',
      statustype: '',
      merchantid: '',
      cityList: [{
        value: 1,
        label: '已处理'
      },
      {
        value: 2,
        label: '未处理'
      },
      {
        value: 3,
        label: '全部'
      }],
      columns: [
        {
          title: '#',
          key: 'id',
          width: 80
        },
        {
          title: '原提现单ID',
          key: 'oldid',
          width: 100
        },
        {
          title: '商户',
          key: 'merchantname',
          width: 130
        },
        {
          title: '申请时间',
          key: 'applytime',
          width: 130
        },
        {
          title: '申请单号',
          key: 'applyno',
          width: 160
        },
        {
          title: '总金额',
          key: 'total',
          align: 'right',
          width: 100
        },
        {
          title: '实付金额',
          key: 'cash',
          align: 'right',
          width: 100
        },
        {
          title: '平台优惠',
          key: 'coupon',
          align: 'right',
          width: 100
        },
        {
          title: '补贴金额',
          key: 'subsidy',
          align: 'right',
          width: 100
        },
        {
          title: '商户优惠',
          key: 'merchantcoupon',
          align: 'right',
          width: 100
        },
        {
          title: '扣点金额',
          key: 'point',
          align: 'right',
          width: 100
        },
        {
          title: '驳回时间',
          key: 'rejecttime',
          width: 130
        },
        {
          title: '驳回理由',
          key: 'rejectmsg',
          width: 130
        },
        {
          title: '驳回人',
          key: 'isreject',
          width: 130
        },
        {
          title: '状态',
          key: 'status',
          width: 80,
          render: (h, params) => {
            if (params.row.status === '已处理') {
              return h('p',{
                style: {
                  color: '#00dd00',
                }
              }, params.row.status)
            } else {
              return h('p', {
                style: {
                  color: 'red',
                }
              }, params.row.status)
            }
          }
        },
        {
          title: '查看',
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
      columnsSH: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '类型',
          key: 'type',
          width: 90,
        },
        // {
        //   title: '设备号',
        //   key: 'equipmentno',
        //   width: 90,
        //   tooltip: true,
        // },
        {
          title: '订单号',
          key: 'orderno',
          width: 140,
        },
        {
          title: '流水号',
          key: 'transaction_id',
          width: 140,
        },
        {
          title: '支付金额',
          key: 'cash',
          width: 110,
          align: 'right',
          sortable: true
        },
        {
          title: '平台优惠',
          key: 'coupon',
          width: 110,
          align: 'right',
          sortable: true
        },
        {
          title: '订单优惠',
          key: 'subsidy',
          width: 110,
          align: 'right',
          sortable: true
        },
        {
          title: '商家优惠',
          key: 'merchantcoupon',
          width: 110,
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
          title: '应收',
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
          title: '支付',
          key: 'paytypename',
          width: 80,
        },
        {
          title: '时间',
          key: 'createtime',
          width: 150,
        },
        {
          title: '操作',
          key: 'id',
          fixed: 'right',
          width: 80,
          align: 'center',
          render: (h, params) => {
            if (this.changetype === 1) {
              if (this.statustype === '未处理') {
                let xg = h('a', {
              on: {
                click: () => {
                  this.onClickModify(params.row)
                }
              }
            }, '修改')
            return xg
              }
            }

          }
        }
      ],
      shData: {},
      isloading: false,
      orderData: [],
      shModal: false
    }
  },
  created () {
    this.getTableData()
    // this.getUserData()
  },
  methods: {
    getTableData () {
      this.tableLoading = true
      this.isloading = true
      let d = {
        page: this.page,
        pagesize: this.pagesize,
        status: this.status,
        merchantid: this.merchantid,
        endtime : this.endtime,
        starttime: this.starttime
      }
      serverApi('/finance/rejectlist', d,
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.tableData = response.data.data.result
            this.count = response.data.data.counts
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.tableLoading = false
          this.isloading = false
        },
        error => {
          console.log(error)
          this.tableLoading = false
          this.isloading = false
          this.$Message.error(error.toString())
        }
      )
    },
    changePage (e) {
      console.log(e)
      this.getTableData()
    },
    onChangeSize (e) {
      this.pagesize = e
      this.getTableData()
    },
    onClickReview (row) {
      console.log(row)
      this.changetype = row.changetype
      this.statustype = row.status
      this.financialid = row.id
      if (this.changetype ===1 && this.statustype==='未处理') {
        this.downMod = true
        this.downModSH = false
      } else {
        this.downMod = false
        this.downModSH = true
      }
      this.idx = row.id
      this.oldidx = row.oldid
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
    onClickModify (row) {
      console.log(row)
      this.modData = row
      this.bhLoading = true
      this.ordernox = row.orderno
      this.orderidx = row.orderid
      if (row.orderid == 0) {
        this.xgModify = true
      } else {
        this.bhModify = true
        serverApi('/finance/rejectlistinfo', {orderid: row.orderid},
          response => {
            console.log(response)
            if (response.data.code === 0){
              this.bhData = response.data.data
              this.bhLoading = false
            }else{
              this.bhLoading = false
              this.$Message.warning(response.data.msg)
            }
          },
          error => {
            console.log(error)
            this.$Message.destroy()
            this.$Message.warning(error.toString())
          }
        )
      }
    },
    downLoadbh () {
      this.bhLoading = true
      let orderdata = []
      for (var i = 0; i < this.bhData.length; i++){
        this.bhData[i].orderid = this.orderidx
      }
      console.log(this.bhData)
      orderdata = JSON.stringify(this.bhData)
      serverApi('/finance/operationupdate', {
        id: this.idx,
        oldid: this.oldidx,
        orderdata: orderdata
      },
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.$Message.success(response.data.msg)
            this.bhLoading = false
          }else{
            this.bhLoading = false
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.bhLoading = false
          this.$Message.destroy()
          this.$Message.warning(error.toString())
        }
      )
    },
    downLoadxg () {
      let arrXg = []
      let arr = {
        coupon: this.modData.coupon,
        merchantcoupon: this.modData.merchantcoupon,
        pointsprice: this.modData.pointsprice,
        orderno: this.ordernox,
        orderid: this.orderidx
      }
      arrXg.push(arr)
      serverApi('/finance/operationupdate', {
        id: this.idx,
        oldid: this.oldidx,
        orderdata: JSON.stringify(arrXg)
      },
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.$Message.success(response.data.msg)
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
      let para = {
        filename: this.shData.merchantname + '_' + this.shData.applyno,
        original: false
      }
      this.$refs.tableSh.exportCsv(para)
    },
    statusTab (e) {
      console.log(e)
      this.status = e
      this.getTableData()
    },
    userTab (e) {
      console.log(e)
      this.merchantid = e
      this.getTableData()
    },
    onStarttime (e) {
      this.starttime = e
      this.getTableData()
    },
    onEndtime (e) {
      this.endtime = e
      this.getTableData()
    },
    userList (e) {
      console.log(e)
      this.like = e
      this.getUserData()
    },
    getUserData (page, size, key) {
      let d = {
        pagesize: 999,
        page: this.page,
        like: '',
        userid: sessionStorage.userid
      }
      this.$store.commit('pageLoading', true)
      serverApi('/Merchant/index', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.userData = response.data.data.result
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.$store.commit('pageLoading', false)
        },
        error => {
          console.log(error)
          this.$store.commit('pageLoading', false)
          this.$Message.error('连接失败！')
        }
      )
    },
    dismissFinancial () {
      let d = {
        id: this.financialid
      }
      this.$store.commit('pageLoading', true)
      serverApi('/finance/operationupdate', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.$Message.success(response.data.msg)
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.$store.commit('pageLoading', false)
        },
        error => {
          console.log(error)
          this.$store.commit('pageLoading', false)
          this.$Message.error(error.toString())
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
  .timeBox {
    display: inline-block;
    // width: 100%;
    margin-left:20px;
    box-sizing: border-box;
    vertical-align: middle;
    color: #515a6e;
    font-size: 14px;
    line-height: normal;
  }
</style>
