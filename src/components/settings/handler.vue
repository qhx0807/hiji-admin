<template>
  <div class="box">
    <Card :bordered="false">
      <Row>
        <Col span="24" style="padding-bottom:12px">
          <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
          <Button type="primary" icon="ios-search" @click="onClickSearch">搜索</Button>
          <Button type="primary" icon="plus" style="margin-left:8px" @click="onClickAdd">新增</Button>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <div class="tableBox">
            <Table size="small" :columns="columns" :data="tableData"></Table>
            <zk-table
              :data="table"
              :columns="tbcol"
            ></zk-table>
          </div>
        </Col>
      </Row>
    </Card>

    <!-- add -->
    <Modal v-model="addModal" width="460">
      <p slot="header" style="text-align:center">
        <span>新增部门</span>
      </p>
      <Form ref="form" :model="form" :rules="rules" label-with="80">
        <FormItem prop="departmentname" label="部门名称">
          <Input v-model="form.departmentname" placeholder="请输入部门名称"></Input>
        </FormItem>
        <FormItem prop="departmentcode" label="部门编码">
          <Input  v-model="form.departmentcode" placeholder="请输入部门编码"></Input>
        </FormItem>
        <FormItem prop="updid" label="父级部门">
          <Input  v-model="form.updid" placeholder="请输入父级id"></Input>
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
      <Form :model="editData" :rules="rules" label-with="80">
        <FormItem prop="departmentname" label="部门名称">
          <Input v-model="editData.departmentname" placeholder="请输入部门名称"></Input>
        </FormItem>
        <FormItem prop="departmentcode" label="部门编码">
          <Input  v-model="editData.departmentcode" placeholder="请输入部门编码"></Input>
        </FormItem>
        <FormItem prop="updid" label="父级部门">
          <Input  v-model="editData.updid" placeholder="请输入父级id"></Input>
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
  name: 'Handler',
  data () {
    return {
      loading: false,
      addModal: false,
      editModal: false,
      modal_loading: false,
      searchKey: '',
      form: {
        departmentname: '',
        departmentcode: '',
        updid: '1'
      },
      rules: {
        departmentname: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        departmentcode: [{ required: true, message: '编码不能为空', trigger: 'blur' }],
        updid: [{ required: true, message: '父级不能为空', trigger: 'blur' }]
      },
      tableData: [],
      columns: [
        {
          title: 'id编号',
          key: 'id',
          width: 120
        },
        {
          title: '部门名称',
          key: 'departmentname'
        },
        {
          title: '部门编码',
          key: 'departmentcode'
        },
        {
          title: '父级',
          key: 'updid'
        },
        {
          title: '操作',
          key: 'id',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.editData = Object.assign({}, params.row)
                    this.editModal = true
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
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
      editData: {},
      table: [
        {
            name: 'Jack',
            sex: 'male',
            likes: ['football', 'basketball'],
            score: 10,
            children: [
              {
                name: 'Ashley',
                sex: 'female',
                likes: ['football', 'basketball'],
                score: 20,
                children: [
                  {
                    name: 'Ashley',
                    sex: 'female',
                    likes: ['football', 'basketball'],
                    score: 20,
                  },
                  {
                    name: 'Taki',
                    sex: 'male',
                    likes: ['football', 'basketball'],
                    score: 10,
                    children: [
                      {
                        name: 'Ashley',
                        sex: 'female',
                        likes: ['football', 'basketball'],
                        score: 20,
                      },
                      {
                        name: 'Taki',
                        sex: 'male',
                        likes: ['football', 'basketball'],
                        score: 10,
                        children: [
                          {
                            name: 'Ashley',
                            sex: 'female',
                            likes: ['football', 'basketball'],
                            score: 20,
                          },
                          {
                            name: 'Taki',
                            sex: 'male',
                            likes: ['football', 'basketball'],
                            score: 10,
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                name: 'Taki',
                sex: 'male',
                likes: ['football', 'basketball'],
                score: 10,
              },
            ],
          },
          {
            name: 'Tom',
            sex: 'male',
            likes: ['football', 'basketball'],
            score: 20,
            children: [
              {
                name: 'Ashley',
                sex: 'female',
                likes: ['football', 'basketball'],
                score: 20,
                children: [
                  {
                    name: 'Ashley',
                    sex: 'female',
                    likes: ['football', 'basketball'],
                    score: 20,
                  },
                  {
                    name: 'Taki',
                    sex: 'male',
                    likes: ['football', 'basketball'],
                    score: 10,
                  },
                ],
              },
              {
                name: 'Taki',
                sex: 'male',
                likes: ['football', 'basketball'],
                score: 10,
                children: [
                  {
                    name: 'Ashley',
                    sex: 'female',
                    likes: ['football', 'basketball'],
                    score: 20,
                  },
                  {
                    name: 'Taki',
                    sex: 'male',
                    likes: ['football', 'basketball'],
                    score: 10,
                  },
                ],
              },
            ],
          },
          {
            name: 'Tom',
            sex: 'male',
            likes: ['football', 'basketball'],
            score: 20,
          },
          {
            name: 'Tom',
            sex: 'male',
            likes: ['football', 'basketball'],
            score: 20,
            children: [
              {
                name: 'Ashley',
                sex: 'female',
                likes: ['football', 'basketball'],
                score: 20,
              },
              {
                name: 'Taki',
                sex: 'male',
                likes: ['football', 'basketball'],
                score: 10,
              },
            ],
          }
      ],
      tbcol: [
        {
            label: 'name',
            prop: 'name',
            width: '400px',
          },
          {
            label: 'sex',
            prop: 'sex',
            minWidth: '50px',
          },
          {
            label: 'score',
            prop: 'score',
          },
          {
            label: 'likes',
            prop: 'likes',
            minWidth: '200px',
            type: 'template',
            template: 'likes',
          }
      ]
    }
  },
  created () {
    this.getTableData()

  },
  methods: {
    getTableData () {
      this.$store.commit('pageLoading', true)
      serverApi('/depar/index', '',
        response => {
          console.log(response)
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
    edit () {
      delete this.editData._index
      delete this.editData._rowKey
      this.modal_loading = true
      serverApi('/depar/edit', this.editData,
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
    onClickSearch () {

    }
  }
}
</script>

<style lang="less" scoped>

</style>
