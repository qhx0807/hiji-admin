<template>
  <div class="box">
    <Card :bordered="false">
      <div class="head">
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <Button type="primary" style="margin-left:8px" icon="plus" @click="onClickAdd">新增</Button>
      </div>
      <div class="body">
        <Table :columns="columns" :data="tableData"></Table>
      </div>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>

    <!-- add -->
    <Modal v-model="addModal" width="550">
      <p slot="header" style="text-align:center">
        <span>新增</span>
      </p>
      <Form ref="form" :model="form" :rules="rules" :label-width="70">
        <FormItem prop="cardname" label="卡券名称">
          <Input v-model="form.cardname" placeholder="请输入"></Input>
        </FormItem>
        <FormItem prop="cardcode" label="卡券编码">
          <Input v-model="form.cardcode" placeholder="请输入"></Input>
        </FormItem>
        <FormItem prop="typeid" label="卡券类型">
          <Select v-model="form.typeid">
            <Option v-for="item in typeData" :value="item.id" :key="item.id">{{ item.typename }}</Option>
          </Select>
        </FormItem>
        <FormItem label="发放时间">
          <DatePicker type="datetimerange" @on-change="onSelectSendDate" style="width:100%" placeholder="选择时间"></DatePicker>
        </FormItem>
        <FormItem label="使用时间">
          <DatePicker type="datetimerange" @on-change="onSelectUseDate" style="width:100%" placeholder="选择时间"></DatePicker>
        </FormItem>
        <FormItem prop="assignactiveid" label="关联活动">
          <Select v-model="form.assignactiveid">
            <Option v-for="item in activtyData" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="totalcount" label="卡券总数">
          <InputNumber v-model="form.totalcount" style="width:100%" :max="99999999" :min="1" placeholder="请输入"></InputNumber>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="ghost"  @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="add">提交</Button>
      </div>
    </Modal>

    <!-- edit -->
    <Modal v-model="editModal" width="550">
      <p slot="header" style="text-align:center">
        <span>修改</span>
      </p>
      <Form ref="editform" :model="editData" :rules="rules" :label-width="90">
        <FormItem prop="cardname" label="卡券名称">
          <Input v-model="editData.cardname" placeholder="请输入"></Input>
        </FormItem>
        <FormItem prop="cardcode" label="卡券编码">
          <Input v-model="editData.cardcode" placeholder="请输入"></Input>
        </FormItem>
        <FormItem prop="typeid" label="卡券类型">
          <Select v-model="editData.typeid">
            <Option v-for="item in typeData" :value="item.id" :key="item.id">{{ item.typename }}</Option>
          </Select>
        </FormItem>
        <FormItem label="发放时间">
          <DatePicker type="datetimerange" @on-change="onSelectSendDate" style="width:100%" placeholder="选择时间"></DatePicker>
        </FormItem>
        <FormItem label="使用时间">
          <DatePicker type="datetimerange" @on-change="onSelectUseDate" style="width:100%" placeholder="选择时间"></DatePicker>
        </FormItem>

        <FormItem label="发放开始时间">
          <DatePicker type="datetime" :value="editData.startsendtime" v-model="editData.startsendtime" style="width:100%" placeholder="选择时间"></DatePicker>
        </FormItem>
        <FormItem label="发放开始时间">
          <DatePicker type="datetime" :value="editData.startsendtime" v-model="editData.startsendtime" style="width:100%" placeholder="选择时间"></DatePicker>
        </FormItem>

        <FormItem prop="assignactiveid" label="关联活动">
          <Select v-model="editData.assignactiveid">
            <Option v-for="item in activtyData" :value="item.id" :key="item.id">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="totalcount" label="卡券总数">
          <InputNumber v-model="editData.totalcount" style="width:100%" :max="99999999" :min="1" placeholder="请输入"></InputNumber>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="editModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="edit">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'CouponItem',
  data () {
    return {
      searchKey: '',
      tableData: [],
      addModal: false,
      editModal: false,
      modal_loading: false,
      form: {
        cardcode: '',
        cardname: '',
        startsendtime: '',
        endsendtime: '',
        startusetime: '',
        endusetime: '',
        assignactiveid: '',
        typeid: null,
        totalcount: 1
      },
      rules: {
        cardcode: [{ required: true, message: '不能为空', trigger: 'blur' }],
        cardname: [{ required: true, message: '不能为空', trigger: 'blur' }]
      },
      count: 0,
      page: 1,
      pageSize: 10,
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 80
        },
        {
          title: '卡券名称',
          key: 'cardname',
          minWidth: 130
        },
        {
          title: '卡券编码',
          key: 'cardcode',
          minWidth: 130
        },
        {
          title: '类型',
          key: 'typeid',
          minWidth: 130
        },
        {
          title: '状态',
          key: 'cardmainstate',
          minWidth: 90,
          render: (h, params) => {
            let text = this.stateData[params.row.cardmainstate] || ''
            return h('span', {}, text)
          }
        },
        {
          title: '总数量',
          key: 'totalcount',
          minWidth: 90
        },
        {
          title: '剩余数量',
          key: 'remaincount',
          minWidth: 90
        },
        {
          title: '扩展信息',
          key: 'cardextrainfo',
          minWidth: 130
        },
        {
          title: '关联活动',
          key: 'assignactiveid',
          minWidth: 130
        },
        {
          title: '发放时间',
          key: 'id',
          minWidth: 160,
          render: (h, params) => {
            return h('div', {}, `${params.row.startsendtime} 至 ${params.row.endsendtime}`)
          }
        },
        {
          title: '使用时间',
          key: 'id',
          minWidth: 160,
          render: (h, params) => {
            return h('div', {}, `${params.row.startusetime} 至 ${params.row.endusetime}`)
          }
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
      activtyData: [],
      editData: {},
      typeData: [],
      stateData: ['默认', '发布', '有效', '停止', '无效', '过期'],
    }
  },
  created () {
    this.getTableData()
    this.getCardType()
  },
  methods: {
    onClickSearch () {
      this.getTableData()
    },
    getTableData (page, size, key) {
      let d = {
        pagesize: this.pageSize,
        page: this.page,
        like: this.searchKey,
        userid: sessionStorage.userid
      }
      this.$store.commit('pageLoading', true)
      serverApi('/card/coupon', d,
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
          this.$Message.error('连接失败！')
        }
      )
    },
    getCardType () {
      let d = {
        pagesize: 99999,
        page: 1,
        userid: sessionStorage.userid
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
    },
    add () {
      if (!this.form.typeid) {
        this.$Message.info('请选择卡券类型')
        return false
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          if (/[\u4E00-\u9FA5]/g.test(this.form.cardcode)) {
            this.$Message.warning('类型编码不能包含汉字字符！')
            return false
          }
          this.modal_loading = true
          serverApi('/card/couponadd', this.form,
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
              this.$Message.error('连接失败！')
            }
          )
        }
      })
    },
    onClickEdit (row) {
      // this.editData = Object.assign({}, row)
      // this.editModal = true
       this.$router.push({name: 'CouponItemEdit', params: {id: row.id}})
    },
    edit () {
      delete this.editData._index
      delete this.editData._rowKey
      this.$refs.editform.validate(valid => {
        if (valid) {
          if (/[\u4E00-\u9FA5]/g.test(this.editData.typecode)) {
            this.$Message.warning('类型编码不能包含汉字字符！')
            return false
          }
          this.modal_loading = true
          serverApi('/card/typeedit', this.editData,
            response => {
              this.modal_loading = false
              if (response.data.code === 0) {
                this.editModal = false
                this.getTableData()
              }
              this.$Message.info(response.data.msg)
            },
            error => {
              this.editModal = false
              console.log(error)
              this.modal_loading = false
              this.$Message.error('连接失败')
            }
          )
        }
      })
    },
    remove (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除此条信息？</p>',
        onOk: () => {
          serverApi('/card/coupondel', {id: row.id},
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
    onSelectSendDate (e) {
      this.form.startsendtime = e[0]
      this.form.endsendtime = e[1]
    },
    onSelectUseDate (e) {
      this.form.startusetime = e[0]
      this.form.endusetime = e[1]
    }
  }
}
</script>
<style lang="less" scoped>
.head{
  padding-bottom: 12px;
}
</style>
