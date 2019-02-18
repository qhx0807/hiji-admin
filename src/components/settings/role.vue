<template>
  <div class="box">
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
    <Modal v-model="addModal" width="550">
      <p slot="header" style="text-align:center">
        <span>新增</span>
      </p>
      <Form ref="form" :model="form" :rules="rules" :label-width="70">
        <FormItem prop="rolename" label="角色名称">
          <Input v-model="form.rolename" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem prop="rolecode" label="角色编码">
          <Input v-model="form.rolecode" placeholder="请输入code"></Input>
        </FormItem>
        <FormItem prop="dashboard" label="首屏路由">
          <Input v-model="form.dashboard" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="备注信息">
          <Input type="textarea" v-model="form.remark" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button    @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="add">提交</Button>
      </div>
    </Modal>

    <!-- edit -->
    <Modal v-model="editModal" width="500" :styles="{top: '70px'}">
      <p slot="header" style="text-align:center">
        <span>修改信息</span>
      </p>
      <Form :model="editData"  :rules="rules" :label-width="70">
        <FormItem prop="rolename" label="角色名称">
          <Input v-model="editData.rolename" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem prop="rolecode" label="角色编码">
          <Input v-model="editData.rolecode" placeholder="请输入code"></Input>
        </FormItem>
        <FormItem prop="dashboard" label="首屏路由">
          <Input v-model="editData.dashboard" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="备注信息">
          <Input type="textarea" v-model="editData.remark" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button    @click="editModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="edit">保存</Button>
      </div>
    </Modal>

    <!-- auth -->
    <Modal v-model="authModal" width="660">
      <p slot="header" style="text-align:center">
        <span>【{{this.editData.rolename}}】角色权限</span>
      </p>
      <div class="authbox">
        <Divider orientation="left" dashed >已有权限</Divider>
        <p v-show="yTagArr.length === 0">无数据</p>
        <Tag type="dot" @on-close="onCloseyTag(item, index)" v-for="(item, index) in yTagArr" :key="index" :name="item.code" closable :color="item.color">{{item.name}}</Tag>
        <Divider orientation="left" dashed>可添加权限</Divider>
        <p v-show="kTagArr.length === 0">无数据</p>
        <Tag @click.native="onClickKTag(item, index)" type="dot" v-for="(item, index) in kTagArr" :key="index" :name="item.code" :color="item.color">{{item.name}}</Tag>
      </div>
      <div slot="footer">
        <Button @click="authModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="authModal = false">关闭</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'Role',
  data () {
    return {
      searchKey: '',
      addModal: false,
      editModal: false,
      modal_loading: false,
      authModal: false,
      count: 0,
      page: 1,
      pageSize: 10,
      form: {
        rolename: '',
        rolecode: '',
        remark: '',
        dashboard: ''
      },
      rules: {
        rolename: [{ required: true, message: '不能为空', trigger: 'blur' }],
        rolecode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        dashboard: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      editData: {},
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 80
        },
        {
          title: '角色名称',
          key: 'rolename',
        },
        {
          title: '角色编码',
          key: 'rolecode',
        },
        {
          title: '首屏路由',
          key: 'dashboard',
        },
        {
          title: '备注',
          key: 'remark'
        },
        {
          title: '创建时间',
          key: 'createtime',
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: 170,
          render: (h, params) => {
            let a = h('a', {
                style: {
                  marginRight: '10px'
                },
                on: {
                  click: () => {
                    this.onClickEdit(params.row)
                  }
                }
            }, '编辑')
            let b = h('a', {
                style: {
                  marginRight: '10px',
                  color: '#ff9900'
                },
                on: {
                  click: () => {
                    this.remove(params.row.id)
                  }
                }
            }, '删除')
            let c = h('a', {
                style: {
                  color: '#ed4014'
                },
                on: {
                  click: () => {
                    this.roleAuth(params.row)
                  }
                }
            }, '角色权限')
            if (params.row.rolecode == 'administrator') {
              return h('div', {}, '禁止操作')
            } else {
              return h('div', [a, b, c])
            }
          }
        }
      ],
      tableData: [],
      casData: [],
      handlerData: [],
      tagColors: ['primary', 'success', 'warning'],
      yTagArr: [],
      kTagArr: []
    }
  },
  created () {
    this.getTableData(1, 10, '')
    this.getHandlerData()
    // this.getDepData()
  },
  methods: {
    getTableData (page, size, key) {
      let d = {
        pagesize: size,
        page: page,
        like: key
      }
      this.$store.commit('pageLoading', true)
      serverApi('/role/index', d,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            // this.tableData = response.data.data.result
            this.tableData = response.data.data
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
    getHandlerData () {
      serverApi('/role/authlist', null,
        response => {
          if (response.data.code === 0) {
            console.log(response)
            this.handlerData = response.data.data
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.error(error.toString())
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
      serverApi('/role/edit', this.editData,
        response => {
          this.modal_loading = false
          if (response.data.code === 0) {
            this.getTableData(this.page, this.pageSize, this.searchKey)
            this.editModal = false
          }
          this.$Message.info(response.data.msg)
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
          serverApi('/role/del', {id: id},
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
          serverApi('/role/add', this.form,
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
    },
    roleAuth (row) {
      this.yTagArr = []
      this.kTagArr = []
      this.editData = Object.assign({}, row)
      const msg = this.$Message.loading({
        content: 'Loading...',
        duration: 0
      })
      serverApi('/role/roleauthlist', {id: row.id},
        response => {
          this.$Message.destroy()
          if (response.data.code === 0) {
            console.log(response)
            let yarr = []
            let karr = []
            let arr = [ ...this.handlerData ]
            let yids = []
            response.data.data.forEach( e => {
              yids.push(e.authid)
              let rand = Math.floor(Math.random() * this.tagColors.length)
              let obj = {
                name: e.authdes,
                code: e.authcode,
                color: this.tagColors[rand],
                ...e
              }
              yarr.push(obj)
            })
            this.yTagArr = yarr

            if (response.data.data.length > 0) {
              karr = arr.filter(item => {
                return !yids.includes(item.id)
              })
            } else {
              karr = arr
            }
            karr.map(a => {
              let rand1 = Math.floor( Math.random() * this.tagColors.length )
              a.name = a.authdes
              a.code = a.authcode
              a.color = this.tagColors[rand1]
            })
            this.kTagArr = karr
            this.authModal = true
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.destroy()
          console.log(error)
          this.$Message.error(error.toString())
        }
      )
    },
    onCloseyTag (row, index) {
      // console.log(row)
      const msg = this.$Message.loading({
        content: 'Loading...',
        duration: 0
      })
      serverApi('/role/roleauthdel', { id: row.id },
        response => {
          this.$Message.destroy()
          if (response.data.code === 0) {
            this.$Message.success(response.data.msg)
            this.authModal = false
            // this.yTagArr.push(row)
            // this.$delete(this.kTagArr, index)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.destroy()
          console.log(error)
          this.$Message.error(error.toString())
        }
      )

    },
    onClickKTag (row, index) {
      const msg = this.$Message.loading({
        content: 'Loading...',
        duration: 0
      })
      let d = {
        roleid: this.editData.id,
        authid: row.id
      }
      serverApi('/role/roleedits', d,
        response => {
          this.$Message.destroy()
          if (response.data.code === 0) {
            this.$Message.success(response.data.msg)
            this.authModal = false
            // this.yTagArr.push(row)
            // this.$delete(this.kTagArr, index)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.destroy()
          console.log(error)
          this.$Message.error(error.toString())
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
.authbox{
  max-height: 620px;
  overflow: auto;
}
</style>


