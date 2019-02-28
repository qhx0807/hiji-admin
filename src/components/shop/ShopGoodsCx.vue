<template>
  <div class="box">
    <Card :bordered="false">
      <div>
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <router-link :to="{name: 'ShopGoodsCxAdd'}">
          <Button type="primary" style="margin-left:8px" icon="md-add">新增</Button>
        </router-link>
        <Button type="primary" style="margin-left:8px" icon="ios-switch" @click="switchlist">列表切换</Button>
      </div>
    </Card>
    <Card :bordered="false" style="margin-top:12px;">
      <div class="body">
        <Table size="small" :columns="columns" :data="tableData"></Table>
      </div>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>

    <Modal v-model="editModal" width="550">
      <p slot="header" style="text-align:center">
        <span>修改信息</span>
      </p>
      <Form :model="editData" ref="form" :rules="rules" :label-width="100">
        <FormItem label="促销开始时间" prop="starttime">
          <DatePicker type="datetime" style="width:100%" placeholder="选择时间" @on-change="onSelectStartDate"  :value="editData.starttime"></DatePicker>
        </FormItem>
        <FormItem label="促销结束时间" prop="endtime">
          <DatePicker type="datetime" style="width:100%" placeholder="选择时间" @on-change="onSelectEndDate" :value="editData.endtime"></DatePicker>
        </FormItem>
        <FormItem label="剩余抢购数量">
          <InputNumber :min="0.01" style="width:100%" v-model="editData.remaincount" placeholder="输入数量"></InputNumber>
        </FormItem>
        <FormItem label="优惠卷使用状态">
          <Select v-model="editData.dytype" style="width:100%">
            <Option :value="0">不可用</Option>
            <Option :value="1">可使用</Option>
          </Select>
        </FormItem>
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
        <FormItem label="会员可购数">
          <InputNumber :min="0.01" style="width:100%" v-model="editData.buynum" placeholder="输入数量"></InputNumber>
        </FormItem>
        <FormItem label="平台优惠">
          <InputNumber :min="0.01" style="width:100%" v-model="editData.coupon" placeholder="输入数量"></InputNumber>
        </FormItem>
        <FormItem label="商家优惠">
          <InputNumber :min="0.01" style="width:100%" v-model="editData.merchantcoupon" placeholder="输入数量"></InputNumber>
        </FormItem>
        <FormItem label="促销价格">
          <InputNumber :min="0.01" style="width:100%" v-model="pidprice" placeholder="输入价格"></InputNumber>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button @click="editModal = false">取消</Button>
        <Button type="primary" :loading="modal_loading" @click="onSaveEdit">保存</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import serverApi from '../../axios'
