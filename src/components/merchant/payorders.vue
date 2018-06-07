<template>
  <div class="box">
    <Card>
      <Row>
        <Col span="24" style="padding-bottom:12px">
          <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
          <DatePicker type="daterange" placeholder="日期范围" @on-change="onSelectDate" style="width: 220px"></DatePicker>
          <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        </Col>
      </Row>
      <Table size="small" :columns="columns1" :data="tableData"></Table>
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
          key: 'name',
          width: 250
        },
        {
          title: '设备号',
          key: 'device_info'
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
        starttime: this.starttime,
        endtime: this.endtime,
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
        starttime: this.starttime,
        endtime: this.endtime,
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
