<template>
  <div class="user">
    <Card>
      <div class="head">
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <Button type="primary" style="margin-left:8px" icon="plus" @click="onClickAdd">新增</Button>
      </div>
      <div class="body">
        <Table :columns="columns" :data="tableData"></Table>
      </div>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>

    <!-- add -->
    <Modal v-model="addModal" width="550">
      <p slot="header" style="text-align:center">
        <span>新增</span>
      </p>
      <Form ref="form" :model="form" :rules="rules" :label-width="70">
        <FormItem prop="name" label="商户名称">
          <Input v-model="form.name" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem prop="merchantcode" label="商户编码">
          <Input v-model="form.merchantcode" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem prop="contact" label="联系人">
          <Input  v-model="form.contact" placeholder="请输入"></Input>
        </FormItem>
        <FormItem prop="mobile" label="联系电话">
          <Input  v-model="form.mobile" placeholder="请输入"></Input>
        </FormItem>
        <FormItem prop="addres" label="联系地址">
          <Input  v-model="form.addres" placeholder="请输入"></Input>
        </FormItem>
        <FormItem prop="departmentcode" label="所属部门">
          <!-- <Input  v-model="form.departmentcode" placeholder="请输入"></Input> -->
          <Cascader change-on-select @on-change="onSelectDep" :data="casData"></Cascader>
        </FormItem>
        <FormItem prop="info" label="商户信息">
          <Input type="textarea" v-model="form.info" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="ghost"  @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="add">提交</Button>
      </div>
    </Modal>

    <!-- edit -->
    <Modal v-model="editModal" width="500" :styles="{top: '20px'}">
      <p slot="header" style="text-align:center">
        <span>修改信息</span>
      </p>
      <Form :model="editData"  :rules="rules" :label-width="70">
        <FormItem prop="name" label="商户名称">
          <Input v-model="editData.name" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem prop="merchantcode" label="商户编码">
          <Input v-model="editData.merchantcode" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem prop="contact" label="联系人">
          <Input  v-model="editData.contact" placeholder="请输入"></Input>
        </FormItem>
        <FormItem prop="mobile" label="联系电话">
          <Input  v-model="editData.mobile" placeholder="请输入"></Input>
        </FormItem>
        <FormItem prop="addres" label="联系地址">
          <Input  v-model="editData.addres" placeholder="请输入"></Input>
        </FormItem>
        <FormItem prop="departmentname" label="所属部门">
          <Input  v-model="editData.departmentname" placeholder="请输入"></Input>
        </FormItem>
        <FormItem prop="departmentcode" label="部门编码">
          <Input  v-model="editData.departmentcode" placeholder="请输入"></Input>
        </FormItem>
        <FormItem prop="departmentcode" label="所属部门">
          <!-- <Input  v-model="editData.departmentcode" placeholder="请输入"></Input> -->
          <Cascader change-on-select @on-change="onSelectDepEdit" :data="casData"></Cascader>
        </FormItem>
        <FormItem prop="info" label="商户信息">
          <Input type="textarea" v-model="editData.info" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="ghost"  @click="editModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="edit">保存</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'Merchant',
  data () {
    return {
      searchKey: '',
      addModal: false,
      editModal: false,
      modal_loading: false,
      count: 0,
      page: 1,
      pageSize: 10,
      form: {
        name: '',
        departmentcode: '',
        contact: '',
        mobile: '',
        addres: '',
        info: '',
        merchantcode: ''
      },
      rules: {
        name: [{ required: true, message: '不能为空', trigger: 'blur' }],
        mobile: [{ required: true, message: '不能为空', trigger: 'blur' }],
        departmentcode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        contact: [{ required: true, message: '不能为空', trigger: 'blur' }],
        addres: [{ required: true, message: '不能为空', trigger: 'blur' }],
        info: [{ required: true, message: '不能为空', trigger: 'blur' }],
        merchantcode: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      editData: {},
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 80
        },
        {
          title: '名称',
          key: 'name',
        },
        {
          title: '部门',
          key: 'departmentname',
        },
        {
          title: '联系人',
          key: 'contact'
        },
        {
          title: '电话',
          key: 'mobile'
        },
        {
          title: '商户地址',
          key: 'addres'
        },
        {
          title: '商户信息',
          key: 'info'
        },
        {
          title: '创建时间',
          key: 'createtime',
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: 160,
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
                        this.remove(params.row.id)
                      }
                    }
                }, '删除')
            ])
          }
        }
      ],
      tableData: [],
      casData: [],
    }
  },
  created () {
    this.getTableData(1, 10, '')
    this.getDepData()
  },
  methods: {
    getTableData (page, size, key) {
      let d = {
        pageSize: size,
        page: page,
        like: key
      }
      this.$store.commit('pageLoading', true)
      serverApi('/Merchant/index', d,
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
          this.$store.commit('pageLoading', false)
        }
      )
    },
    getDepData () {
      serverApi('/depar/index', '',
        response => {
          if (response.data.code === 0){
            let cas = response.data.data
            let getCas = function (arr) {
              arr.forEach(item => {
                item.label = item.departmentname,
                item.value = item.departmentcode
                item.children = item.child
                if (item.child.length > 0) {
                  getCas(item.child)
                }
              })
            }
            getCas(cas)
            this.casData = cas
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        }
      )
    },
    onClickAdd () {
      this.$refs.form.resetFields()
      this.addModal = true
    },
    onClickEdit (row) {
      this.editData = Object.assign({}, row)
      this.editModal = true
    },
    edit () {
      delete this.editData._index
      delete this.editData._rowKey
      this.modal_loading = true
      serverApi('/Merchant/edit', this.editData,
        response => {
          this.modal_loading = false
          if (response.data.code === 0) {
            this.editModal = false
          }
          this.$Message.info(response.data.msg)
          this.getTableData(this.page, this.pageSize, this.searchKey)
        },
        error => {
          console.log(error)
          this.modal_loading = false
        }
      )
    },
    remove (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除此条信息？</p>',
        onOk: () => {
          serverApi('/Merchant/del', {id: id},
            response => {
              this.$Message.info(response.data.msg)
              this.getTableData(this.page, this.pageSize, this.searchKey)
            },
            error => {
              console.log(error)
              this.$Message.error('链接失败！')
            }
          )
        }
      })
    },
    add () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.modal_loading = true
          serverApi('/Merchant/add', this.form,
            response => {
              this.modal_loading = false
              if (response.data.code === 0) {
                this.addModal = false
                this.getTableData(this.page, this.pageSize, this.searchKey)
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
    exportTable () {
      if (this.searchData.length > 0) {
        exportExcel(this.searchData, 'Api表格导出')
      } else {
        this.$Message.info('无数据！！')
      }
    },
    changePage (e) {
      this.page = e
      this.getTableData(e, this.pageSize, this.searchKey)
    },
    onChangeSize (e) {
      this.pageSize = e
      this.getTableData(this.page, e, this.searchKey)
    },
    onClickSearch () {
      this.getTableData(this.page, this.pageSize, this.searchKey)
    },
    onSelectDep (e) {
      if (e && e.length) {
        this.form.departmentcode = e[e.length-1]
      }
    },
    onSelectDepEdit (e) {
      if (e && e.length) {
        this.editData.departmentcode = e[e.length-1]
        let dep = this.casData.find(item => {
          return item.departmentcode === e[e.length-1]
        })
        // console.log(dep)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.head{
  padding-bottom: 12px;
}
</style>
