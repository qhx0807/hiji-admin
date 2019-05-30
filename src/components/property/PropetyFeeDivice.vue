<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Form :label-width="60">
        <Row>
          <Col span="24">
            <FormItem label="查询" style="margin-bottom:0">
              <Input placeholder="搜索..." style="width:200px"></Input>
              <Button type="primary" style="margin-left:12px" @click="onClickSearch">搜索</Button>
              <Button type="primary" style="margin-left:12px" @click="onRenewArea">更新</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card :bordered="false" style="margin-top:12px;">
      <div class="body">
        <Table :columns="columns" size="small" height="550" :data="tableData"></Table>
      </div>
    </Card>

    <Modal v-model="editModal" width="500">
      <p slot="header" style="text-align:center">
        <span>修改设备信息</span>
      </p>
      <Form ref="form" :model="editData" :rules="rules" :label-width="80">
        <FormItem label="小区名称:">{{editData.areaname}}</FormItem>
        <FormItem prop="departmentname" label="商户名称:">
          <Select
            transfer
            remote
            filterable
            clearable
            :loading="submitLoading"
            :remote-method="getEquipmentData"
            v-model="searchMerchant"
          >
            <Option
              v-for="(item, index) in merchantData"
              :key="item.merchantcode"
              :value="item.id"
            >{{item.merchantname}}</Option>
            <span>{{共项}}</span>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="editModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="bindID">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'PropetyFeeDivice',
  data () {
    return {
      searchMerchant: '',
      merchantData: [],
      modal_loading: false,
      submitLoading: false,
      editData: {},
      editModal: false,
      form: {
        areaname: '',
        departmentname: ''
      },
      rules: {
        departmentname: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      count: 0,
      page: 1,
      columns: [
        {
          title: '小区名称',
          key: 'areaname',
          minWidth: 130
        },
        {
          title: '商户名称',
          key: 'name',
          minWidth: 130
        },
        {
          title: '设备ID',
          key: 'equipmentid',
          align: 'center',
          minWidth: 130
        },
        {
          title: '创建日期',
          key: 'createtime',
          minWidth: 130
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: 90,
          fixed: 'right',
          render: (h, params) => {
            return h('Button', {
              props: {
                type: 'text',
                size: 'small',
                icon: 'md-create'
              },
              on: {
                click: () => {
                  this.onClickEdit(params.row)
                }
              }
            }, '编辑')
          }
        }
      ],
      tableData: []
    }
  },
  created () {
    this.getIndexData()
    this.getEquipmentData('')
  },
  methods: {
    getIndexData () {
      this.$store.commit('pageLoading', true)
      serverApi('/Property/index', null,
        response => {
          if (response.data.code === 0) {
            this.tableData = response.data.data
            this.count = this.tableData.length
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.$store.commit('pageLoading', false)
        }, error => {
          console.log(error)
          this.$store.commit('pageLoading', false)
        }
      )
    },
    getEquipmentData (key) {
      let d = {
        like: key,
        pagesize: 10
      }
      this.submitLoading = true
      serverApi('/Equipment/index', d,
        response => {
          this.submitLoading = false
          if (response.data.code === 0) {
            this.merchantData = response.data.data.result
          } else {
            this.$Message.warning(response.data.msg)
          }
        }, error => {
          this.$Message.warning('获取失败,请重新获取')
          console.log(error)
        }
      )
    },
    onRenewArea () {
      serverApi('/Property/renewarea', null,
        response => {
          if (response.data.code === 0) {
            this.$Message.info(response.data.msg)
          } else {
            this.$Message.warning(response.data.msg)
            this.getIndexData()
          }
        }, error => {
          console.log(error)
        }
      )
    },
    onClickEdit (row) {
      this.editData = row
      this.searchMerchant = ''
      this.editModal = true
    },
    bindID () {
      this.modal_loading = true
      let d = {
        areaid: this.editData.areaid,
        equipmentid: this.searchMerchant
      }
      serverApi('/Property/edit', d,
        response => {
          let data = response.data
          this.modal_loading = false
          if (response.data.code === 0) {
            this.editModal = false
            this.merchantData = []
            this.getIndexData()
            this.$Message.success(data.msg)
          } else {
            this.$Message.warning(data.msg)
          }
          this.searchMerchant = ''
        }, error => {
          console.log(error)
          this.modal_loading = false
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
</style>
