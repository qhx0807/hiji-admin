<template>
  <div class="box">
    <Card :bordered="false">
      <div class="head">
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <!-- <Button type="primary" style="margin-left:8px" icon="md-add">新增</Button> -->
      </div>
    </Card>
    <Card :bordered="false" style="margin-top:10px">
      <Table :columns="columns" :data="tableData"></Table>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>
    <Modal v-model="editModal" width="550">
      <p slot="header" style="text-align:center">
        <span>修改</span>
      </p>
      <Form ref="form" :model="editData" :label-width="70">
        <FormItem label="参数值">
          <Input v-model="editData.paramvalue" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button    @click="editModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="onSaveEDit">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'SysSetting',
  data () {
    return {
      searchKey: '',
      editModal: false,
      modal_loading: false,
      pageSize: 15,
      page: 1,
      count: 0,
      tableData: [],
      editData: {},
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 90
        },
        {
          title: '参数编码',
          key: 'paramcode'
        },
        {
          title: '值',
          key: 'paramvalue'
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '是否可用',
          key: 'isuse'
        },
        // {
        //   title: '修改',
        //   key: 'isallowmodi'
        // },
        // {
        //   title: '删除',
        //   key: 'isallowdel'
        // },
        {
          title: '创建时间',
          key: 'createtime'
        },
        {
          title: '操作',
          key: 'id',
          fixed: 'right',
          align: 'center',
          width: 120,
          render: (h, params) => {
            let edit = h('a', {
              on: {
                click: () => {
                  this.onClickEdit(params.row)
                }
              }
            }, '修改')
            let del = h('a', {
              style: {
                color: '#f90',
                marginLeft: '10px'
              },
              on: {
                click: () => {
                  this.onClickDel(params.row.id)
                }
              }
            }, '删除')
            return h('div', [params.row.isallowmodi == 1 ? edit : null, params.row.isallowdel == 1 ? del : null])
          }
        }
      ]
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    onClickSearch () {
      this.getTableData()
    },
    changePage (e) {
      this.page = e
      this.getTableData()
    },
    onChangeSize (e) {
      this.pageSize = e
      this.getTableData()
    },
    getTableData () {
      let d = {
        pagesize: this.pageSize,
        page: this.page,
        like: this.searchKey
      }
      this.$store.commit('pageLoading', true)
      serverApi('/param/index', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.tableData = response.data.data.result
            this.count = response.data.data.counts
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.$store.commit('pageLoading', false)
        },
        error => {
          console.log(error)
          this.$Message.error('链接失败！')
          this.$store.commit('pageLoading', false)
        }
      )
    },
    onClickEdit (row) {
      this.editData = Object.assign({}, row)
      this.editModal = true
    },
    onSaveEDit () {
      if (!this.editData.paramvalue) {
        this.$Message.info('请输入值')
        return false
      }
      this.modal_loading = true
      serverApi('/param/edit', this.editData,
        response => {
          console.log(response)
          this.modal_loading = false
          if (response.data.code === 0){
            this.$Message.success(response.data.msg)
            this.getTableData()
            this.editModal = false
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.modal_loading = false
          console.log(error)
        }
      )
    },
    onClickDel (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除此条信息？</p>',
        onOk: () => {
          serverApi('/param/del', {id: id},
            response => {
              this.$Message.info(response.data.msg)
              this.getTableData()
            },
            error => {
              console.log(error)
              this.$Message.error('链接失败！')
            }
          )
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>

</style>
