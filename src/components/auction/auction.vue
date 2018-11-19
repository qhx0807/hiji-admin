<style lang="less">
.wrap{
  padding: 8px;
  position: relative;
}
.tableBox{
  padding-top: 12px;
}
</style>

<template>
<Card>
 <div class="head">
      <Button type="primary" @click="onClickAdd">新增</Button>
    </div>
    <Row>
      <Col span="24">
        <div class="tableBox">
          <zk-table
            :data="tableData"
            show-index
            :tree-type="false"
            :selection-type="false"
            :expand-type="false"
            :columns="columns">
            <template slot="id" slot-scope="scope">
              <div>
                <Button  icon="md-create" size="small" type="text"  @click="edit(scope.row)">修改</Button>
                <Button  icon="ios-trash" size="small" type="text" @click="del(scope.row.id)">删除</Button>
              </div>
            </template>
          </zk-table>
        </div>
      </Col>
    </Row>

    <!-- add -->
    <Modal v-model="addModal" width="460">
      <p slot="header" style="text-align:center">
        <span>新增用户</span>
      </p>
      <Form ref="form" :model="form" :rules="rules" :label-width="80">
        <FormItem prop="name" label="用户名">
          <Input v-model="form.name" placeholder="请输入用户名"></Input>
        </FormItem>
        <FormItem prop="pass" label="密码">
          <Input  v-model="form.pass" placeholder="请输入密码"></Input>
        </FormItem>
        <FormItem prop="tel" label="联系电话">
          <Input  v-model="form.tel" placeholder="请输入联系电话"></Input>
        </FormItem>
         <FormItem prop="contacts" label="联系人">
          <Input  v-model="form.contacts" placeholder="请输入联系人"></Input>
        </FormItem>
        <FormItem prop="company" label="所在公司">
          <Input  v-model="form.company" placeholder="请输入所在公司"></Input>
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
        <span>编辑用户</span>
      </p>
      <Form :model="editData" :rules="rules" :label-width="80">
        <FormItem prop="name" label="用户名">
          <Input v-model="editData.name" placeholder="请输入用户名" disabled></Input>
        </FormItem>
        <FormItem prop="pass" label="密码">
          <Input  v-model="editData.pass" placeholder="请输入密码"></Input>
        </FormItem>
        <FormItem prop="tel" label="联系电话">
          <Input  v-model="editData.tel" placeholder="请输入联系电话"></Input>
        </FormItem>
         <FormItem prop="contacts" label="联系人">
          <Input  v-model="editData.contacts" placeholder="请输入联系人"></Input>
        </FormItem>
        <FormItem prop="company" label="所在公司">
          <Input  v-model="editData.company" placeholder="请输入所在公司"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button    @click="editModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="save">提交</Button>
      </div>
    </Modal>
</Card>
</template>

<script>
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'
export default {
  name: 'auction',
  components: {
    ZkTable
  },
  data() {
    return {
      loading: false,
      addModal: false,
      editModal: false,
      modal_loading: false,
      tableData: [],
      editData: {},
      form: {
        name: '',
        pass: '',
        tel: '',
        contacts: '',
        company: ''
      },
      rules: {
        name: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        pass: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
        tel: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
        contacts: [
          { required: true, message: '联系人不能为空', trigger: 'blur' }
        ],
        company: [
          { required: true, message: '所在公司不能为空', trigger: 'blur' }
        ]
      },
      columns: [
        {
          label: 'id',
          prop: 'id',
          width: '120px'
        },
        {
          label: '用户名',
          prop: 'name',
          width: '150px'
        },
        {
          label: '联系电话',
          prop: 'tel'
        },
        {
          label: '联系人',
          prop: 'contacts'
        },
        {
          label: '所在公司',
          prop: 'company'
        },
        {
          label: '操作',
          prop: 'id',
          type: 'template',
          template: 'id',
          width: '200px'
        }
      ]
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData () {
      this.$store.commit('pageLoading', true)
      axios
        .post('http://server.cqyyy.cn/index.php/activity/manage/index', {})
        .then(res => {
          if (res.data.code == 0) {
            // console.log(res.data.data)
            this.tableData = res.data.data
          } else {
            this.$Message.warning(res.data.msg)
          }
          this.$store.commit('pageLoading', false)
        })
        .catch(err => {
          console.log(err)
          this.$store.commit('pageLoading', false)
        })
    },
    onClickAdd () {
      this.addModal = true
    },
    edit (data) {
      this.editModal = true
      this.editData = Object.assign({}, data)
    },
    save () {
      this.modal_loading = true
      axios
        .post(
          'http://server.cqyyy.cn/index.php/activity/manage/edituser',
          this.editData
        )
        .then(res => {
          this.modal_loading = false
          if (res.data.code === 0) {
            this.editModal = false
            this.getData()
          }
          this.$Message.info(res.data.msg)
        })
        .catch(err => {
          console.log(err)
          this.modal_loading = false
        })
    },
    add () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.modal_loading = true
          console.log(this.form)
          axios
            .post(
              'http://server.cqyyy.cn/index.php/activity/manage/adduser',
              this.form
            )
            .then(res => {
              this.modal_loading = false
              if (res.data.code === 0) {
                this.addModal = false
                this.getData()
              }
              this.$Message.info(res.data.msg)
            })
            .catch(err => {
              console.log(err)
              this.modal_loading = false
            })
        }
      })
    },
    del (id) {
      if (id) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确认删除此条信息？</p>',
          onOk: () => {
            axios
              .post('http://server.cqyyy.cn/index.php/activity/manage/deluser', {
                id: id
              })
              .then(res => {
                if (res.data.code === 0) {
                  this.getData()
                }
                this.$Message.info(res.data.msg)
              })
              .catch(err => {
                console.log(err)
                this.$Message.error('链接失败！')
              })
          }
        })
      }
    }
  }
}
</script>
