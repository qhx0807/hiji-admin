<template>
  <div class="box">
    <Card>
      <div class="head">
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
      </div>
      <Row>
        <Col span="24">
          ApplyCash
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'ApplyCash',
  data () {
    return {
      searchKey: '',
      text: ''
    }
  },
  created () {
    // this.getTableData()
  },
  methods: {
    onClickSearch () {

    },
    getTableData () {
      serverApi('/api/find', '',
        response => {
          console.log(response)
          this.text = JSON.stringify(response)
        },
        error => {
          console.log(error)
        }
      )
    },
  }
}
</script>
<style lang="less" scoped>
.head{
  padding-bottom: 16px;
}
</style>

