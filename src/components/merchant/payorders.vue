<template>
  <div class="box">
    <Card>
      <Row>
        <Col span="24" style="padding-bottom:12px">
          <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
          <DatePicker :options="dateOptions" type="daterange" placeholder="日期范围" @on-change="onSelectDate" style="width: 220px"></DatePicker>
          <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        </Col>
      </Row>
      <Table size="small" :columns="columns1" :data="tableData">
        <div slot="footer"></div>
      </Table>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
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
      pageSize: 10,
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
          key: 'name'
        },
        {
          title: '设备号',
          key: 'device_info',
          minWidth: 200,
        },
        {
          title: '微信交易流水',
          key: 'transaction_id',
          width: 250
        },
        {
          title: '支付金额',
          key: 'total_fee',
          width: 100
        },
        {
          title: '创建时间',
          key: 'createtime',
          width: 160
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
    }
  },
  created () {
    this.getTableData(1, 10)
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
    }
  }
}
</script>

<style lang="less" scoped>

</style>
