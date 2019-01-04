<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Input v-model="searchKey" placeholder="搜索..." style="width: 230px" />
      <Button type="primary" icon="md-add" style="margin-left:12px" @click="onClickAdd">新增</Button>
    </Card>
    <Card :bordered="false">
      <Table :loading="tableLoading" :columns="columns" height="560" :data="tableData"></Table>
    </Card>

    <Modal v-model="addModal" width="850">
      <p slot="header" style="text-align:center">
        <span>添加规则</span>
      </p>
      <Form :model="addData" ref="form" :rules="rules" :label-width="100">

      </Form>
      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="onSaveEdit">保存</Button>
      </div>
    </Modal>
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
      addModal: false,
      modal_loading: false,
      tableData: [],
      columns: [
        {
          title: '#',
          key: 'id'
        },
        {
          title: '城市',
          key: 'cityid'
        },
        {
          title: '邀请人数',
          key: 'invitemsg',
          render: (h, params) => {
            return h('span', {}, params.row.invitemsg.invitenum)
          }
        },
        {
          title: '奖励对象',
          key: 'invitemsg',
          render: (h, params) => {
            return h('span', {}, params.row.invitemsg.invitetype)
          }
        },
        {
          title: '奖励类型',
          key: 'invitemsg',
          render: (h, params) => {
            return h('span', {}, params.row.invitemsg.type)
          }
        },
        {
          title: '奖励内容',
          key: 'invitemsg',
          render: (h, params) => {
            return h('span', {}, params.row.invitemsg.prizeid)
          }
        },
        {
          title: '奖励数量',
          key: 'invitemsg',
          render: (h, params) => {
            return h('span', {}, params.row.invitemsg.num)
          }
        },
        {
          title: '收取运费',
          key: 'invitemsg',
          render: (h, params) => {
            return h('span', {}, params.row.invitemsg.isshipping)
          }
        },
        {
          title: '运费',
          key: 'invitemsg',
          render: (h, params) => {
            return h('span', {}, params.row.invitemsg.shippingamout)
          }
        },
        {
          title: '开始时间',
          key: 'starttime',
          render: (h, params) => {
            return h('span', {}, params.row.invitemsg.shippingamout)
          }
        },
        {
          title: '结束时间',
          key: 'endtime'
        },
        {
          title: '结束时间',
          key: 'endtime'
        },
        {
          title: '状态',
          key: 'ison',
          width: 110,
          render: (h, params) => {
            let text = params.row.ison == 1 ? '开启' : '关闭'
            let color = params.row.ison == 1 ? 'success' : 'warning'
            return h('Tag', {
              props: {
                color: color,
                type: 'dot'
              }
            }, text)
          }
        },
        {
          title: '操作',
          key: 'id',
          width: 100,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            let edit = h('a', {
              style: {
                marginRight: '10px'
              },
              on: {
                click: () => {
                  this.onClickEdit(params.row)
                }
              }
            }, '编辑')
            let del = h('a', {
              style: {
                color: '#f90',
                marginRight: '10px'
              },
              on: {
                click: () => {
                  this.remove(params.row)
                }
              }
            }, '删除')

            return h('div', [edit, del])
          }
        },
      ],
      addData: {},
      rules: []
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
    onClickEdit (row) {
      this.$router.push({name: 'InvitePrizeEdit', params: {id: row.id}})
    },
    remove (row) {

    },
    onClickAdd () {
      this.$router.push({name: 'InvitePrizeAdd'})
    }
  }
}
</script>
<style lang="less" scoped>

</style>
