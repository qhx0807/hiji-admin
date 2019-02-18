<template>
  <div class="box">
    <Spin fix v-show="loading"></Spin>
    <Card :bordered="false" class="mb10">
      <p>权限句柄配置</p>
    </Card>
    <Card :bordered="false" class="mb10">
      <ul class="item">
        <li v-for="(item, index) in tableData" @click.self="seeMenuAuth(item)" :key="index">
          <Icon type="ios-settings" class="edit" @click.native="onClickItem(item)"/>
          <img @click.self="seeMenuAuth(item)" src="http://cdn.cqyyy.cn/pic/power.png" alt="">
          <p @click.self="seeMenuAuth(item)">{{item.authdes}}</p>
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
        <Button type="error" :loading="delLoading" @click="remove">删除</Button>
        <Button type="primary" :loading="modal_loading" @click="edit">保存</Button>
      </div>
    </Modal>

    <!-- auth -->
    <Modal v-model="authModal" width="460">
      <p slot="header" style="text-align:center">
        <span>{{authObj.authdes}}-权限句柄配置</span>
      </p>
      <div class="authbox">
        <Tree ref="tree" :data="authList" show-checkbox multiple></Tree>
      </div>
      <div slot="footer">
        <Button @click="authModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="editAuth">保存</Button>
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
      delLoading: false,
      loading: false,
      authModal: false,
      tableData: [],
      editData: {},
      authList: [],
      authObj: {},
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
      serverApi('/role/authlist', null,
        response => {
          if (response.data.code === 0) {
            // console.log(response)
            this.tableData = response.data.data
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
      if (!this.addData.authdes || !this.addData.authcode) {
        this.$Message.warning('请输入内容！')
        return false
      }
      this.modal_loading = true
      serverApi('/role/authedit', this.addData,
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
          serverApi('/role/authdel', {id: this.editData.id},
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
      if (!this.editData.authdes || !this.editData.authcode) {
        this.$Message.warning('请输入内容！')
        return false
      }
      this.modal_loading = true
      serverApi('/role/authedit', this.editData,
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
    },
    seeMenuAuth (item) {
      const msg = this.$Message.loading({
        content: 'Loading...',
        duration: 0
      })
      this.authObj = item
      serverApi('/role/authoritylist', {authid: item.id},
        response => {
          this.$Message.destroy()
          if (response.data.code === 0) {
            this.authList = response.data.data
            this.authModal = true
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.destroy()
          console.log(error)
          this.$Message.error(error.toString())
        }
      )
    },
    editAuth () {
      this.modal_loading = true
      const auth = this.$refs.tree.getCheckedNodes()
      let arr = []
      auth.forEach(e => {
        arr.push(e.id)
      })
      let d = {
        menusid: arr.join(','),
        authid: this.authObj.id
      }
      serverApi('/role/authorityedit', d,
        response => {
          this.modal_loading = false
          if (response.data.code === 0) {
            this.$Message.success(response.data.msg)
            this.authModal = false
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.modal_loading = false
          console.log(error)
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
      padding: 5px;
      position: relative;
      margin-bottom: 18px;
      &:hover{
        .edit{
          display: block;
        }
      }
      .edit{
        font-size: 20px;
        position: absolute;
        right: 3px;
        display: none;
        color: red;
      }
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
        color: #dcdee2;
        i{
          font-size: 50px;
          color: #dcdee2;
        }
        &:hover{
          color: #5cadff;
          border: 1px dashed #5cadff;
        }
      }
    }
  }
}
.authbox{
  height: 320px;
  overflow: auto;
  padding-left: 20px;
}
</style>
