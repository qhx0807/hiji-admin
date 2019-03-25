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

    <Modal v-model="addModal" width="750">
      <p slot="header" style="text-align:center">
        <span>新增</span>
      </p>
      <Form :model="addData" ref="form" :rules="rules" :label-width="100">
        <Row>
          <Col span="12">
            <FormItem label="活动ID">
              <Input v-model="addData.mainid"></Input>
            </FormItem>
            <FormItem label="商品/卡卷ID">
              <Input v-model="addData.goodsid"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="商家优惠" prop="merchantcoupon">
              <InputNumber :max="99999" :min="0" v-model="addData.merchantcoupon" style="width: 220px"></InputNumber>
            </FormItem>
            <FormItem label="平台优惠" prop="coupon">
              <InputNumber :max="99999" :min="0" v-model="addData.coupon" style="width: 220px"></InputNumber>
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
      <Form :model="modifyData" ref="form" :rules="modifyRule" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="活动ID">
              <Input v-model="modifyData.mainid"></Input>
            </FormItem>
            <FormItem label="商品ID">
              <Input v-model="modifyData.goodsid"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="商家优惠" prop="merchantcoupon">
              <InputNumber :max="99999" :min="0" v-model="modifyData.merchantcoupon" style="width: 220px"></InputNumber>
            </FormItem>
            <FormItem label="平台优惠" prop="coupon">
              <InputNumber :max="99999" :min="0" v-model="modifyData.coupon" style="width: 220px"></InputNumber>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="modifyModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="modifySave">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'AdditionalGoods',
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
      userLevel: [],
      usersLevel: [],
      userList: [],
      userLists: [],
      time2: '',
      time1: '',
      addData: {},
      // editData: {},
      modifyData: {
        id:''
      },
      modifyUser: '',
      rules: {
        merchantcoupon: [
          { required: true, message: '请输入商家优惠', trigger: 'blur', type: 'number' }
        ],
        coupon: [
          { required: true, message: '请输入平台优惠', trigger: 'blur', type: 'number' }
        ]
      },
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 100
        },
        {
          title: '类型名称',
          key: 'typename',
        },
        {
          title: '活动ID',
          key: 'mainid',
        },
        {
          title: '商品ID',
          key: 'goodsid',
        },
        // {
        //   title: '是否有效',
        //   key: 'isuse',
        //   render: (h, params) => {
        //     const text = params.row.isuse == 1 ? '有效' : '无效'
        //     const color = params.row.isuse == 1 ? 'success' : 'warning'
        //     return h('Tag', {
        //       props: {
        //         color: color,
        //         type: 'dot'
        //       }
        //     }, text)
        //   }
        // },
        {
          title: '商家优惠',
          key: 'coupon',
        },
        {
          title: '平台优惠',
          key: 'merchantcoupon',
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
        // smid: '',
        // status: ''
      }
      this.$store.commit('pageLoading', true)
      serverApi('/activity/increasebuygoodslist', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.tableData = response.data.data.result
            this.count = response.data.data.count
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
      this.modifyData.typename = e.label
    },
    userChange (e) {
      console.log(e)
    },
    onClickAdd () {
      // this.addData = {
      //   typename: ''
      // }
      this.addModal = true
    },
    onSave () {
      console.log(this.addData)
      this.modal_loading = true
      serverApi('/activity/increasebuygoods', this.addData,
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
    remove (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定删除此条记录？',
        loading: true,
        onOk: () => {
          serverApi('/activity/increasebuygoodsdel', { id: row.id },
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
      serverApi('/activity/increasebuygoods', this.modifyData,
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
    // onSaveEdit () {
    //   if (!this.editData.sevicemsg) {
    //     this.$Message.warning('请输入内容！')
    //     return false
    //   }
    //   this.modal_loading = true
    //   serverApi('/service/servicetreate', this.editData,
    //     response => {
    //       if (response.data.code === 0) {
    //         this.$Message.success(response.data.msg)
    //         this.getTableData()
    //       } else {
    //         this.$Message.warning(response.data.msg)
    //       }
    //       this.editModal = false
    //       this.modal_loading = false
    //     },
    //     error => {
    //       this.modal_loading = false
    //       this.editModal = false
    //       this.$Message.error(error.toString())
    //     }
    //   )
    // },
    onStarttime (e) {
      console.log(e)
      this.addData.starttime = e
    },
    onEndtime (e) {
      console.log(e)
      this.addData.endtime = e
    }
  }
}
</script>
<style lang="less" scoped>
  .icon {
    display: inline;
    // float: left;
    font-size: 20px;
    padding-left: 8px;
  }
</style>
