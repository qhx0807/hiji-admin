<template>
  <div class="box">
    <Card :bordered="false">
      <Row>
        <Col span="24" style="padding-bottom:12px">
          <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
          <DatePicker :options="dateOptions" type="daterange" placeholder="日期范围" @on-change="onSelectDate" style="width: 220px"></DatePicker>
          <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
          <Button type="primary" style="margin-left:8px" v-if="isAdmin" icon="checkmark" @click="onClickCheckBill">对账</Button>
        </Col>
      </Row>
      <Table size="small" :columns="columns1" :data="tableData">
      </Table>
      <div style="float: right; padding-top:12px">
        <Page :page-size-opts="pageSizeOpts" :page-size="pageSize" :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>
    <BackTop></BackTop>
  </div>
</template>

<script>
import serverApi from '../../axios'
export default {
  name: 'PayOrders',
  data () {
    return {
      tableData: [],
      searchKey: '',
      count: 0,
      page: 1,
      pageSize: 15,
      starttime: '',
      endtime: '',
      columns1: [
        {
          title: '序号',
          type: 'index',
          width: 80
        },
        {
          title: '订单号',
          key: 'orderno',
          width: 180
        },
        {
          title: '商户',
          key: 'name',
          minWidth: 140
        },
        {
          title: '设备号',
          key: 'device_info',
          minWidth: 160,
        },
        {
          title: '交易流水',
          key: 'transaction_id',
          width: 250
        },
        {
          title: '应收',
          key: 'total_fee',
          width: 120,
          align: 'center',
          render: (h, params) => {
            return h('div', {
              style: {
                color: '#f90',
                fontSize: '14px',
                fontWeight: '600'
              }
            }, `+ ${params.row.total_fee}`)
          }
        },
        {
          title: '补贴',
          key: 'subsidy',
          width: 70,
          align: 'center'
        },
        {
          title: '优惠',
          key: 'coupon_fee',
          width: 70,
          align: 'center'
        },
        {
          title: '实收',
          key: 'cash_fee',
          width: 70,
          align: 'center'
        },
        {
          title: '支付方式',
          key: 'paytype',
          width: 90
        },
        {
          title: '创建时间',
          key: 'createtime',
          width: 160
        },
        {
          title: '对账',
          key: 'id',
          fixed: 'right',
          width: 100,
          render: (h, params) => {
            if (params.row.ischeck == 0) {
              return h('a', {style: {color: '#f90'}}, '未对账')
            } else if (params.row.ischeck == 1) {
              return h('a', {style: {color: '#19be6b'}}, '已对账')
            } else {
              return h('a', {style: {color: '#ed3f14'}}, '对账错误')
            }
          }
        }
      ],
      dateOptions: {
        shortcuts: [
          {
            text: '最近一周',
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              return [start, end]
            }
          },
          {
            text: '最近一月',
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              return [start, end]
            }
          },
          {
            text: '最近三月',
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              return [start, end]
            }
          }
        ]
      },
      pageSizeOpts: [15, 20, 30]
    }
  },
  created () {
    this.getTableData(1, 15)
  },
  computed: {
    isAdmin () {
      if (sessionStorage.username == 'admin' && sessionStorage.userid == '1') {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    getTableData (page, size) {
      this.$store.commit('pageLoading', true)
      let d = {
        pagesize: size,
        page: page,
        datefrom: this.starttime,
        dateto: this.endtime,
        like: this.searchKey,
        userid: sessionStorage.userid
      }
      serverApi('/Depar/salenolist', d,
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
          this.$Message.error('网络错误，请重试！')
          this.$store.commit('pageLoading', false)
        }
      )
    },
    changePage (e) {
      this.page = e
      this.getTableData(e, this.pageSize)
    },
    onChangeSize (e) {
      this.pageSize = e
      this.getTableData(this.page, e)
    },
    onSelectDate (e) {
      this.starttime = e[0]
      this.endtime = e[1]
    },
    onClickSearch () {
      let d = {
        pagesize: this.pageSize,
        page: this.page,
        datefrom: this.starttime,
        dateto: this.endtime,
        like: this.searchKey,
        userid: sessionStorage.userid
      }
      this.$store.commit('pageLoading', true)
      serverApi('/Depar/salenolist', d,
        response => {
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
          this.$store.commit('pageLoading', false)
        }
      )
    },
    onClickCheckBill () {
      this.$Modal.confirm({
        title: '提示',
        content: '将昨日订单进行对账操作！',
        onOk: () => {
          let tTime = new Date().getTime()
          let yTime = tTime - (24*60*60*1000)
          let a = new Date(yTime)
          let y = a.getFullYear()
          let m = a.getMonth() + 1
          let s = a.getDate()

          let n = m > 9 ? m : '0'+m
          let z = s > 9 ? s : '0'+s

          let d = {
            date: y+''+n+''+z
          }
          serverApi('/equipment/download', d,
            response => {
              console.log(response)
              if (response.data.code === 0){
                this.$Message.info(response.data.msg)
              }else{
                this.$Message.warning(response.data.msg)
              }
            },
            error => {
              console.log(error)
              this.$Message.error('网络错误，请重试！')
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
