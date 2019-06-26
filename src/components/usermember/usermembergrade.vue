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
      <!-- <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
      </div> -->
      <div style="clear:both"></div>
    </Card>

    <Modal v-model="addModal" width="450">
      <p slot="header" style="text-align:center">
        <span>新增等级</span>
      </p>
      <Form :model="addData" ref="form" :rules="rules" :label-width="70">
        <Row>
          <Col span="24">
            <FormItem label="等级名称" prop="gradename">
              <Input v-model="addData.gradename"></Input>
            </FormItem>
            <FormItem label="所需经验" prop="gradexp">
              <Input v-model="addData.gradexp"></Input>
            </FormItem>
            <FormItem label="等级图标" >
              <Input v-model="addData.gradeimg"></Input>
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
      <Form :model="editData" ref="formEdit" :rules="rules" :label-width="70">
        <Row>
          <Col span="24">
            <FormItem label="等级名称" prop="gradename">
              <Input v-model="editData.gradename"></Input>
            </FormItem>
            <FormItem label="所需经验" >
              <Input v-model="editData.gradexp"></Input>
            </FormItem>
            <FormItem label="等级图标" >
              <Input v-model="editData.gradeimg"></Input>
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
  name: 'UserMemberGrade',
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
        gradename: '',
        gradexp: '',
        gradeimg: ''
      },
      editData: {},
      rules: {
        gradename: [
          { required: true, message: '请输入等级名称', trigger: 'blur' }
        ],
        gradexp: [
          { required: true, message: '请输入等级经验值', trigger: 'blur' }
        ]
      },
      columns: [
        {
          title: 'ID',
          key: 'id',
        },
        {
          title: '等级名称',
          key: 'gradename',
        },
        {
          title: '等级所需经验',
          key: 'gradexp',
        },
        {
          title: '等级图标',
          key: 'gradeimg',
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
        like: this.searchKey
      }
      this.$store.commit('pageLoading', true)
      serverApi('/member/usergradelist', d,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.tableData = response.data.data
            // this.count = response.data.data.counts
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
      this.addModal = true
    },
    onSave () {
      this.$refs.form.validate(val => {
        if (val) {
          this.modal_loading = true
          serverApi('/member/usergrade', this.addData,
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
          serverApi('/member/usergradede', { id: row.id },
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
          serverApi('/member/usergrade', this.editData,
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
