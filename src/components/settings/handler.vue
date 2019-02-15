<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <p>权限句柄配置</p>
    </Card>
    <Card :bordered="false" class="mb10">
      <ul class="item">
        <li @click="onClickItem(item)" v-for="(item, index) in tableData" :key="index">
          <img src="http://cdn.cqyyy.cn/pic/power.png" alt="">
          <p>{{item.typename}}</p>
        </li>
        <li class="add" @click="onClickAdd"><Icon type="ios-add" /></li>
      </ul>
      <div class="clear-fix"></div>
    </Card>

    <!-- add -->
    <Modal v-model="addModal" width="460">
      <p slot="header" style="text-align:center">
        <span>新增类型</span>
      </p>
      <Form ref="form" :model="addData" :rules="rules" :label-width="80">
        <FormItem prop="authdes" label="句柄名称">
          <Input v-model="addData.authdes" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem prop="authcode" label="句柄code">
          <Input  v-model="addData.authcode" placeholder="请输入编码"></Input>
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
        <span>编辑</span>
      </p>
      <Form ref="form" :model="editData" :rules="rules" :label-width="70">
        <FormItem prop="authdes" label="句柄名称">
          <Input v-model="editData.authdes" placeholder="请输入名称"></Input>
        </FormItem>
        <FormItem prop="authcode" label="句柄code">
          <Input  v-model="editData.authcode" placeholder="请输入编码"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button    @click="editModal = false">取消</Button>
        <Button type="error" :loading="modal_loading" @click="remove">删除</Button>
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
      addModal: false,
      editModal: false,
      modal_loading: false,
      loading: false,
      tableData: [],
      editData: {},
      addData: {
        authdes: '',
        authcode: ''
      },
      rules: {
        authdes: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        authcode: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.loading = true
      serverApi('/systemmsg/servicelist', null,
        response => {
          if (response.data.code === 0) {
            // console.log(response)
            this.tableData = response.data.data.result
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.loading = false
        },
        error => {
          this.loading = false
          this.$Message.error(error.toString())
        }
      )
    },
    onClickAdd () {
      this.addData = {
        authdes: '',
        authcode: ''
      }
      this.addModal = true
    },
    add () {
      if (!this.addData.typename || !this.addData.urlimg) {
        this.$Message.warning('请输入内容！')
        return false
      }
      this.modal_loading = true
      serverApi('/systemmsg/serviceadd', this.addData,
        response => {
          if (response.data.code === 0) {
            this.$Message.success(response.data.msg)
            this.getTableData()
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.modal_loading = false
          this.addModal = false
        },
        error => {
          this.modal_loading = false
          this.$Message.error(error.toString())
        }
      )
    },
    onClickItem (item) {
      this.editData = Object.assign({}, item)
      this.editModal = true
    },
    remove () {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除此条信息？</p>',
        onOk: () => {
          serverApi('/systemmsg/servicede', {id: this.editData.id},
            response => {
              this.$Message.info(response.data.msg)
              if (response.data.code === 0) {
                this.getTableData()
                this.$Message.info(response.data.msg)
              } else {
                this.$Message.warning(response.data.msg)
              }
              this.editModal = false
            },
            error => {
              console.log(error)
              this.$Message.error('链接失败！')
            }
          )
        }
      })
    },
    edit () {
      if (!this.editData.typename || !this.editData.urlimg) {
        this.$Message.warning('请输入内容！')
        return false
      }
      this.modal_loading = true
      serverApi('/systemmsg/serviceadd', this.editData,
        response => {
          if (response.data.code === 0) {
            this.$Message.success(response.data.msg)
            this.getTableData()
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.modal_loading = false
          this.editModal = false
        },
        error => {
          this.modal_loading = false
          this.$Message.error(error.toString())
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
.box{
  .item{
    list-style: none;
    padding: 0;
    li{
      float: left;
      width: 100px;
      height: 130px;
      display: block;
      margin-right: 20px;
      border: 1px solid #dcdee2;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      text-align: center;
      padding-top: 5px;
      img{
        // height: 80px;
        width: 60px;
      }
      p{
        margin-top: 8px;
      }
      &.add{
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px dashed #dcdee2;
        i{
          font-size: 50px;
        }
        &:hover{
          color: #5cadff;
          border: 1px dashed #5cadff;
        }
      }
    }
  }
}
</style>
