<template>
  <div class="user">
    <Card :bordered="false">
      <div class="head">
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <Button type="primary" style="margin-left:8px" icon="md-add" @click="onClickAdd">新增</Button>
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
    <Modal v-model="addModal" width="500">
      <p slot="header" style="text-align:center">
        <span>新增</span>
      </p>
      <Form ref="form" :model="form" :rules="rules" :label-width="70">
        <FormItem prop="username" label="账户名称">
          <Input v-model="form.username" placeholder="请输入账户名称"></Input>
        </FormItem>
        <FormItem prop="password" label="账户密码">
          <Input  v-model="form.password" placeholder="请输入账户密码"></Input>
        </FormItem>
        <FormItem prop="departmentcode" label="选择部门">
          <Cascader change-on-select @on-change="onSelectDep" :data="casData"></Cascader>
        </FormItem>
        <FormItem prop="roleid" label="账户角色">
          <Select v-model="form.roleid">
            <Option v-for="item in roleData" :key="item.id" :value="item.id">{{item.rolename}}</Option>
          </Select>
        </FormItem>
        <FormItem label="绑定商户">
          <Select filterable v-model="form.merchantcode">
            <Option v-for="item in merData" :key="item.id" :value="item.merchantcode">{{item.name}}</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button    @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="add">提交</Button>
      </div>
    </Modal>

    <!-- edit -->
    <Modal v-model="editModal" width="500">
      <p slot="header" style="text-align:center">
        <span>修改信息</span>
      </p>
      <Form :model="editData"  :rules="rules" :label-width="80">
        <FormItem prop="username" label="账户名称">
          <Input disabled v-model="editData.username" placeholder="请输入账户名称"></Input>
        </FormItem>
        <FormItem label="账户密码">
          <Tooltip content="输入密码保存将会改变原密码！" placement="top-start">
            <Input v-model="editPass" style="width:388px" placeholder="请输入账户密码"></Input>
          </Tooltip>
        </FormItem>
        <FormItem label="绑定商户">
          <Select filterable v-model="editData.merchantcode">
            <Option v-for="item in merData" :key="item.id" :value="item.merchantcode">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem prop="roleid" label="账户角色">
          <Select v-model="editData.roleid">
            <Option v-for="item in roleData" :key="item.id" :value="item.id">{{item.rolename}}</Option>
          </Select>
        </FormItem>
        <FormItem label="当前部门">
          <Input readonly v-model="editData.deparmentname" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="修改部门为">
          <Cascader change-on-select @on-change="onSelectDepEdit" :data="casData"></Cascader>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button    @click="editModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="edit">保存</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'User',
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
        username: '',
        password: '',
        roleid: null,
        departmentcode: '',
        merchantcode: ''
      },
      rules: {
        username: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        roleid: [{ required: true, type: 'number', message: '不能为空', trigger: 'blur' }]
      },
      merData: [],
      editData: {},
      columns: [
        {
          title: '序号',
          key: 'id',
          width: 60
        },
        {
          title: '账户名',
          key: 'username',
          width: 100
        },
        {
          title: '绑定商户',
          key: 'merchantname',
          minWidth: 120,
        },
        {
          title: '部门',
          key: 'deparmentname',
          minWidth: 120,
        },
        {
          title: '部门编号',
          key: 'departmentcode',
          width: 120,
        },
        // {
        //   title: '权限',
        //   key: 'authority',
        // },
        {
          title: '状态',
          key: 'isuse',
          width: 120,
          render: (h, params) => {
            let color = params.row.isuse == 1 ? 'success' : 'warning'
            let text = params.row.isuse == 1 ? '正常' : '未启用'
            return h('Tag', {
              props: {
                color: color,
                type: 'dot'
              }
            }, text)
          }
        },
        {
          title: '创建时间',
          key: 'createtime',
          width: 120,
        },
        {
          title: '最后登录时间',
          key: 'lasttime',
          width: 160,
        },
        {
          title: '最后登录IP',
          key: 'lastip',
          width: 130,
        },
        {
          title: '操作',
          key: 'id',
          width: 100,
          align: 'center',
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
                h('a', {
                    style: {
                      marginRight: '12px'
                    },
                    on: {
                      click: () => {
                        this.onClickEdit(params.row)
                      }
                    }
                }, '编辑'),
                h('a', {
                    style: {
                      color: '#ff9900'
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
      editPass: '',
      roleData: []
    }
  },
  created () {
    this.getTableData(1, 10, '')
    this.getDepData()
    this.getRoleData()
    this.getMerchantData()
  },
  methods: {
    getTableData (page, size, key) {
      let d = {
        pagesize: size,
        page: page,
        like: key
      }
      this.$store.commit('pageLoading', true)
      serverApi('/account/index', d,
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
    getDepData () {
      serverApi('/depar/index', '',
        response => {
          if (response.data.code === 0){
            // console.log(response)
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
    getRoleData () {
      serverApi('/role/index', '',
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.roleData = response.data.data
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
      console.log(this.editData)
    },
    edit () {
      delete this.editData._index
      delete this.editData._rowKey
      delete this.editData.lastip
      delete this.editData.lasttime
      delete this.editData.authority
      delete this.editData.departmentname
      this.editData.password = this.editPass
      this.modal_loading = true
      serverApi('/account/edit', this.editData,
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
          serverApi('/account/del', {id: id},
            response => {
              if (response.data.code == 0) {
                 this.getTableData(this.page, this.pageSize, this.searchKey)
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
    },
    add () {
      // console.log(this.form)
      this.$refs.form.validate(valid => {
        if (valid) {
          this.modal_loading = true
          serverApi('/account/add', this.form,
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
        this.form.departmentcode = String(e[e.length-1])
      }
    },
    onSelectDepEdit (e) {
      if (e && e.length) {
        this.editData.departmentcode = e[e.length-1]
      }
    },
    getMerchantData () {
      let d = {
        pagesize: 99999999,
        page: 1
      }
      serverApi('/Merchant/index', d,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.merData = response.data.data.result
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
.head{
  padding-bottom: 12px;
}
</style>