import CountDown from 'vue2-countdown'
export default {
  name: 'ShopGoodsCx',
  components: {
    CountDown
  },
  data () {
    return {
      searchKey: '',
      switchli: 0,
      tableData: [],
      cardsAtt: [],
      editModal: false,
      modal_loading: false,
      recModal: false,
      count: 0,
      page: 1,
      pageSize: 10,
      columns: [
        {
          title: '#',
          type: 'index',
          width: 60
        },
        {
          title: '图片',
          key: 'goodsimg',
          align: 'center',
          width: 66,
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: params.row.goodsimg
              },
              style: {
                maxWidth: '50px',
                maxHeight: '55px',
                margin: '0px 0'
              },
              directives: [
                {
                  name: 'imgview'
                }
              ]
            })
          }
        },
        {
          title: '商品名称',
          key: 'goodsname',
          minWidth: 160
        },
        {
          title: '商品属性',
          key: 'typename',
          width: 100
        },
        {
          title: '库存',
          key: 'goodsstock',
          width: 90
        },
        {
          title: '商品价格',
          key: 'goodsprice',
          width: 100
        },
        {
          title: '促销时间',
          key: 'pidid',
          width: 160,
          render: (h, params) => {
            let text = params.row.starttime + ' - ' + params.row.endtime
            return h('div', {}, text)
          }
        },
        {
          title: '倒计时',
          key: 'pidid',
          width: 230,
          render: (h, params) => {
            return h(CountDown, {
              props: {
                currentTime: new Date().getTime(),
                startTime: new Date(params.row.starttime).getTime(),
                endTime: new Date(params.row.endtime).getTime(),
                tipText: '离开始',
                tipTextEnd: '离结束',
                endText: '已结束',
                dayTxt: '天',
                hourTxt: '小时',
                minutesTxt: '分钟',
                secondsTxt: '秒'
              },
              on: {
                start_callback: () => {

                },
                end_callback: () => {

                }
              }
            })
          }
        },
        {
          title: '促销价',
          key: 'pidprice',
          width: 120,
          render: (h, params) => {
            return h('div', {}, params.row.pidprice)
          }
        },
        // {
        //   title: '状态',
        //   key: 'isonsale',
        //   width: 80
        // },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: 100,
          fixed: 'right',
          render: (h, params) => {
            let edit = h('a', {
              style: {
                marginRight: '10px'
              },
              on: {
                click: () => {
                  this.onClickEdit(params.row)
                }
              }
            }, '编辑')
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

            return h('div', [edit, del])
          }
        }
      ],
      activtyData: [],
      editData: {},
      pidprice: '',
      rules: {
        starttime: [
          { required: true, message: '请选择开始时间', trigger: 'blur' }
        ],
        endtime: [
          { required: true, message: '请选择结束时间', trigger: 'blur' }
        ]
      },
    }
  },
  created () {
    this.getTableData()
    this.getCardsData(10, '')
  },
  methods: {
    onClickSearch () {
      this.page = 1
      this.getTableData()
    },
    getTableData () {
      let d = {
        pagesize: this.pageSize,
        page: this.page,
        like: this.searchKey,
        type: this.switchli
      }
      this.$store.commit('pageLoading', true)
      serverApi('/goods/ispidindex', d,
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
    changePage (e) {
      this.page = e
      this.getTableData()
    },
    onChangeSize (e) {
      this.pageSize = e
      this.getTableData()
    },
    onClickAdd () {
      this.$router.push({name: 'ShopGoodsCxAdd'})
    },
    onClickEdit (row) {
      console.log(row)
      this.editData = Object.assign({}, row)
      this.cardsAtt = row.cardmainid.split(',')
      this.cardsAtt = this.cardsAtt.map(Number)
      console.log(this.cardsAtt)
      this.pidprice = row.goodsprice - row.coupon - row.merchantcoupon
      this.editModal = true
    },
    onSelectStartDate (e) {
      this.editData.starttime = e
    },
    onSelectEndDate (e) {
      this.editData.endtime = e
    },
    onSaveEdit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (new Date(this.editData.endtime) - new Date(this.editData.starttime) <= 0) {
            this.$Message.warning('促销时间不符合规范！请检查')
            return false
          }
          this.modal_loading = true
          this.editData.cardmainid = this.cardsAtt.toString()
          serverApi('/goods/ispidedit', this.editData,
            response => {
              console.log(response)
              this.modal_loading = false
              if (response.data.code === 0){
                this.$Message.success(response.data.msg)
                this.getTableData()
                this.editModal = false
              }else{
                this.$Message.warning(response.data.msg)
              }
            },
            error => {
              console.log(error)
              this.modal_loading = false
              this.$Message.error(error.toString())
            }
          )
        }
      })
    },
    remove (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>将此商品从促销商品中移除？</p>',
        onOk: () => {
          serverApi('/goods/ispiddel', row,
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
    getCardsData (size, key) {
      let d = {
        page: 1,
        pagesize: size,
        like: key
      }
      serverApi('/card/coupon', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.cardsData = response.data.data.result
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
    switchlist () {
      if (this.switchli === 0) {
        this.switchli = 1
        this.getTableData()
      } else {
        this.switchli = 0
        this.getTableData()
      }
      console.log(this.switchli)

    }
  }
}
</script>
<style lang="less" scoped>
</style>
