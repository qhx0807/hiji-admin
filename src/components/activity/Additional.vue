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

    <Modal v-model="addModal" width="1050">
      <p slot="header" style="text-align:center">
        <span>新增</span>
      </p>
      <Form :model="addData" ref="form" :rules="rules" :label-width="120">
        <Row>
          <Col span="24">
            <FormItem label="活动名称" prop="type">
              <Input v-model="addData.activityname" placeholder="请输入活动名称" clearable style="width: 560px" />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="活动类型" prop="type">
              <Select v-model="addData.type" >
                <Option :value="0">加价购商品</Option>
                <Option :value="1">加价购卡卷</Option>
              </Select>
            </FormItem>
            <FormItem label="规则对象" >
              <Select v-model="addData.buytype" v-if="addData.type===''">
                <Option :value="0">请选择活动类型</Option>
              </Select>
              <Select v-model="addData.buytype" v-if="addData.type===0">
                <Option :value="0">以下商户</Option>
                <Option :value="1">以下商品类型</Option>
                <Option :value="2">以下商品</Option>
              </Select>
              <Select v-model="addData.buytype" v-if="addData.type===1">
                <Option :value="0">以下商户</Option>
                <Option :value="1">以下商卡卷类型</Option>
                <Option :value="2">以下卡卷</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="开始时间" prop="type">
              <DatePicker type="datetime" @on-change="onStarttime" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="结束时间" prop="type">
              <DatePicker type="datetime" @on-change="onEndtime" style="width: 200px"></DatePicker>
            </FormItem>

          </Col>
          <Col span="8">
            <FormItem label="订单最小金额" prop="orderpaymin">
              <InputNumber :max="99999" :min="0" v-model="addData.orderpaymin" style="width: 150px"></InputNumber>
              <!-- <Tooltip max-width="800" content="规则：假如用户支付订单金额为N元，设置订单最小金额为0元，订单最大金额为20元，则0<N<=20的情况满足加价购条件" placement="right-end">
                <Icon type="ios-help-circle" size="20" class="icon"/>
              </Tooltip> -->
              <Poptip word-wrap trigger="hover" width="200" content="规则：假如用户支付订单金额为N元，设置订单最小金额为0元，订单最大金额为20元，则 0<N<=20 的情况满足加价购条件." placement="right">
                <Icon type="ios-help-circle" size="20" class="icon"/>
              </Poptip>
            </FormItem>
            <FormItem label="订单最大金额" prop="orderpaymax">
              <InputNumber :max="99999" :min="0" v-model="addData.orderpaymax" style="width: 150px"></InputNumber>
            </FormItem>
          </Col>
          <!-- <Col span="24">
            <FormItem label="选择优惠卷">
              <Select
                filterable
                remote
                clearable
                multiple
                style="width:100%"
                :loading="searchLoading"
                v-model="cardsAtt"
                :remote-method="onSearchGoods"
                placeholder="选择商品">
                <Option v-for="(item, index) in cardsData" :disabled="item.ispromote == 1" :key="item.id" :value="item.id">{{item.cardname}}</Option>
              </Select>
            </FormItem>
          <Col/> -->
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="onSave">发送</Button>
      </div>
    </Modal>
    <Modal v-model="modifyModal" width="750">
      <p slot="header" style="text-align:center">
        <span>修改</span>
      </p>
      <Form :model="modifyData" ref="form" :rules="modifyRule" :label-width="100">
        <Row>
          <Col span="24">
            <FormItem label="活动名称" prop="type">
              <Input v-model="addData.activityname" placeholder="请输入活动名称" clearable style="width: 560px" />
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="活动类型" prop="type">
              <Select v-model="modifyData.type" >
                <Option :value="0">加价购商品</Option>
                <!-- <Option :value="1">加价购卡卷</Option> -->
              </Select>
            </FormItem>
            <FormItem label="规则对象" prop="type">
              <Select v-model="modifyData.buytype" >
                <Option :value="0">以下商户</Option>
                <Option :value="1">以下商品类型</Option>
                <Option :value="2">以下商品</Option>
              </Select>
            </FormItem>
            <FormItem label="订单最小金额" prop="type">
              <InputNumber :max="99999" :min="0" v-model="modifyData.orderpaymin" style="width: 170px"></InputNumber>
              <!-- <Tooltip max-width="800" content="规则：假如用户支付订单金额为N元，设置订单最小金额为0元，订单最大金额为20元，则0<N<=20的情况满足加价购条件" placement="right-end">
                <Icon type="ios-help-circle" size="20" class="icon"/>
              </Tooltip> -->
              <Poptip word-wrap trigger="hover" width="300" content="规则：假如用户支付订单金额为N元，设置订单最小金额为0元，订单最大金额为20元，则 0<N<=20 的情况满足加价购条件." placement="right">
                <Icon type="ios-help-circle" size="20" class="icon"/>
              </Poptip>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="开始时间" prop="type">
              <DatePicker type="datetime" :value="time2" @on-change="onStarttime" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="结束时间" prop="type">
              <DatePicker type="datetime" :value="time1" @on-change="onEndtime" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="订单最大金额" prop="type">
              <InputNumber :max="99999" :min="0" v-model="modifyData.orderpaymax" style="width: 200px"></InputNumber>
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
  name: 'Additional',
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
        orderpaymax: [
          { required: true, message: '请输入最大值', trigger: 'blur', type: 'number' }
        ],
        orderpaymin: [
          { required: true, message: '请输入最小值', trigger: 'blur', type: 'number' }
        ]
      },
      columns: [
        {
          title: 'ID',
          key: 'id',
          width: 80
        },
        {
          title: '活动名称',
          key: 'activityname',
        },
        {
          title: '类型名称',
          key: 'typename',
        },
        {
          title: '开始时间',
          key: 'starttime',
        },
        {
          title: '结束',
          key: 'endtime',
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
          title: '订单最小金额',
          key: 'orderpaymin',
        },
        {
          title: '订单最大金额',
          key: 'orderpaymax',
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
      serverApi('/activity/increasebuylist', d,
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
      this.addData = {
        typename: ''
      }
      this.addModal = true
    },
    onSave () {
      console.log(this.addData)
      this.modal_loading = true
      if (this.addData.type===0) {
        this.addData.typename ='加价购商品'
      } else if (this.addData.type===1) {
        this.addData.typename ='加价购卡卷'
      }
      serverApi('/activity/increasebuy', this.addData,
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
          serverApi('/activity/increasebuydel', { id: row.id },
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
      this.time2 = row.starttime
      this.time1 = row.endtime
    },
    modifySave () {
      this.modifyModal = false
      console.log(this.modifyData)
      serverApi('/activity/increasebuy', this.modifyData,
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
