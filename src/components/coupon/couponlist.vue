<template>
  <div class="box">
    <Card :bordered="false">
      <div class="head">
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Select v-model="isUse" style="width:200px" placeholder="是否对账">
          <Option value="0">全部</Option>
          <Option value="1">已使用</Option>
          <Option value="2">未使用</Option>
        </Select>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <!-- <Button type="primary" style="margin-left:8px" icon="md-add">发放</Button> -->
      </div>
    </Card>
    <Card :bordered="false" style="margin-top:10px">
      <Table :columns="columns" :data="tableData"></Table>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer show-elevator @on-page-size-change="onChangeSize"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'CouponList',
  data () {
    return {
      searchKey: '',
      pageSize: 10,
      page: 1,
      count: 0,
      tableData: [],
      isUse: '0',
      columns: [
        {
          title: '卡券编号',
          key: 'cardmainid',
          width: 90
        },
        {
          title: '卡券名称',
          key: 'cardname',
          minWidth: 120
        },
        {
          title: '用户',
          key: 'username',
          width: 120
        },
        {
          title: '卡券活动开始时间',
          key: 'cardsendtime',
          width: 140
        },
        {
          title: '领取时间',
          key: 'carddrawtime',
          width: 140
        },
        {
          title: '领取来源',
          key: 'orderno',
          minWidth: 160
        },
        {
          title: '卡券类型',
          key: 'typename',
          minWidth: 120
        },
        {
          title: '使用时间',
          key: 'usetime',
          width: 150
        },
        {
          title: '状态',
          key: 'carditemstate',
          width: 120,
          render: (h, params) => {
            let text = this.couponState[params.row.carditemstate].name
            return h('a', {}, text)
          }
        }
      ],
      couponState: [
        {name: '可用', value: '0'},
        {name: '已使用', value: '1'},
        {name: '已过期', value: '2'},
        {name: '失效', value: '3'},
      ]
    }
  },
  created () {
    this.getTableData()
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
    getTableData () {
      let d = {
        pagesize: this.pageSize,
        page: this.page,
        like: this.searchKey
      }
      this.$store.commit('pageLoading', true)
      serverApi('/card/cardall', d,
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
  }
}
</script>
<style lang="less" scoped>

</style>
