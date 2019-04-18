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
          <Col span="8">
            <FormItem label="活动名称" prop="type">
              <Input v-model="addData.activityname" placeholder="请输入活动名称" clearable />
            </FormItem>
          </Col>
          <Col span="10">
            <FormItem label="最大购买数" prop="type" v-if="addData.type===0 || !addData.type">
              <Input v-model="addData.maxquantity" placeholder="请输入" clearable  />
            </FormItem>
            <FormItem label="最大购买数" prop="type" v-if="addData.type===1">
              <Input v-model="addData.maxquantity" placeholder="请输入" disabled  />
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem label="活动类型" prop="type">
              <Select v-model="addData.type" @on-change="Tgoods">
                <Option :value="0">加价购商品</Option>
                <Option :value="1">加价购卡卷</Option>
              </Select>
            </FormItem>
            <FormItem label="规则对象">
              <Select v-model="addData.buytype" @on-change="Bgoods" v-if="addData.type===0 || !addData.type" style="width: 180px">
                <Option :value="0">以下商户</Option>
                <Option :value="1">以下商品类型</Option>
                <Option :value="2">以下商品</Option>
              </Select>
              <Select v-model="addData.buytype" @on-change="Bgoods" v-if="addData.type===1" style="width: 180px">
                <!-- <Option :value="0">以下商户</Option> -->
                <Option :value="2">以下卡卷</Option>
              </Select>
              <Poptip word-wrap trigger="hover" width="200" content="请先选择活动类型" placement="right">
                <Icon type="ios-help-circle" size="20" class="icon"/>
              </Poptip>
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
          <Col span="22">
            <FormItem :label="goodsname">
              <Select
                filterable
                remote
                clearable
                :loading="modal_loading"
                :remote-method="onSearchGoods"
                multiple v-model="addData.buytypemsg"
                placeholder="请选择">
                <Option v-for="item in cardsData" :key="item.id" :value="item.id">{{item.name}}</Option>
              </Select>
              <!-- <Select
                v-if="addData.type===1"
                filterable
                remote
                clearable
                :remote-method="onSearchGoods"
                multiple v-model="addData.type"
                placeholder="选择卡卷">
                <Option v-for="item in cardsData" :key="item.id" :value="item.id">{{item.name}}</Option>
              </Select> -->
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="addModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="onSave">发送</Button>
      </div>
    </Modal>
    <Modal v-model="modifyModal" width="1050">
      <p slot="header" style="text-align:center">
        <span>修改</span>
      </p>
      <Form :model="modifyData" ref="form" :rules="modifyRule" :label-width="100">
        <Row>
          <Col span="11">
            <FormItem label="活动名称" prop="type">
              <Input v-model="modifyData.activityname" placeholder="请输入活动名称" clearable />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="最大购买数" prop="type" v-if="modifyData.type===0 || !modifyData.type">
              <Input v-model="modifyData.maxquantity" placeholder="请输入" clearable  />
            </FormItem>
            <FormItem label="最大购买数" prop="type" v-if="modifyData.type===1">
              <Input v-model="modifyData.maxquantity" placeholder="请输入" disabled  />
            </FormItem>
          </Col>
          <Col span="11">
            <FormItem label="活动类型" prop="type">
              <Select v-model="modifyData.type" @on-change="Tgoods">
                <Option :value="0">加价购商品</Option>
                <Option :value="1">加价购卡卷</Option>
              </Select>
            </FormItem>
            <FormItem label="规则对象">
              <Select v-model="modifyData.buytype" @on-change="Bgoods" v-if="modifyData.type===0 || !modifyData.type" style="width: 330px">
                <Option :value="0">以下商户</Option>
                <Option :value="1">以下商品类型</Option>
                <Option :value="2">以下商品</Option>
              </Select>
              <Select v-model="modifyData.buytype" @on-change="Bgoods" v-if="modifyData.type===1" style="width: 280px">
                <!-- <Option :value="0">以下商户</Option> -->
                <Option :value="2">以下卡卷</Option>
              </Select>
              <Poptip word-wrap trigger="hover" width="200" content="请先选择活动类型" placement="right">
                <Icon type="ios-help-circle" size="20" class="icon"/>
              </Poptip>
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
              <DatePicker type="datetime" :value="time2" @on-change="onStarttimeMod" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="结束时间" prop="type">
              <DatePicker type="datetime" :value="time1" @on-change="onEndtimeMod" style="width: 200px"></DatePicker>
            </FormItem>
            <FormItem label="订单最大金额" prop="type">
              <InputNumber :max="99999" :min="0" v-model="modifyData.orderpaymax" style="width: 200px"></InputNumber>
            </FormItem>
          </Col>
          <Col span="22">
            <FormItem :label="goodsname">
              <Select
                filterable
                remote
                clearable
                :loading="modal_loading"
                :remote-method="onSearchGoods"
                multiple v-model="userLevels"
                placeholder="请选择">
                <Option v-for="item in cardsData" :key="item.id" :value="item.id">{{item.name}}</Option>
              </Select>
              <!-- <Select
                v-if="addData.type===1"
                filterable
                remote
                clearable
                :remote-method="onSearchGoods"
                multiple v-model="addData.type"
                placeholder="选择卡卷">
                <Option v-for="item in cardsData" :key="item.id" :value="item.id">{{item.name}}</Option>
              </Select> -->
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
      cardsData: [],
      typeList: [],
      userLevel: [],
      userLevels: [],
      time2: '',
      time1: '',
      starttimeMod: '',
      endtimeMod: '',
      addData: {},
      ids: '',
      goodsid: '',
      goodslike: '',
      buytype: '',
      type: '',
      typename: '',
      // editData: {},
      goodsname: '请选择',
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
          title: '结束时间',
          key: 'endtime',
        },
        {
          title: '最大购买数',
          key: 'maxquantity',
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
          width: 200,
          render: (h, params) => {
            let modify = h('a', {
              style: {
                color: '#f90',
                marginRight: '10px'
              },
              on: {
                click: () => {
                  this.modify(params.row)
                }
              }
            }, '修改')
            let edit = h('a', {
              style: {
                marginRight: '10px'
              },
              on: {
                click: () => {
                  this.onClickEdit(params.row)
                }
              }
            }, '查看商品')
            let del = h('a', {
              style: {
                color: '#f40',
                marginRight: '10px'
              },
              on: {
                click: () => {
                  this.remove(params.row)
                }
              }
            }, '删除')

            return h('div', [edit, modify, del])
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
      // this.addData = {
      //   type: ''
      // }
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
      this.goodsid = row.id
      this.typename = row.typename
      if (row.buytype === 0) {
        this.userLevels = row.buytypemsg.split(',')
      } else {
         this.userLevel = row.buytypemsg.split(',')
         this.userLevels = this.userLevel.map( e => Number(e))
      }

      console.log(this.userLevel)
      console.log(this.userLevels)
      let d = {
        type: row.type,
        buytype: row.buytype,
      }
      this.modal_loading = true
      serverApi('/activity/increasebuymsg', d,
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.cardsData = response.data.data
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.modal_loading = false
        },
        error => {
          this.modal_loading = false
          this.$Message.error(error.toString())
        }
      )
    },
    modifySave () {
      this.modifyModal = false
      console.log(this.modifyData)
      let d = {
        activityname: this.modifyData.activityname,
        typename: this.typename,
        maxquantity: this.modifyData.maxquantity,
        type: this.modifyData.type,
        buytype: this.modifyData.buytype,
        orderpaymin: this.modifyData.orderpaymin,
        orderpaymax: this.modifyData.orderpaymax,
        buytypemsg: this.userLevels,
        starttime: this.estarttimeMod,
        endtime: this.endtimeMod,
        id: this.goodsid
      }
      serverApi('/activity/increasebuy', d,
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
    onClickEdit (row) {
      console.log(row)
       this.ids = row.id
      this.$router.push({name: 'AdditionalGoods' , params: {id: this.ids}})
    },
    onStarttime (e) {
      console.log(e)
      this.addData.starttime = e
    },
    onEndtime (e) {
      console.log(e)
      this.addData.endtime = e
    },
    onStarttimeMod (e) {
      console.log(e)

      this.starttimeMod = e
    },
    onEndtimeMod (e) {
      console.log(e)
      this.endtimeMod = e
    },
    onSearchGoods (e) {
      console.log(e)
      this.onMerchants(e)
    },
    Tgoods (e) {
      if (e===0){
        this.goodsname = '选择商品'
      } else {
        this.goodsname = '选择卡卷'
        this.addData.maxquantity = 1
      }
      console.log(e)
      this.type = e
    },
    Bgoods (e) {
      // alert('1')
      console.log(e)
      this.buytype = e
      this.onMerchants()
    },
    onMerchants (e) {
      if (!e) {
        this.goodslike = ''
      } else {
        this.goodslike = e
      }
      let d = {
        type: this.type,
        buytype: this.buytype,
        like: this.goodslike
      }
      // let d = {
      //   type: 0,
      //   buytype: 0,
      //   like: ''
      // }
      this.modal_loading = true
      serverApi('/activity/increasebuymsg', d,
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.cardsData = response.data.data
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.modal_loading = false
        },
        error => {
          this.modal_loading = false
          this.$Message.error(error.toString())
        }
      )
    },
    watch: {
      addData (newName, oldName) {
        console.log(newName)
        console.log(oldName)
      }
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
