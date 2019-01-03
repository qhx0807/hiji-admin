<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Input v-model="searchKey" placeholder="搜索..." style="width: 230px" />
      <Button type="primary" icon="md-add" style="margin-left:12px" @click="onClickAdd">新增</Button>
    </Card>
    <Card :bordered="false">
      <Table :loading="tableLoading" :columns="columns" height="560" :data="tableData"></Table>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'InvitePrize',
  data () {
    return {
      searchKey: '',
      tableLoading: false,
      tableData: [],
      columns: [
        {
          title: '#',
          key: 'id'
        },
        {
          title: '城市',
          key: 'city'
        }
      ]
    }
  },
  created () {
    this.getTableData()
  },
  computed: {
    inviteTypeArr () {
      return this.$store.state.inviteTypeArr
    }
  },
  methods: {
    getTableData () {
      let d = {}
      this.tableLoading = true
      serverApi('/activity/inviteindex', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.tableData = response.data.data.result
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.tableLoading = false
        },
        error => {
          console.log(error)
          this.tableLoading = false
          this.$Message.error(error.toString())
        }
      )
    },
    onClickAdd () {

    }
  }
}
</script>
<style lang="less" scoped>

</style>
