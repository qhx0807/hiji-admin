<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <!-- <Form :label-width="60">
        <Row>
          <Col span="5">
            <FormItem label="搜索" style="margin-bottom:0">
              <Input placeholder="搜索..." v-model="searchObj.like"></Input>
            </FormItem>
          </Col>
          <Col span="14">
            <FormItem style="margin-bottom:0">
              <Button @click="getTableData" type="primary" :loading="isloading" icon="md-search">查询</Button>
              <Button type="primary" style="margin-left:10px" icon="md-add" @click="onClickAdd">新增</Button>
            </FormItem>
          </Col>
        </Row>
      </Form> -->
      <Row>
        <Col span="4"><Input placeholder="搜索..." v-model="searchObj.like"></Input></Col>
        <Col span="20">
          <Button @click="getTableData" type="primary" style="margin-left:16px" :loading="isloading" icon="md-search">查询</Button>
          <Button type="primary" style="margin-left:10px" icon="md-add" @click="onClickAdd">新增</Button>
        </Col>
      </Row>
    </Card>
    <Card :bordered="false">
      <Table  size="small" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
      <div class="table-box">
        <Page :total="count" show-total show-elevator show-sizer :current="searchObj.page"
          @on-page-size-change="onChangSize"
          @on-change="changePage"/>
      </div>
    </Card>

    <!-- add -->
    <Modal v-model="addModal" width="500" :mask-closable="false">
      <p slot="header" style="text-align:center">
        <span>页面信息</span>
      </p>
      <Form ref="form" :model="addData" :rules="rules" :label-width="80">
        <FormItem label="页面标题" prop="title">
          <Input v-model="addData.title" placeholder="请输入"></Input>
        </FormItem>
        <FormItem label="备注信息">
          <Input v-model="addData.name" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="add">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'OtoPages',
  data () {
    return {
      tableLoading: false,
      modal_loading: false,
      page: 1,
      pagesize: 10,
      count: 0,
      tableData: [],
      columns: [
        {
          title: '#',
          key: 'homeid',
          width: 80
        },
        {
          title: '页面标题',
          key: 'title',
        },
        {
          title: '备注',
          key: 'name',
        },
        {
          title: '是否显示',
          key: 'isshow',
          render: (h, params) => {
            let text = params.row.isshow == 1 ? '显示' : '禁用'
            let color = params.row.isshow == 1 ? 'success' : 'warning'
            return h('Tag', {
              props: {
                type: 'dot',
                color: color
              }
            }, text)
          }
        },
        {
          title: '创建时间',
          key: 'createtime',
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: 120,
          render: (h, params) => {
            const edit = h('a', {
              on: {
                click: () => {
                  this.onClickEdit(params.row)
                }
              }
            }, '修改')
            const see = h('a', {
              on: {
                click: () => {
                  this.onClickDesign(params.row)
                }
              },
              style: {
                marginLeft: '12px',
                color: '#2d8cf0'
              }
            }, '编辑')
            const pri = h('a', {
              on: {
                click: () => {
                  this.onClickDel(params.row)
                }
              },
              style: {
                marginLeft: '12px',
                color: '#f90'
              }
            }, '删除')
            return h('div',[edit, see, pri])
          }
        }
      ],
      rules: {
        title: [
          { required: true, message: 'The title cannot be empty', trigger: 'blur' }
        ],
      },
      isloading: false,
      searchObj: {
        like: '',
        page: 1,
        pagesize: 10
      },
      addModal: false,
      addData: {
        title: '',
        name: '',
        isshow: 1
      },
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.tableLoading = true
      this.isloading = true
      serverApi('/Homepage/index', this.searchObj,
        response => {
          if (response.data.code === 0) {
            this.tableData = response.data.data.result
            this.count = response.data.data.counts
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.tableLoading = false
          this.isloading = false
        },
        error => {
          console.log(error)
          this.tableLoading = false
          this.isloading = false
          this.$Message.error(error.toString())
        }
      )
    },
    onClickAdd () {
      this.addData = {
        title: '',
        name: '',
        isshow: 1
      }
      this.addModal = true
    },
    add () {
      this.$refs.form.validate(valid => {
        if (valid) {
          serverApi('/Homepage/webhomeedit', this.addData,
            response => {
              if (response.data.code === 0) {
                this.addModal = false
                this.$Message.success(response.data.msg)
                this.getTableData()
              } else {
                this.$Message.warning(response.data.msg)
              }
              this.modal_loading = false
            },
            error => {
              this.modal_loading = false
              this.$Message.error(error.toString())
            }
          )
        } else {
          this.$Message.error('请输入信息');
        }
      })
    },
    onClickEdit (row) {
      this.addData = Object.assign({}, row)
      this.addModal = true
    },
    onClickDel (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>是否删除此数据？</p>',
        onOk: () => {
          serverApi('/Homepage/webhomedel', {homeid: row.homeid},
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
    },
    onClickDesign (row) {
      this.$router.push({name: 'OtoPageDesign', params: {id: row.homeid}})
    },
    changePage (e) {
      this.searchObj.page = e
      this.getTableData()
    },
    onChangSize (e) {
      this.searchObj.pagesize = e
      this.getTableData()
    }
  }
}
</script>
<style lang="less" scoped>
.table-box{
  text-align: right;
  padding-top: 10px;
}
</style>
