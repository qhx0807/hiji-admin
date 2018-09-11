<template>
  <div class="box">
    <Card :bordered="false">
      <Tabs value="name1" size="de">
        <TabPane label="首页Banner配置" name="name1">标签一的内容</TabPane>
        <TabPane label="ICON管理" name="name2">标签二的内容</TabPane>
        <TabPane label="内容模块" name="name3">标签三的内容</TabPane>
      </Tabs>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'IndexPage',
  data () {
    return {}
  },
  created () {},
  methods: {}
}
</script>
<style lang="less" scoped>

</style>
