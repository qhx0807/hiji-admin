<template>
  <div class="home">
    <Row>
      <Col span="24">
        <Input style="width:250px" v-model="pathurl"></Input>
        <Button :loading="loading" style="margin-left:12px" @click="getTableData" type="primary">测试接口</Button>
      </Col>
      <Col span="24">
        <Input type="textarea" :rows="10" style="margin-top:12px" v-model="text"></Input>
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
      loading: false,
      pathurl: '/index/index'
    }
  },
  created () {},
  methods: {
    getTableData () {
      this.loading = true
      serverApi(this.pathurl, '',
        response => {
          console.log(response)
          this.loading = false
          this.text = JSON.stringify(response.data)
        },
        error => {
          this.loading = false
          console.log(error)
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>

</style>
