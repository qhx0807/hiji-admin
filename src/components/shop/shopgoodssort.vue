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
        <FormItem prop="typename" label="类型名称">
          <Input v-model="form.typename" placeholder="请输入"></Input>
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
      </Form>
      <div slot="footer">
        <Button    @click="editModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="edit">保存</Button>
      </div>
    </Modal>

    <!-- edit opr -->
    <Modal v-model="oprModal" width="550">
      <p slot="header" style="text-align:center">
        <span>编辑属性</span>
      </p>
      <div class="propBox">
        <Tag type="dot"
          @on-close="onRemoveTag(item)"
          v-for="(item, index) in propData"
          color="primary" :key="index"
          closable>
          {{item.attributevalue}}
          </Tag>
        <div class="clear-fix"></div>
      </div>
      <Form ref="editform" :model="editData" :rules="rules" :label-width="70">
        <FormItem prop="typename" label="属性名称">
          <Row>
            <Col span="20">
              <Input v-model="attributevalue" placeholder="请输入"></Input>
            </Col>
            <Col span="4">
              <Button type="primary" style="margin-left:12px" :loading="modal_loading" @click="onClickAddProp">保存</Button>
            </Col>
          </Row>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button    @click="oprModal = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'ShopGoodsSort',
  data () {
    return {
      searchKey: '',
      tableData: [],
      addModal: false,
      editModal: false,
      oprModal: false,
      modal_loading: false,
      form: {
        typename: ''
      },
      rules: {
        typename: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      count: 0,
      page: 1,
      pageSize: 10,
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 130
        },
        {
          title: '类型名称',
          key: 'typename',
          minWidth: 130
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: 220,
          fixed: 'right',
          render: (h, params) => {
            const edit = h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.onClickEdit(params.row)
                  }
                }
            }, '编辑')
            const del = h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                },
                on: {
                  click: () => {
                    this.remove(params.row)
                  }
                }
            }, '删除')
            const opr = h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                on: {
                  click: () => {
                    this.operate(params.row)
                  }
                }
            }, '编辑属性')
            return h('div', [edit, del, opr])
          }
        }
      ],
      editData: {},
      propData: [],
      attributevalue: ''
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
    getTableData () {
      let d = {
        pagesize: this.pageSize,
        page: this.page,
        like: this.searchKey
      }
      this.$store.commit('pageLoading', true)
      serverApi('/goods/attrindex', d,
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
          this.modal_loading = true
          serverApi('/goods/attradd', this.form,
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
          serverApi('/goods/attredit', this.editData,
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
          serverApi('/goods/attrdel', {id: row.id},
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
    operate (row) {
      this.editData = row
      this.$store.commit('pageLoading', true)
      serverApi('/goods/attrcindex', {typeid: row.id},
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.propData = response.data.data.result
            this.oprModal = true
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
    getSortProps (id) {
      serverApi('/goods/attrcindex', {typeid: id},
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.propData = response.data.data.result
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.$Message.error('连接失败！')
        }
      )
    },
    onClickAddProp () {
      if (!this.attributevalue) {
        this.$Message.info('请输入')
        return false
      }
      this.modal_loading = true
      let d = {
        attributevalue: this.attributevalue,
        typeid: this.editData.id
      }
      serverApi('/goods/attrcadd', d,
        response => {
          if (response.data.code === 0){
            this.getSortProps(this.editData.id)
            this.attributevalue = ''
            this.$Message.success(response.data.msg)
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.modal_loading = false
        },
        error => {
          console.log(error)
          this.modal_loading = false
          this.$Message.error('连接失败！')
        }
      )
    },
    onRemoveTag (item) {
      serverApi('/goods/attrcdel', {id: item.id},
        response => {
          if (response.data.code === 0){
            this.getSortProps(this.editData.id)
            this.$Message.info(response.data.msg)
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.modal_loading = false
        },
        error => {
          console.log(error)
          this.modal_loading = false
          this.$Message.error('连接失败！')
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
.propBox{
  padding: 10px;
}
</style>
