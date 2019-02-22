<template>
  <div class="box">
    <Card :bordered="false">
      <div class="head">
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <Button type="primary" style="margin-left:8px" icon="md-add" @click="onClickAdd">新增</Button>
      </div>
    </Card>
    <Card :bordered="false" style="margin-top:10px">
      <Table :columns="columns" :data="tableData"></Table>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>

    <Modal v-model="addModal" width="650">
      <p slot="header" style="text-align:center">
        <span>新增</span>
      </p>
      <Form :model="addData" ref="form" :rules="rules" :label-width="80">
        <Row>
          <Col span="12">
            <!-- <FormItem label="图片地址" prop="urlimg">
              <Input v-model="addData.urlimg"></Input>
            </FormItem> -->
            <FormItem label="商户id">
              <Input v-model="addData.merchantid"></Input>
            </FormItem>
            <FormItem label="接收状态" prop="usertype">
              <Select v-model="addData.usertype" >
                <Option :value="0">所有用户收到</Option>
                <Option :value="1">指定用户收到</Option>
                <Option :value="2">指定用户收不到</Option>
              </Select>
            </FormItem>
            <FormItem label="消息类型">
              <Select v-model="addData.type" :label-in-value="true" @on-change="addChange">
                <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.typename }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="发布状态">
              <Select v-model="addData.status">
              <Option :value="0">未发布</Option>
              <Option :value="1">发布</Option>
            </Select>
            </FormItem>
            <FormItem label="存放的用户">
              <Input v-model="addData.userdetails"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="消息内容">
              <Input type="textarea" v-model="addData.msg"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="onSave">发送</Button>
      </div>
    </Modal>
    <Modal v-model="modifyModal" width="650">
      <p slot="header" style="text-align:center">
        <span>修改</span>
      </p>
      <Form :model="modifyData" ref="form" :rules="rules" :label-width="80">
        <Row>
          <Col span="12">
            <!-- <FormItem label="图片地址" prop="urlimg">
              <Input v-model="modifyData.urlimg"></Input>
            </FormItem> -->
            <!-- <FormItem label="id">
              <Input v-model="modifyData.id" disabled></Input>
            </FormItem> -->
            <FormItem label="接收状态">
              <Select v-model="modifyData.usertype">
                <Option :value="0">所有用户收到</Option>
                <Option :value="1">指定用户收到</Option>
                <Option :value="2">指定用户收不到</Option>
              </Select>
            </FormItem>
            <FormItem label="消息类型">
              <Select v-model="modifyData.type" :label-in-value="true" @on-change="perChange">
                <Option v-for="item in typeList" :value="item.id" :key="item.id">{{ item.typename }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <!-- <FormItem label="消息类型">
              <Input v-model="modifyData.type"></Input>
            </FormItem> -->
            <FormItem label="发布状态">
              <Select v-model="modifyData.status">
              <Option :value="0">未发布</Option>
              <Option :value="1">发布</Option>
            </Select>
            </FormItem>
            <FormItem label="存放的用户">
              <Input v-model="modifyData.userdetails"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <!-- <FormItem label="消息名字">
              <Input v-model="modifyData.typename"></Input>
            </FormItem> -->
          </Col>
          <Col span="24">
            <FormItem label="消息内容">
              <Input type="textarea" v-model="modifyData.msg"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="modifyModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="modifySave">保存</Button>
      </div>
    </Modal>
    <!-- <Modal v-model="editModal" width="650">
      <p slot="header" style="text-align:center">
        <span>消息</span>
      </p>
      <Form :model="editData" ref="form" :rules="rules" :label-width="80">
        <Row>
          <Col span="24">
            <FormItem label="消息名字">
              <Input v-model="editData.typename"></Input>
            </FormItem>
          </Col>
          <Col span="24">
            <FormItem label="消息内容">
              <Input type="textarea" v-model="editData.msg"></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="editModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="onSave">发送</Button>
      </div>
    </Modal> -->
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'SysMsg',
  data () {
    return {
      searchKey: '',
      pageSize: 10,
      page: 1,
      count: 0,
      addModal: false,
      editModal: false,
      modifyModal: false,
      modal_loading: false,
      tableData: [],
      typeList: [],
      addData: {
        urlimg: '',
        msg: '',
        type: '',
        status: 1,
        merchantid: '',
        usertype: 0,
        userdetails: '',
        typename: ''
      },
      editData: {},
      modifyData: {
        type: '',
        typename: ''
      },
      rules: {
        sevicemsg: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        usertype: [
          { required: true, message: '请输入名称', trigger: 'blur', type: 'number' }
        ]
      },
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 80
        },
        {
          title: '消息名称',
          key: 'typename',
        },
        {
          title: '类型',
          key: 'type',
        },
        {
          title: '消息内容',
          key: 'msg',
        },
        {
          title: '发布状态',
          key: 'status',
          render: (h, params) => {
            const text = params.row.status == 1 ? '已发布' : '未发布'
            const color = params.row.status == 1 ? 'success' : 'warning'
            return h('Tag', {
              props: {
                color: color,
                type: 'dot'
              }
            }, text)
          }
        },
        {
          title: '存放的用户对象',
          key: 'userdetails',
        },
        {
          title: '操作',
          key: 'id',
          width: 120,
          render: (h, params) => {
            let modify = h('a', {
              style: {
                marginRight: '10px'
              },
              on: {
                click: () => {
                  this.modify(params.row)
                }
              }
            }, '修改')
            // let edit = h('a', {
            //   style: {
            //     marginRight: '10px'
            //   },
            //   on: {
            //     click: () => {
            //       this.onClickEdit(params.row)
            //     }
            //   }
            // }, '回复Ta')
            let del = h('a', {
              style: {
                color: '#f90',
                marginRight: '10px'
              },
              on: {
                click: () => {
                  this.remove(params.row)
                }
              }
            }, '删除')

            return h('div', [modify, del])
          }
        },
      ]
    }
  },
  created () {
    this.getTableData()
    this.messageType()
  },
  methods: {
    onClickSearch () {
      this.page = 1
      this.getTableData()
    },
    changePage (e) {
      this.page = e
      this.getTableData()
    },
    onChangeSize (e) {
      this.pageSize = e
      this.getTableData()
    },
    getTableData () {
      let d = {
        pagesize: this.pageSize,
        page: this.page,
        like: this.searchKey,
        smid: '',
        status: ''
      }
      this.$store.commit('pageLoading', true)
      serverApi('/systemmsg/msglist', d,
        response => {
          console.log(response)
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
        }
      )
    },
    messageType () {
      let d = {
        pagesize: 999,
        page: 1
      }
      serverApi('/systemmsg/servicelist', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.typeList = response.data.data.result
            console.log(this.typeList)
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
    perChange (e) {
      console.log(e)
      console.log(e.value)
      console.log(e.label)
      this.modifyData.typename = e.label
      // this.modifyData.type = e.value
    },
    addChange (e) {
      console.log(e)
      console.log(e.value)
      console.log(e.label)
      this.addData.typename = e.label
    },
    onClickAdd () {
      this.addData = {
        urlimg: '',
        msg: '',
        type: '',
        status: 1,
        merchantid: '',
        usertype: '',
        userdetails: '',
        typename: ''
      }
      this.addModal = true
    },
    onSave () {
      console.log(this.addData)
      this.modal_loading = true
      serverApi('/systemmsg/index', this.addData,
        response => {
          if (response.data.code === 0) {
            this.$Message.success(response.data.msg)
            this.getTableData()
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.addModal = false
          this.modal_loading = false
        },
        error => {
          this.modal_loading = false
          this.$Message.error(error.toString())
        }
      )
    },
    // onClickEdit (row) {
    //   this.editData = row
    //   this.editModal = true
    // },
    remove (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除此条记录？',
        loading: true,
        onOk: () => {
          serverApi('/systemmsg/msgdel', { id: row.id },
            response => {
              if (response.data.code === 0) {
                this.$Message.success(response.data.msg)
                this.getTableData()
              } else {
                this.$Message.warning(response.data.msg)
              }
              this.$Modal.remove()
            },
            error => {
              this.$Modal.remove()
              this.$Message.error(error.toString())
            }
          )
        }
      })
    },
    modify (row) {
      console.log(row)
      this.modifyModal = true
      this.modifyData = row
    },
    modifySave () {
      this.modifyModal = false
      console.log(this.modifyData)
      serverApi('/systemmsg/index', this.modifyData,
        response => {
          if (response.data.code === 0) {
            this.$Message.success(response.data.msg)
            this.getTableData()
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.editModal = false
          this.modal_loading = false
        },
        error => {
          this.modal_loading = false
          this.editModal = false
          this.$Message.error(error.toString())
        }
      )
    },
    onSaveEdit () {
      if (!this.editData.sevicemsg) {
        this.$Message.warning('请输入内容！')
        return false
      }
      this.modal_loading = true
      serverApi('/service/servicetreate', this.editData,
        response => {
          if (response.data.code === 0) {
            this.$Message.success(response.data.msg)
            this.getTableData()
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.editModal = false
          this.modal_loading = false
        },
        error => {
          this.modal_loading = false
          this.editModal = false
          this.$Message.error(error.toString())
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>

</style>
