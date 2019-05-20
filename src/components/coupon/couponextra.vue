<template>
  <div class="box">
    <Card :bordered="false">
      <div>
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <Button type="primary" style="margin-left:8px" icon="md-add" @click="onClickAdd">新增</Button>
      </div>
    </Card>
    <Card :bordered="false" style="margin-top:12px">
      <div class="body">
        <Table :columns="columns" :data="tableData"></Table>
      </div>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer show-elevator @on-page-size-change="onChangeSize"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>

    <!-- add -->
    <Modal v-model="addModal" width="560">
      <p slot="header" style="text-align:center">
        <span>新增</span>
      </p>
      <Form ref="form" :model="form" :rules="rules" :label-width="95">
        <FormItem label="选择卡券类型">
          <Select v-model="form.cardtypeid">
            <Option v-for="item in typeData" :value="item.id" :key="item.id">{{ item.typename }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="extrainfocode" label="扩展信息编码">
          <Input v-model="form.extrainfocode" placeholder="请输入"></Input>
        </FormItem>
        <FormItem prop="extrainfovalue" label="扩展信息值">
          <Input type="textarea" v-model="form.extrainfovalue" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button  @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="add">提交</Button>
      </div>
    </Modal>

    <!-- edit -->
    <Modal v-model="editModal" width="560">
      <p slot="header" style="text-align:center">
        <span>编辑</span>
      </p>
      <Form ref="formedit" :model="editData" :rules="rules" :label-width="95">
        <FormItem label="选择卡券类型">
          <Select v-model="editData.cardtypeid">
            <Option v-for="item in typeData" :value="item.id" :key="item.id">{{ item.typename }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="extrainfocode" label="扩展信息编码">
          <Input v-model="editData.extrainfocode" placeholder="请输入"></Input>
        </FormItem>
        <FormItem prop="extrainfovalue" label="扩展信息值">
          <Input type="textarea" v-model="editData.extrainfovalue" placeholder="请输入"></Input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button    @click="editModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="edit">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'CouponExtra',
  data () {
    return {
      searchKey: '',
      tableData: [],
      form: {
        cardtypeid: null,
        extrainfocode: '',
        extrainfovalue: ''
      },
      rules: {
        extrainfocode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        extrainfovalue: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      addModal: false,
      editModal: false,
      modal_loading: false,
      count: 0,
      page: 1,
      pageSize: 10,
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 90
        },
        {
          title: '所属卡券类型',
          key: 'typename',
          width: 150
        },
        {
          title: '扩展信息编码',
          key: 'extrainfocode',
          minWidth: 130
        },
        {
          title: '扩展信息值',
          key: 'extrainfovalue',
          minWidth: 130
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: 220,
          fixed: 'right',
          render: (h, params) => {
            return h('div', [
                h('Button', {
                    props: {
                      type: 'text',
                      size: 'small',
                      icon: 'edit'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.onClickEdit(params.row)
                      }
                    }
                }, '编辑'),
                h('Button', {
                    props: {
                      type: 'text',
                      size: 'small',
                      icon: 'trash-a'
                    },
                    on: {
                      click: () => {
                        this.remove(params.row)
                      }
                    }
                }, '删除')
            ])
          }
        }
      ],
      typeData: [],
      editData: {}
    }
  },
  created () {
    this.getTableData()
    this.getCardType()
  },
  methods: {
    onClickSearch () {
      this.page = 1
      this.getTableData()
    },
    getCardType () {
      let d = {
        pagesize: 99999,
        page: 1
      }
      serverApi('/card/type', d,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.typeData = response.data.data.result
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
    getTableData () {
      let d = {
        pagesize: this.pageSize,
        page: this.page,
        like: this.searchKey
      }
      this.$store.commit('pageLoading', true)
      serverApi('/card/cardexpansion', d,
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
      // this.$router.push({name: 'CouponExtraAdd'})
    },
    remove (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除此条信息？</p>',
        onOk: () => {
          serverApi('/card/cardexpansiondel', {id: row.id},
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
    onClickEdit (row) {
      this.editData = row
      this.editModal = true
      // this.$router.push({name: 'CouponExtraEdit', params: {id: row.id}})
    },
    add () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.modal_loading = true
          serverApi('/card/cardexpansionadd', this.form,
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
              this.$Message.error("连接失败！")
            }
          )
        }
      })

    },
    edit () {
      this.modal_loading = true
       delete this.editData._index
      delete this.editData._rowKey
      serverApi('/card/cardexpansionedit', this.editData,
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
          this.$Message.error("连接失败！")
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
</style>
