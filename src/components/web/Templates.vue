<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="tips">
        <p style="font-size:14px;">
          <img src="http://cdn.cqyyy.cn/PREVIEW.svg" alt="">
          模板页面活动页管理。
          <router-link :to="{name: 'TemplatesAdd'}"><Icon size="14" type="md-add" />新建模板页</router-link>
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
  name: 'Templates',
  data () {
    return {
      tableData: [],
      columns: []
    }
  },
  created () {},
  methods: {}
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
