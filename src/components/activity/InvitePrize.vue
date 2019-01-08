<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Input v-model="searchKey" placeholder="搜索..." style="width: 230px" />
      <Button type="primary" icon="md-add" style="margin-left:12px" @click="onClickAdd">新增</Button>
    </Card>
    <Card :bordered="false">
      <Table :loading="tableLoading" :columns="columns" height="560" :data="tableData"></Table>
    </Card>

    <Modal v-model="editModal" width="850">
      <p slot="header" style="text-align:center">
        <span>编辑规则</span>
      </p>
      <Form :model="editData" ref="form" :rules="rules" :label-width="70">
        <Row>
          <Col span="8">
            <FormItem label="开始时间" prop="starttime">
              <Input v-model="editData.starttime"></Input>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="结束时间" prop="endtime">
              <Input v-model="editData.endtime"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="editModal = false">取消</Button>
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
      editModal: false,
      modal_loading: false,
      tableData: [],
      columns: [
        {
          title: '#',
          key: 'id',
          width: 80,
        },
        {
          title: '城市',
          key: 'cityid',
          width: 100,
        },
        {
          title: '邀请人数',
          key: 'invitemsg',
          width: 100,
          render: (h, params) => {
            return h('span', {}, params.row.invitemsg.invitenum)
          }
        },
        {
          title: '奖励对象',
          key: 'invitemsg',
          width: 100,
          render: (h, params) => {
            return h('span', {}, params.row.invitemsg.invitetype)
          }
        },
        {
          title: '奖励类型',
          key: 'invitemsg',
          width: 80,
          render: (h, params) => {
            return h('span', {}, params.row.invitemsg.type)
          }
        },
        {
          title: '奖励内容',
          key: 'invitemsg',
          width: 80,
          render: (h, params) => {
            return h('span', {}, params.row.invitemsg.prizeid)
          }
        },
        {
          title: '奖励数量',
          key: 'invitemsg',
          width: 80,
          render: (h, params) => {
            return h('span', {}, params.row.invitemsg.num)
          }
        },
        {
          title: '收取运费',
          key: 'invitemsg',
          width: 100,
          render: (h, params) => {
            return h('span', {}, params.row.invitemsg.isshipping)
          }
        },
        {
          title: '运费',
          key: 'invitemsg',
          width: 100,
          render: (h, params) => {
            return h('span', {}, params.row.invitemsg.shippingamout)
          }
        },
        // {
        //   title: '开始时间',
        //   key: 'starttime',
        //   render: (h, params) => {
        //     return h('span', {}, params.row.invitemsg.shippingamout)
        //   }
        // },
        {
          title: '开始时间',
          key: 'starttime'
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
      editData: {},
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
      this.$Message.loading({
        content: 'Loading...',
        duration: 0
      })
      serverApi('/activity/inviteinfo', {id: row.id},
        response => {
          this.$Message.destroy()
          if (response.data.code === 0) {
            console.log(response)
            this.editData = response.data.data
            this.editModal = true
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.destroy()
          this.$Message.error(error.toString())
          console.log(error)
        }
      )
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
