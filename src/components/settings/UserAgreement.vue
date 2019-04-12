<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Input v-model="searchKey" placeholder="搜索..." style="width: 230px" />
      <Button type="primary" icon="md-add" style="margin-left:12px" @click="onClickAdd">新增</Button>
    </Card>
    <Card :bordered="false" >
      <Table ref="table" :loading="tableLoading" size="small" :columns="columns" :data="tableData"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="counts" show-sizer show-total :page-size="100" :current="page" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
    <Modal v-model="addModal" width="460">
      <p slot="header" style="text-align:center">
        <span>新增协议</span>
      </p>
      <Form ref="form" :model="addData" :rules="rules" :label-width="70">
        <FormItem label="协议名称">
          <Input v-model="addData.protocolname" placeholder="请输入协议名称"></Input>
        </FormItem>
        <FormItem label="协议类型">
          <Select v-model="addData.protocoltype" >
            <Option value="1">注册使用</Option>
            <Option value="2">登录使用</Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="add">提交</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'UserAgreement',
  data () {
    return {
      searchKey: '',
      addModal: false,
      modal_loading: false,
      tableLoading: false,
      page: 1,
      pagesize: 10,
      addData: {
        protocoltype: '1',
        protocolname: '',
        content: ''
      },
      tableData: [],
      counts: 0,
      columns: [
        {
          title: '#',
          key: 'protocolid',
          width: 60,
          align: 'center'
        },
        {
          title: '协议名称',
          key: 'protocolname',
        },
        {
          title: '类型',
          key: 'protocoltype',
        },
        {
          title: '协议内容',
          key: 'content',
        },
        {
          title: '操作',
          key: 'protocolid',
          fixed: 'right',
          width: 120,
          render: (h, params) => {
            let edit =  h('a', {
              on: {
                click: () => {
                  this.onClickEdit(params.row)
                }
              }
            }, '编辑')
            let del =  h('a', {
              style: {
                marginLeft: '12px',
                color: '#f90'
              },
              on: {
                click: () => {
                  this.onClickDel(params.row)
                }
              }
            }, '删除')
            return h('div', [edit, del])
          }
        },
      ]
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.tableLoading = true
      let d = {
        page: this.page,
        pagesize: this.pagesize,
      }
      serverApi('/Protocol/Protocollist', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.tableData = response.data.data.result
            this.counts =  response.data.data.counts
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.tableLoading = false
        },
        error => {
          console.log(error)
          this.tableLoading = false
        }
      )
    },
    onClickAdd () {
      this.addModal = true
    },
    changePage (e) {
      this.page = e
    },
    add () {
      if (!this.addData.protocolname) {
        this.$Message.warning('请输入名称！')
        return false
      }
      this.modal_loading = true
      serverApi('/Protocol/Protocoledit', this.addData,
        response => {
          if (response.data.code === 0){
            this.$Message.success(response.data.msg)
            this.getTableData()
            this.addModal = false
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.modal_loading = false
        },
        error => {
          console.log(error)
          this.modal_loading = false
        }
      )
    },
    onClickEdit (row) {
      this.$router.push({name: 'UserAgreementEdit', params: {id: row.protocolid}})
    },
    onClickDel (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除此条记录？</p>',
        onOk: () => {
          serverApi('/Protocol/Protocoldel', {protocolid: row.protocolid},
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
  }
}
</script>
<style lang="less" scoped>

</style>
