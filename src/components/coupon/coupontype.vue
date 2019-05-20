<template>
  <div class="box">
    <Card :bordered="false">
      <div>
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <Button type="primary" style="margin-left:8px" icon="md-add" @click="onClickAdd">新增</Button>
      </div>
    </Card>
    <Card :bordered="false" style="margin-top:12px;">
      <div class="body">
        <Table :columns="columns" :data="tableData"></Table>
      </div>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-elevator show-sizer @on-page-size-change="onChangeSize"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>

    <!-- add -->
    <Modal v-model="addModal" width="550">
      <p slot="header" style="text-align:center">
        <span>新增</span>
      </p>
      <Form ref="form" :model="form" :rules="rules" :label-width="70">
        <FormItem prop="typename" label="类型名称">
          <Input v-model="form.typename" placeholder="请输入"></Input>
        </FormItem>
        <FormItem prop="typecode" label="类型编码">
          <Input v-model="form.typecode" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button    @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="add">提交</Button>
      </div>
    </Modal>

    <!-- edit -->
    <Modal v-model="editModal" width="550">
      <p slot="header" style="text-align:center">
        <span>修改</span>
      </p>
      <Form ref="editform" :model="editData" :rules="rules" :label-width="70">
        <FormItem prop="typename" label="类型名称">
          <Input v-model="editData.typename" placeholder="请输入"></Input>
        </FormItem>
        <FormItem prop="typecode" label="类型编码">
          <Input v-model="editData.typecode" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="editModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="edit">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'CouponType',
  data () {
    return {
      searchKey: '',
      tableData: [],
      addModal: false,
      editModal: false,
      modal_loading: false,
      form: {
        typename: '',
        typecode: ''
      },
      rules: {
        typename: [{ required: true, message: '不能为空', trigger: 'blur' }],
        typecode: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      count: 0,
      page: 1,
      pageSize: 10,
      columns: [
        {
          title: '#',
          key: 'id',
          minWidth: 80
        },
        {
          title: '类型名称',
          key: 'typename',
          minWidth: 130
        },
        {
          title: '类型编码',
          key: 'typecode',
          minWidth: 130
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: 150,
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
                h('Button', {
                    props: {
                      type: 'text',
                      size: 'small',
                      icon: 'edit'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.onClickEdit(params.row)
                      }
                    }
                }, '编辑'),
                h('Button', {
                    props: {
                      type: 'text',
                      size: 'small',
                      icon: 'trash-a'
                    },
                    on: {
                      click: () => {
                        this.remove(params.row)
                      }
                    }
                }, '删除')
            ])
          }
        }
      ],
      editData: {},
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    onClickSearch () {
      this.page = 1
      this.getTableData()
    },
    getTableData (page, size, key) {
      let d = {
        pagesize: this.pageSize,
        page: this.page,
        like: this.searchKey,
        userid: sessionStorage.userid
      }
      this.$store.commit('pageLoading', true)
      serverApi('/card/type', d,
        response => {
          // console.log(response)
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
          this.$store.commit('pageLoading', false)
          this.$Message.error('连接失败！')
        }
      )
    },
    changePage (e) {
      this.page = e
      this.getTableData()
    },
    onChangeSize (e) {
      this.pageSize = e
      this.getTableData()
    },
    onClickAdd () {
      this.$refs.form.resetFields()
      this.addModal = true
    },
    add () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (/[\u4E00-\u9FA5]/g.test(this.form.typecode)) {
            this.$Message.warning('类型编码不能包含汉字字符！')
            return false
          }
          this.modal_loading = true
          serverApi('/card/typeadd', this.form,
            response => {
              this.modal_loading = false
              if (response.data.code === 0) {
                this.addModal = false
                this.getTableData()
              }
              this.$Message.info(response.data.msg)
            },
            error => {
              console.log(error)
              this.modal_loading = false
            }
          )
        }
      })
    },
    onClickEdit (row) {
      this.editData = Object.assign({}, row)
      this.editModal = true
    },
    edit () {
      delete this.editData._index
      delete this.editData._rowKey
      this.$refs.editform.validate(valid => {
        if (valid) {
          if (/[\u4E00-\u9FA5]/g.test(this.editData.typecode)) {
            this.$Message.warning('类型编码不能包含汉字字符！')
            return false
          }
          this.modal_loading = true
          serverApi('/card/typeedit', this.editData,
            response => {
              this.modal_loading = false
              if (response.data.code === 0) {
                this.editModal = false
                this.getTableData()
              }
              this.$Message.info(response.data.msg)
            },
            error => {
              this.editModal = false
              console.log(error)
              this.modal_loading = false
              this.$Message.error('连接失败')
            }
          )
        }
      })
    },
    remove (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除此条信息？</p>',
        onOk: () => {
          serverApi('/card/typedel', {id: row.id},
            response => {
              if (response.data.code == 0) {
                this.getTableData()
              }
              this.$Message.info(response.data.msg)
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
