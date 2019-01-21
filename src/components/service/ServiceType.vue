<template>
  <div class="box">
    <Card :bordered="false">
      <div class="head">
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <Button type="primary" style="margin-left:8px" icon="md-add" @click="onClickAdd">新增</Button>
      </div>
    </Card>
    <Card :bordered="false" style="margin-top:10px">
      <Table :columns="columns" :data="tableData"></Table>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>

    <Modal v-model="addModal" width="450">
      <p slot="header" style="text-align:center">
        <span>新增</span>
      </p>
      <Form :model="addData" ref="form" :rules="rules" >
        <Row>
          <Col span="24">
            <FormItem label="类型名称" prop="gradename">
              <Input v-model="addData.typename"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="onSave">保存</Button>
      </div>
    </Modal>

    <Modal v-model="editModal" width="450">
      <p slot="header" style="text-align:center">
        <span>修改信息</span>
      </p>
      <Form :model="editData" ref="formEdit" :rules="rules">
        <Row>
          <Col span="24">
            <FormItem label="类型名称" prop="gradename">
              <Input v-model="editData.typename"></Input>
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
  name: 'ServiceType',
  data () {
    return {
      searchKey: '',
      pageSize: 15,
      page: 1,
      count: 0,
      addModal: false,
      modal_loading: false,
      editModal: false,
      tableData: [],
      addData: {
        typename: ''
      },
      editData: {},
      rules: {
        typename: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      columns: [
        {
          title: 'ID',
          key: 'id',
        },
        {
          title: '类型',
          key: 'typename',
        },
        {
          title: '处理数量',
          key: 'treatednum',
        },
        {
          title: '未处理数量',
          key: 'untreatednum',
        },
        {
          title: '操作',
          key: 'id',
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
      ]
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
      serverApi('/service/servicelist', d,
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
        }
      )
    },
    onClickAdd () {
      this.addData = {
        typename: ''
      }
      this.addModal = true
    },
    onSave () {
      this.$refs.form.validate(val => {
        if (val) {
          this.modal_loading = true
          serverApi('/service/serviceadd', this.addData,
            response => {
              if (response.data.code === 0) {
                this.$Message.success(response.data.msg)
                this.getTableData()
              } else {
                this.$Message.warning(response.data.msg)
              }
              this.addModal = false
              this.modal_loading = false
            },
            error => {
              this.modal_loading = false
              this.$Message.error(error.toString())
            }
          )
        }
      })
    },
    onClickEdit (row) {
      this.editData = row
      this.editModal = true
    },
    remove (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除此条规则？',
        loading: true,
        onOk: () => {
          serverApi('/service/servicede', { id: row.id },
            response => {
              if (response.data.code === 0) {
                this.$Message.success(response.data.msg)
                this.getTableData()
              } else {
                this.$Message.warning(response.data.msg)
              }
              this.$Modal.remove()
            },
            error => {
              this.$Modal.remove()
              this.$Message.error(error.toString())
            }
          )
        }
      })
    },
    onSaveEdit () {
      this.$refs.formEdit.validate(val => {
        if (val) {
          this.modal_loading = true
          serverApi('/service/serviceadd', this.editData,
            response => {
              if (response.data.code === 0) {
                this.$Message.success(response.data.msg)
                this.getTableData()
              } else {
                this.$Message.warning(response.data.msg)
              }
              this.editModal = false
              this.modal_loading = false
            },
            error => {
              this.modal_loading = false
              this.editModal = false
              this.$Message.error(error.toString())
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
