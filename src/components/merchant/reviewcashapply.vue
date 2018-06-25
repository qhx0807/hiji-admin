<template>
  <div class="box">
    <Card :bordered="false" v-show="isList">
      <div class="head">
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
      </div>
      <Row>
        <Col span="24">
          <Tabs type="card" size="small" @on-click="onClickTabItem" :animated="false">
            <TabPane label="全部"></TabPane>
            <TabPane :label="awaitReviewLabel"></TabPane>
            <!-- <TabPane label="已通过"></TabPane> -->
            <TabPane label="已拒绝"></TabPane>
            <TabPane label="已完成"></TabPane>
          </Tabs>
        </Col>
        <Col span="24">
          <Table :columns="columns" :loading="tableLoading" :border="false" :data="tableData"></Table>
          <div style="float: right; padding-top:12px">
            <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
          </div>
        </Col>
      </Row>
    </Card>
    <div v-show="!isList">
      <Card :bordered="false">
        <div class="tips">
          <h4>提现申请详细信息</h4>
          <p>blablablablablablablablablablablablablablablablablabla</p>
        </div>
      </Card>
      <Card :bordered="false" style="margin-top: 10px">
        <Row>
          <Col span="24">
            <Steps :current="stepNum" style="max-width:880px; margin:20px auto 0 auto">
              <Step title="查看信息" content="这里是该步骤的描述信息"></Step>
              <Step title="确认信息" content="这里是该步骤的描述信息"></Step>
              <Step title="完成" content="这里是该步骤的描述信息"></Step>
            </Steps>
          </Col>
          <Col span="24">
            <div class="review-info">

            </div>
          </Col>
        </Row>
      </Card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ReviewCashApply',
  data () {
    return {
      searchKey: '',
      count: 0,
      page: 1,
      pageSize: 10,
      isList: true,
      stepNum: 0,
      awaitReviewLabel: (h) => {
        return h('div', [
          h('span', '待审核'),
          h('Badge', {
            props: {
              count: 100,
              overflowCount: 99,
              className: 'await'
            }
          })
        ])
      },
      tableData: [
        {
            name: 'John Brown',
            age: 18,
            address: 'New York No. 1 Lake Park',
            date: '2016-10-03'
        },
        {
            name: 'Jim Green',
            age: 24,
            address: 'London No. 1 Lake Park',
            date: '2016-10-01'
        },
        {
            name: 'Joe Black',
            age: 30,
            address: 'Sydney No. 1 Lake Park',
            date: '2016-10-02'
        },
        {
            name: 'Jon Snow',
            age: 26,
            address: 'Ottawa No. 2 Lake Park',
            date: '2016-10-04'
        }
      ],
      columns: [
        {
            title: 'Name',
            key: 'name'
        },
        {
            title: 'Age',
            key: 'age'
        },
        {
            title: 'Address',
            key: 'address'
        }
      ],
      tableLoading: false,
    }
  },
  created () {},
  methods: {
    onClickSearch () {

    },
    onClickTabItem (name) {
      // alert(name)
      // this.tableLoading = true
    },
    changePage (e) {
      this.page = e
      // this.getTableData(e, this.pageSize)
    },
    onChangeSize (e) {
      this.pageSize = e
      // this.getTableData(this.page, e)
    },
  }
}
</script>
<style lang="less">
.head{
  padding-bottom: 16px;
}
.await{
  background: #f60 !important;
  margin-left: 4px;
}
.tips {
  h4{
    font-size: 14px;
    margin-top: 4px;
  }
  p{
    font-size: 12px;
    margin-top: 10px;
  }
}
.review-info{
  max-width: 650px;
  margin: 0 auto;
  padding-top: 40px;
}
</style>


