<template>
  <div class="user">
    <Card :bordered="false">
      <div class="head">
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <Button type="primary" style="margin-left:8px" icon="md-add" v-if="showAddbtn" @click="onClickAdd">新增</Button>
      </div>
    </Card>
    <Card :bordered="false" style="margin-top:12px;">
      <div class="body">
        <Table :columns="columns" :data="tableData"></Table>
      </div>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>

    <Modal v-model="bindModal" width="500" :styles="{top: '70px'}">
      <p slot="header" style="text-align:center">
        <span>绑定收款账户（仅限支付宝）</span>
      </p>
      <Form :model="editData"  :rules="rules" :label-width="70">
        <FormItem label="收款账户">
          <Input v-model="editData.aliphone" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem label="真实姓名">
          <Input  v-model="editData.realname" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button    @click="bindModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="bingAliPay">保存</Button>
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
      bindModal: false,
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
        merchantcode: '',
        businesstime: ''
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
          title: '编号',
          key: 'id',
          width: 80
        },
        {
          title: '名称',
          key: 'name',
          minWidth: 160
        },
        {
          title: '分类',
          key: 'sortname',
          width: 100
        },
        {
          title: '编码',
          key: 'merchantcode',
          width: 100
        },
        {
          title: '联系人',
          key: 'contact',
          width: 100
        },
        {
          title: '电话',
          key: 'mobile',
          width: 140
        },
        {
          title: '收款账户',
          key: 'alipay',
          minWidth: 180,
          render: (h, params) => {
            if (params.row.realname && params.row.aliphone) {
              return h('div', [
                h('p', {}, params.row.realname),
                h('p', {}, params.row.aliphone)
              ])
            } else {
              return h('div', {}, '未绑定')
            }
          }
        },
        {
          title: '打款方式',
          key: 'billtype',
          width: 90,
          render: (h, params) => {
            let text = params.row.billtype == 0 ? '线上打款' : '线下打款'
            return h('span', {}, text)
          }
        },
        {
          title: '商户地址',
          key: 'addres',
          minWidth: 130
        },
        {
          title: '商户信息',
          key: 'info',
          minWidth: 180
        },
        {
          title: '创建时间',
          key: 'createtime',
          width: 150
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: 150,
          fixed: 'right',
          render: (h, params) => {
            let del = h('Button', {
              props: {
                type: 'text',
                size: 'small',
              },
              style: {
                color: '#ed3f14'
              },
              on: {
                click: () => {
                  this.remove(params.row.id)
                }
              }
            }, '删除')
            let edit = h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                },
                style: {
                  marginRight: '5px',
                  color: '#2d8cf0'
                },
                on: {
                  click: () => {
                    this.onClickEdit(params.row)
                  }
                }
            }, '编辑')
            let bind = h('Button', {
              props: {
                type: 'text',
                size: 'small',
              },
              on: {
                click: () => {
                  this.binding(params.row)
                }
              }
            }, '绑定')
            return h('div', [edit, bind, del])
          }
        }
      ],
      tableData: [],
      casData: [],
      showAddbtn: false
    }
  },
  created () {
    if (sessionStorage.roleid == '6') {
      this.showAddbtn = false
    } else {
      this.showAddbtn = true
    }
    this.getTableData(1, 10, '')
    this.getDepData()
  },
  methods: {
    getTableData (page, size, key) {
      let d = {
        pagesize: size,
        page: page,
        like: key,
        userid: sessionStorage.userid
      }
      this.$store.commit('pageLoading', true)
      serverApi('/Merchant/index', d,
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
      this.$router.push({name: 'MerchantAdd'})
    },
    onClickEdit (row) {
      this.$router.push({name: 'MerchantDetail', params: {id: row.id}})
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
    changePage (e) {
      this.page = e
      this.getTableData(e, this.pageSize, this.searchKey)
    },
    onChangeSize (e) {
      this.pageSize = e
      this.getTableData(this.page, e, this.searchKey)
    },
    onClickSearch () {
      this.page = 1
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
    binding (row) {
      this.editData = Object.assign({}, row)
      this.bindModal = true
    },
    bingAliPay () {
      if (!this.editData.aliphone || !this.editData.realname) {
        this.$Message.warning('请输入信息！')
        return false
      }
      this.modal_loading = true
      var d = {
        aliphone: this.editData.aliphone,
        realname: this.editData.realname,
        merchantcode: this.editData.merchantcode,
        userid: sessionStorage.userid
      }
       serverApi('/putforward/binding', d,
            response => {
              this.modal_loading = false
              if (response.data.code === 0) {
                this.bindModal = false
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
  }
}
</script>
<style lang="less" scoped>

</style>
