<template>
  <Card :bordered="false">
    <Row>
      <Col span="24">
        <Input v-model="searchKey"  placeholder="Search..." style="width: 230px"></Input>
        <Button type="default" class="ml10">搜索</Button>
        <Button type="default" class="ml10" @click="exportTable">导出</Button>
        <Button type="primary" class="ml10" @click="onClickAdd">新增</Button>
      </Col>
    </Row>
    <Row>
      <Col span="24">
        <div class="tableBox">
          <zk-table
            style="width:100%"
            :data="searchData"
            children-prop="child"
            :selection-type="false"
            :show-row-hover="false"
            :expand-type="false"
            :stripe="false"
            :border="false"
            :columns="columns">
            <template slot="id" slot-scope="scope">
              <div>
                <Button icon="edit" size="small" type="text" @click="onClickEdit(scope.row)">修改</Button>
                <Button icon="trash-a" size="small" type="text" @click="remove(scope.row.id)">删除</Button>
              </div>
            </template>
            <template slot="url" slot-scope="scope">
              <code class="code">{{scope.row.url}}</code>
            </template>
            <template slot="parameter" slot-scope="scope">
              <code class="code">{{scope.row.parameter}}</code>
            </template>
            <template slot="res" slot-scope="scope">
              <code class="code">{{scope.row.res}}</code>
            </template>
          </zk-table>
        </div>
      </Col>
    </Row>

    <!-- add -->
    <Modal v-model="addModal" width="600">
      <p slot="header" style="text-align:center">
        <span>新增</span>
      </p>
      <Form ref="form" :model="form" :rules="rules" :label-width="70">
        <FormItem prop="name" label="接口名称">
          <Input v-model="form.name" placeholder="请输入接口名称"></Input>
        </FormItem>
        <FormItem prop="url" label="API地址">
          <Input  v-model="form.url" placeholder="请输入路由地址"></Input>
        </FormItem>
        <FormItem prop="parameter" label="参数">
          <Input type="textarea" v-model="form.parameter" ></Input>
        </FormItem>
        <FormItem prop="res" label="返回值">
          <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model="form.res" ></Input>
        </FormItem>
        <FormItem label="说明">
          <Input  type="textarea" v-model="form.explain"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="ghost"  @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="add">提交</Button>
      </div>
    </Modal>

    <!-- edit -->
    <Modal v-model="editModal" width="600">
      <p slot="header" style="text-align:center">
        <span>修改信息</span>
      </p>
      <Form :model="editData"  :rules="rules" :label-width="70">
        <FormItem prop="name" label="接口名称">
          <Input v-model="editData.name" placeholder="请输入接口名称"></Input>
        </FormItem>
        <FormItem prop="url" label="API地址">
          <Input  v-model="editData.url" placeholder="请输入路由地址"></Input>
        </FormItem>
        <FormItem prop="parameter" label="参数">
          <Input type="textarea" v-model="editData.parameter" ></Input>
        </FormItem>
        <FormItem prop="res" label="返回值">
          <Input type="textarea" :autosize="{minRows: 2,maxRows: 5}" v-model="editData.res" ></Input>
        </FormItem>
        <FormItem label="说明">
          <Input  type="textarea" v-model="editData.explain"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="ghost"  @click="editModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="edit">保存</Button>
      </div>
    </Modal>

  </Card>
</template>

<script>
import serverApi from '../../axios'
import {arrSearch} from '../../utlis/tools.js'
import exportExcel from '../../utlis/table2excel.js'
export default {
  name: 'Api',
  data () {
    return {
      loading: false,
      addModal: false,
      editModal: false,
      modal_loading: false,
      isFold: true,
      searchKey: '',
      form: {
        name: '',
        url: '',
        explain: '',
        parameter: '无',
        res: '',
        bak1: '',
        bak2: '',
        bak3: '',
      },
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        url: [{ required: true, message: '地址不能为空', trigger: 'blur' }]
      },
      tableData: [],
      columns: [
        {
          label: '名称',
          prop: 'name',
          width: '120px'
        },
        {
          label: '地址',
          prop: 'url',
          type: 'template',
          template: 'url',
          width: '120px'
        },
        {
          label: '参数',
          prop: 'parameter',
          type: 'template',
          template: 'parameter',
        },
        {
          label: '返回值',
          prop: 'res',
          type: 'template',
          template: 'res'
        },
        {
          label: '说明',
          prop: 'explain',
          width: '180px'
        },
        {
          label: '操作',
          prop: 'id',
          type: 'template',
          template: 'id',
          width: '160px'
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
    searchData(){
      var search =  this.searchKey
      return arrSearch(this.tableData, search)
    }
  },
  methods: {
    getTableData () {
      this.$store.commit('pageLoading', true)
      serverApi('/api/index', '',
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
      serverApi('/api/edit', this.editData,
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
          serverApi('/api/del', {id: id},
            response => {
              this.$Message.info(response.data.msg)
              this.getTableData()
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
          serverApi('/api/add', this.form,
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
    exportTable () {
      if (this.searchData.length > 0) {
        exportExcel(this.searchData, 'Api表格导出')
      } else {
        this.$Message.info('无数据！！')
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
    width: 100%;
    overflow: hidden;
  }
  .tableBox{
    padding-top: 12px;
    width: 100%;
  }
  .ml10{
    margin-left: 8px;
  }
  .code{
    background-color: #F3F3F3;
    padding: 2px 8px;
    font-family: 'Consolas';
    display: block;
    font-size: 12px;
    line-height: 16px;
    border-radius: 2px;
  }
</style>
