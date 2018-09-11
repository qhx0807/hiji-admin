<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="tips">
        <p style="font-size:14px;">
          <img src="http://cdn.cqyyy.cn/PREVIEW.svg" alt="">
          首页板块配置。
          <router-link :to="{name: 'ModulesAdd'}"><Icon size="14" type="md-add" />新建板块</router-link>
        </p>
      </div>
    </Card>
    <Card :bordered="false">
      <div class="table-box">
        <Table size="small" :columns="columns" :data="tableData"></Table>
      </div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'Modules',
  data () {
    return {
      tableData: [],
      columns: []
    }
  },
  created () {},
  methods: {
    getModules () {
      this.$store.commit('pageLoading', true)
      serverApi('/area/index', {},
        response => {
          if (response.data.code === 0){
            this.tableData = response.data.data
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
.tips{
    p{
      img{
        vertical-align: bottom;
      }
    }
  }
</style>
