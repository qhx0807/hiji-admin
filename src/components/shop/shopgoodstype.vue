<template>
  <div class="">
    <Card :bordered="false" class="mb10">
      <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
      <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
      <Button type="primary" style="margin-left:8px" @click="onClickAdd" icon="plus">新增</Button>
    </Card>
    <Card :bordered="false">
      <Row>
        <Col span="24">
          <zk-table
              :data="tableData"
              show-index
              children-prop="child"
              :tree-type="true"
              :selection-type="false"
              :is-fold="isFold"
              :expand-type="false"
              :columns="columns">
              <template slot="id" slot-scope="scope">
                <div>
                  <Button icon="edit" size="small" type="text" @click="onClickEdit(scope.row)">修改</Button>
                  <Button icon="trash-a" size="small" type="text" @click="remove(scope.row.id)">删除</Button>
                </div>
              </template>
            </zk-table>
        </Col>
      </Row>
    </Card>

    <!-- add -->
    <Modal v-model="addModal" width="500">
      <p slot="header" style="text-align:center">
        <span>新增分类</span>
      </p>
      <Form ref="form" :model="form" :rules="rules" :label-width="70">
        <FormItem prop="name" label="名称">
          <Input v-model="form.name" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem prop="sort" label="排序">
          <Input  v-model="form.sort" placeholder="请输入"></Input>
        </FormItem>
        <FormItem prop="updid" label="父级分类">
          <Cascader change-on-select @on-change="onSelectDep" :data="casData"></Cascader>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="ghost"  @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="add">提交</Button>
      </div>
    </Modal>
    <!-- add -->
    <Modal v-model="editModal" width="500">
      <p slot="header" style="text-align:center">
        <span>修改信息</span>
      </p>
      <Form ref="editData" :model="editData" :rules="rules" :label-width="100">
        <FormItem prop="name" label="名称">
          <Input v-model="editData.name" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem prop="sort" label="排序">
          <Input  v-model="editData.sort" placeholder="请输入"></Input>
        </FormItem>
        <!-- <FormItem prop="updid" label="父级分类">
          <Cascader change-on-select @on-change="onSelectDep" :data="casData"></Cascader>
        </FormItem> -->
        <FormItem label="当前父级ID">
          <Input  v-model="editData.upname" disabled></Input>
        </FormItem>
        <FormItem prop="updid" label="修改父级ID为">
          <Input  v-model="editData.updid" placeholder="请输入父级id"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="ghost"  @click="editModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="edit">提交</Button>
      </div>
    </Modal>

  </div>
</template>
<script>
import serverApi from '../../axios'
import ZkTable from 'vue-table-with-tree-grid'
export default {
  name: 'ShopGoodsType',
  data () {
    return {
      tableData: [],
      casData: [],
      addModal: false,
      editModal: false,
      modal_loading: false,
      isFold: true,
      form: {
        name: '',
        sort: '',
        updid: '1',
        img: ''
      },
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '不能为空', trigger: 'blur' }],
        updid: [{ required: true, message: '父级不能为空', trigger: 'blur' }]
      },
      columns: [
        {
          label: '名称',
          prop: 'name'
        },
        {
          label: '排序',
          prop: 'sort',
          width: '90px'
        },
        {
          label: 'ID编号',
          prop: 'id',
          width: '90px'
        },
        {
          label: '父级ID',
          prop: 'updid',
          width: '80px'
        },
        {
          label: '操作',
          prop: 'id',
          type: 'template',
          template: 'id',
          width: '200px'
        }
      ],
      editData: {},
    }
  },
  created () {
    this.getTableData()
  },
  components: {
    ZkTable
  },
  methods: {
    onClickSearch () {
      this.getTableData()
    },
    getTableData () {
      this.$store.commit('pageLoading', true)
      serverApi('/categroy/index', null,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.tableData = response.data.data
            let cas = this.tableData.concat([])
            let getCas = function (arr) {
              arr.forEach(item => {
                item.label = item.name,
                item.value = item.id
                item.children = item.child
                if (item.child.length > 0) {
                  getCas(item.child)
                }
              })
            }
            getCas(cas)
            cas.push({
              label: '顶级分类root',
              value: '0'
            })
            this.casData = cas
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
      this.$refs.form.resetFields()
      this.addModal = true
    },
    onSelectDep (e) {
      if (e && e.length) {
        this.form.updid = String(e[e.length-1])
      }
    },
    onClickEdit (row) {
      this.editData = Object.assign({}, row)
      this.editModal = true
    },
    add () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.modal_loading = true
          serverApi('/categroy/cateadd', this.form,
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
    edit () {
      delete this.editData._index
      delete this.editData._rowKey
      this.modal_loading = true
      serverApi('/categroy/cateedit', this.editData,
        response => {
          this.modal_loading = false
          if (response.data.code === 0) {
            this.editModal = false
            this.getTableData()
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
          serverApi('/categroy/catedel', {id: id},
            response => {
              if (response.data.code === 0) {
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
  }
}
</script>
<style lang="less" scoped>

</style>
