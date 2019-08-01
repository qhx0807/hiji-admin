<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Input placeholder="搜索..." style="width: 242px" v-model="serkeys"></Input>
      <Button type="primary" icon="md-search" style="margin-left: 10px" @click="getTemplate">搜索</Button>
      <Button type="primary" icon="md-add" style="margin-left: 10px" @click="addModal = true">新增</Button>
    </Card>
    <Card :bordered="false"></Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'DesignImageBase',
  data () {
    return {
      serkeys: '',
      addModal: false
    }
  },
  computed: {
    citylist () {
      return this.$store.state.cityList
    },
    cityValues () {
      let arr = []
      this.citylist.forEach(item => {
        arr.push(item.value)
      })
      return arr
    },
    linkTypeList () {
      return this.$store.state.actionTypeArr
    }
  },
  created () {},
  methods: {
    getTemplate () {

    }
  }
}
</script>
<style lang="less" scoped>

</style>
