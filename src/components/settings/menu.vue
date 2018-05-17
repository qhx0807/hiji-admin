<template>
  <div class="wrap">
    <div class="head">
      <Button type="primary" @click="onClickAdd">新增</Button>
    </div>
    <Row>
      <Col span="24">
        <div class="tableBox">
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
                <!-- <Button icon="plus" size="small" type="text" @click="onClickEdit(scope.row)">添加</Button> -->
                <Button icon="edit" size="small" type="text" @click="onClickEdit(scope.row)">修改</Button>
                <Button icon="trash-a" size="small" type="text" @click="remove(scope.row.id)">删除</Button>
              </div>
            </template>
            <template slot="icon" slot-scope="scope">
              <Icon :type="scope.row.icon" size="20" color="#5cadff"></Icon>
            </template>
          </zk-table>
        </div>
      </Col>
    </Row>

    <!-- add -->
    <Modal v-model="addModal" width="460">
      <p slot="header" style="text-align:center">
        <span>新增菜单</span>
      </p>
      <Form ref="form" :model="form" :rules="rules" :label-width="70">
        <FormItem prop="name" label="菜单名称">
          <Input v-model="form.name" placeholder="请输入菜单名称"></Input>
        </FormItem>
        <FormItem prop="url" label="路由地址">
          <Input  v-model="form.url" placeholder="请输入路由地址"></Input>
        </FormItem>
        <!-- <FormItem prop="updid" label="上级菜单">
          <Input  v-model="form.updid" placeholder="请输入父级id"></Input>
        </FormItem> -->
        <FormItem label="菜单图标">
          <Input  v-model="form.icon" placeholder="请输入icon"></Input>
        </FormItem>
        <FormItem prop="updid" label="上级菜单">
          <Cascader change-on-select @on-change="onSelectDep" :data="casData"></Cascader>
        </FormItem>
      </Form>

      <div slot="footer">
        <Button type="ghost"  @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="add">提交</Button>
      </div>
    </Modal>

    <!-- edit -->
    <Modal v-model="editModal" width="460">
      <p slot="header" style="text-align:center">
        <span>修改信息</span>
      </p>
      <Form :model="editData"  :rules="rules" :label-width="70">
        <FormItem prop="name" label="菜单名称">
          <Input v-model="editData.name" placeholder="请输入菜单名称"></Input>
        </FormItem>
        <FormItem prop="url" label="路由地址">
          <Input  v-model="editData.url" placeholder="请输入路由地址"></Input>
        </FormItem>
        <FormItem prop="updid" label="父级菜单">
          <Input  v-model="editData.updid" placeholder="请输入父级id"></Input>
        </FormItem>
        <FormItem label="菜单图标">
          <Input  v-model="editData.icon" placeholder="请输入icon"></Input>
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
  name: 'Menu',
  data () {
    return {
      loading: false,
      addModal: false,
      editModal: false,
      modal_loading: false,
      isFold: true,
      form: {
        name: '',
        url: '',
        updid: '1',
        icon: ''
      },
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        // url: [{ required: true, message: '路由不能为空', trigger: 'blur' }],
        updid: [{ required: true, message: '父级不能为空', trigger: 'blur' }]
      },
      tableData: [],
      columns: [
        {
          label: '菜单名称',
          prop: 'name'
        },
        {
          label: '路由',
          prop: 'url',
        },
        {
          label: 'ICON',
          prop: 'icon',
          width: '200px',
          type: 'template',
          template: 'icon'
        },
        {
          label: 'ID编号',
          prop: 'id',
        },
        {
          label: '创建时间',
          prop: 'createtime',
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
      casData: []
    }
  },
  created () {
    this.getTableData()

  },
  computed: {
  },
  methods: {
    getTableData () {
      this.$store.commit('pageLoading', true)
      serverApi('/menu/index', '',
        response => {
          // console.log(response)
          if (response.data.code === 0){
            let cas = this._.cloneDeep(response.data.data)
            this.tableData = response.data.data
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
              label: '根目录菜单',
              value: '1'
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
      serverApi('/menu/edit', this.editData,
        response => {
          this.modal_loading = false
          if (response.data.code === 0) {
            this.editModal = false
          }
          this.$Message.info(response.data.msg)
          this.getTableData()
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
          serverApi('/menu/del', {id: id},
            response => {
              this.$Message.info(response.data.msg)
              if (response.data.code === 0) {
                this.getTableData()
              }
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
          serverApi('/menu/add', this.form,
            response => {
              this.modal_loading = false
              console.log(response)
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
    onSelectDep (e) {
      if (e && e.length) {
        this.form.updid = String(e[e.length-1])
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .head{
    padding: 0;
  }
  .wrap{
    padding: 8px;
    position: relative;
  }
  .tableBox{
    padding-top: 12px;
  }
</style>
