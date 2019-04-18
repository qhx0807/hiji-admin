<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <div class="tips">
        <p style="font-size:14px;">
          <img src="http://cdn.cqyyy.cn/PREVIEW.svg" alt="">
          菜单下按钮维护，新增修改删除。
        </p>
      </div>
    </Card>
    <Card :bordered="false" >
      123
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'Buttons',
  data () {
    return {}
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
