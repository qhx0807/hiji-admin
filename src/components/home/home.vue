<template>
  <div class="home">
    <Row>
      <Col span="24">
        <Button :loading="loading" @click="getTableData" type="info">测试接口-存储过程获取数据</Button>
        &nbsp;
        <code>POST: /api/find</code>
        <Input type="textarea"  :rows="10" style="margin-top:12px" v-model="text"></Input>
      </Col>
    </Row>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'Home',
  data () {
    return {
      text: '',
      loading: false
    }
  },
  created () {},
  methods: {
    getTableData () {
      this.loading = true
      serverApi('/api/find', '',
        response => {
          this.loading = false
          this.text = JSON.stringify(response.data)
        },
        error => {
          this.loading = false
          console.log(error)
        }
      )
    },
  }
}
</script>
<style lang="less" scoped>

</style>
