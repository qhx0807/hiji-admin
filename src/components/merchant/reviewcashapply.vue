<template>
  <div class="box">
    <Card>
      <div class="head">
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
      </div>
      <Row>
        <Col span="24">
          <Tabs type="card" size="small" :animated="false">
            <TabPane label="全部">标签一的内容</TabPane>
            <TabPane :label="awaitReviewLabel">标签一的内容</TabPane>
            <TabPane label="已通过">标签二的内容</TabPane>
            <TabPane label="已拒绝">标签三的内容</TabPane>
            <TabPane label="已完成">标签三的内容</TabPane>
          </Tabs>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
export default {
  name: 'ReviewCashApply',
  data () {
    return {
      searchKey: '',
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
      }
    }
  },
  created () {},
  methods: {
    onClickSearch () {

    }
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
</style>


