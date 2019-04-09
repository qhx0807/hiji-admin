<template>
  <div>
    <Card :bordered="false" class="mb10">
      <Form :label-width="60">
        <Row>
          <Col span="24">
            <FormItem label="查询" style="margin-bottom:0">
              <Input placeholder="搜索..." v-model="searchkey" style="width:200px"></Input>
              <Button type="primary" style="margin-left:12px" @click="onClickSearch">搜索</Button>
              <Button type="primary" style="margin-left:12px" @click="onClickAdd">新增</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card :bordered="false">
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
              max-height="600"
              border
              :columns="columns">
              <template slot="id" slot-scope="scope">
                <div>
                  <Button icon="md-create" size="small" type="text" @click="onClickEdit(scope.row)">修改</Button>
                  <Button icon="ios-trash" size="small" type="text" @click="remove(scope.row.id)">删除</Button>
                </div>
              </template>
              <template slot="isshow" slot-scope="scope">
                <div>
                  <Tag>{{scope.row.isshow == 1 ? '显示' : '不显示'}}</Tag>
                </div>
              </template>
            </zk-table>
          </div>
        </Col>
      </Row>
    </Card>

    <!-- add -->
    <Modal v-model="addModal" width="460">
      <p slot="header" style="text-align:center">
        <span>新增部门</span>
      </p>
      <Form ref="form" :model="form" :rules="rules" :label-width="70">
        <FormItem prop="departmentname" label="部门名称">
          <Input v-model="form.departmentname" placeholder="请输入部门名称"></Input>
        </FormItem>
        <FormItem prop="departmentcode" label="部门编码">
          <Input  v-model="form.departmentcode" placeholder="请输入部门编码"></Input>
        </FormItem>
        <FormItem label="是否显示">
          <Select v-model="form.isshow" >
            <Option value="1">显示</Option>
            <Option value="0">不显示</Option>
          </Select>
        </FormItem>
        <!-- <FormItem prop="updid" label="父级部门">
          <Input  v-model="form.updid" placeholder="请输入父级id"></Input>
        </FormItem> -->
        <FormItem prop="updid" label="父级部门">
          <Cascader change-on-select filterable @on-change="onSelectDep" :data="casData"></Cascader>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button    @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="add">提交</Button>
      </div>
    </Modal>
    <!-- edit -->
    <Modal v-model="editModal" width="460">
      <p slot="header" style="text-align:center">
        <span>修改信息</span>
      </p>
      <Form :model="editData" :rules="rules" :label-width="70">
        <FormItem prop="departmentname" label="部门名称">
          <Input v-model="editData.departmentname" placeholder="请输入部门名称"></Input>
        </FormItem>
        <FormItem prop="departmentcode" label="部门编码">
          <Input  v-model="editData.departmentcode" placeholder="请输入部门编码"></Input>
        </FormItem>
        <FormItem label="是否显示">
          <Select v-model="editData.isshow" >
            <Option :value="1">显示</Option>
            <Option :value="0">不显示</Option>
          </Select>
        </FormItem>
        <FormItem prop="updid" label="父级部门">
          <Input  v-model="editData.updid" placeholder="请输入父级id"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="editModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="edit">保存</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import serverApi from '../../axios'
import ZkTable from 'vue-table-with-tree-grid'
export default {
  name: 'Department',
  data () {
    return {
      searchkey: '',
      loading: false,
      addModal: false,
      editModal: false,
      modal_loading: false,
      isFold: true,
      form: {
        departmentname: '',
        departmentcode: '',
        updid: '1',
        isshow: '1'
      },
      rules: {
        departmentname: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        departmentcode: [{ required: true, message: '编码不能为空', trigger: 'blur' }],
        updid: [{ required: true, message: '父级不能为空', trigger: 'blur' }]
      },
      tableData: [],
      columns: [
        {
          label: '部门名称',
          prop: 'departmentname'
        },
        {
          label: '部门编码',
          prop: 'departmentcode',
          width: '200px'
        },
        {
          label: 'ID编号',
          prop: 'id',
          width: '80px'
        },
        {
          label: '是否显示',
          prop: 'isshow',
          width: '110px',
          type: 'template',
          template: 'isshow',
        },
        {
          label: '父级',
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
      casData: []
    }
  },
  components: {
    ZkTable
  },
  created () {
    this.getTableData()
    this.getTableDataCas()
  },
  computed: {
  },
  methods: {
    getTableData () {
      this.$store.commit('pageLoading', true)
      serverApi('/depar/index', {like: this.searchkey},
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.tableData = response.data.data
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
    getTableDataCas () {
      this.$store.commit('pageLoading', true)
      serverApi('/depar/index', null,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            let cas = response.data.data
            let getCas = function (arr) {
              arr.forEach(item => {
                item.label = item.departmentname,
                item.value = item.id
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
    onClickEdit (row) {
      this.editData = Object.assign({}, row)
      this.editModal = true
    },
    edit () {
      delete this.editData._index
      delete this.editData._rowKey
      this.modal_loading = true
      serverApi('/depar/edit', this.editData,
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
          serverApi('/depar/del', {id: id},
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
          serverApi('/depar/add', this.form,
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
    onSelectDep (e) {
      if (e && e.length) {
        this.form.updid = String(e[e.length-1])
      }
    },
    onClickSearch () {
      this.getTableData()
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
