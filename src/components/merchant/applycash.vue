<template>
  <div class="box">
    <Card>
      <div class="head">
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
      </div>
      <Row>
        <Col span="24">

        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
export default {
  name: 'ApplyCash',
  data () {
    return {
      searchKey: ''
    }
  },
  created () {},
  methods: {
    onClickSearch () {

    }
  }
}
</script>
<style lang="less" scoped>
.head{
  padding-bottom: 16px;
}
</style>

