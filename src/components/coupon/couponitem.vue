<template>
  <div class="box">
    <Card :bordered="false">
      <div>
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <Button type="primary" style="margin-left:8px" icon="md-add" @click="onClickAdd">新增</Button>
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

    <Modal v-model="recModal" width="950":styles="{top: '20px'}">
      <p slot="header" style="text-align:center">
        <span>卡券领取记录</span>
      </p>
      <div>
        <div class="body">
          <Table :columns="recordsColumns" :data="recordsData"></Table>
        </div>
        <div style="float: right; padding-top:12px">
          <Page :total="recordsCount" show-total :current="recpage" @on-change="recCchangePage"></Page>
        </div>
        <div style="clear:both"></div>
      </div>
      <div slot="footer">
        <Button    @click="recModal = false">取消</Button>
        <Button type="primary" @click="recModal = false">确定</Button>
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
      modal_loading: false,
      recModal: false,
      count: 0,
      page: 1,
      pageSize: 10,
      columns: [
        {
          title: '编号',
          key: 'id',
          width: 80
        },
        {
          title: '卡券图',
          key: 'imgmaster',
          width: 66,
          align: 'center',
          render: (h, params) => {
            if (!params.row.imgmaster) return h('div',{},'')
            return h('img', {
              attrs: {
                src: params.row.imgmaster
              },
              style: {
                maxHeight: '60px',
                margin: '3px 0'
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
          title: '卡券名称',
          key: 'cardname',
          width: 190
        },
        // {
        //   title: '所属商家',
        //   key: 'cardname',
        //   width: 190
        // },
        {
          title: '类型',
          key: 'typename',
          width: 140
        },
        {
          title: '状态',
          key: 'cardmainstate',
          width: 80,
          render: (h, params) => {
            if (params.row.cardmainstate == 1) {
              return h('Tag', {
                props: {
                  color: 'success'
                }
              }, '发布')
            }
            let text = this.stateData[params.row.cardmainstate] || ''
            return h('span', {}, text)
          }
        },
        {
          title: '总库存',
          key: 'totalcount',
          width: 100,
          render: (h, params) => {
            return h('InputNumber', {
              props: {
                // min: params.row.remaincount,
                value: params.row.totalcount
              },
              on: {
                "on-change": (e) => {
                  this.onChangeStock(e, params.row.id)
                }
              }
            })
          }
        },
        {
          title: '剩余库存',
          key: 'remaincount',
          width: 90
        },
        // {
        //   title: '扩展信息',
        //   key: 'cardextrainfo',
        //   minWidth: 280,
        //   ellipsis: true,
        //   render: (h, params) => {
        //     return h('Poptip', {
        //       props: {
        //         content: params.row.cardextrainfo,
        //         placement: 'top-start',
        //         trigger: 'hover'
        //       }
        //     }, params.row.cardextrainfo)
        //   }
        // },
        // {
        //   title: '关联活动',
        //   key: 'assignactiveid',
        //   width: 100
        // },
        {
          title: '发放时间',
          key: 'id',
          minWidth: 170,
          render: (h, params) => {
            return h('div', {}, `${params.row.startsendtime} 至 ${params.row.endsendtime}`)
          }
        },
        {
          title: '使用时间',
          key: 'id',
          minWidth: 170,
          render: (h, params) => {
            return h('div', {}, `${params.row.startusetime} 至 ${params.row.endusetime}`)
          }
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: 145,
          fixed: 'right',
          render: (h, params) => {
            let edit = h('a', {
              style: {
                marginRight: '6px'
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
                marginRight: '6px'
              },
              on: {
                click: () => {
                  this.remove(params.row)
                }
              }
            }, '删除')
            let records = h('a', {
              style: {
                color: '#19be6b',
              },
              on: {
                click: () => {
                  this.seeRecords(params.row)
                }
              }
            }, '领取记录')

            return h('div', [edit, del, records])
          }
        }
      ],
      activtyData: [],
      editData: {},
      stateData: ['编制', '发布', '有效', '停止', '无效', '过期'],
      recordsColumns: [
        {
          title: '用户',
          key: 'username',
          width: 100
        },
        {
          title: '发放时间',
          key: 'cardsendtime',
          width: 150
        },
        {
          title: '领取时间',
          key: 'carddrawtime',
          width: 150
        },
        {
          title: '卡券名称',
          key: 'cardname',
          minWidth: 120
        },
        {
          title: '卡券类型',
          key: 'typename',
          minWidth: 120
        },
        // {
        //   title: '卡券编码',
        //   key: 'cardItemcode',
        //   minWidth: 120
        // },
        {
          title: '使用时间',
          key: 'usetime',
          width: 150
        },
        {
          title: '状态',
          key: 'carditemstate',
          width: 120
        }
      ],
      recordsData: [],
      recordsCount: 0,
      recpage: 1,
      recId: null,
      bool: true
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
    getTableData (page, size, key) {
      let d = {
        pagesize: this.pageSize,
        page: this.page,
        like: this.searchKey
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
    changePage (e) {
      this.page = e
      this.getTableData()
    },
    onChangeSize (e) {
      this.pageSize = e
      this.getTableData()
    },
    onClickAdd () {
      this.$router.push({name: 'CouponItemAdd'})
    },
    onClickEdit (row) {
      this.$router.push({name: 'CouponItemEdit', params: {id: row.id}})
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
    },
    seeRecords (row) {
      this.recId = row.id
      this.getRecData(this.recId)
      this.recModal = true
    },
    getRecData (id) {
      let d = {
        page: this.recpage,
        id: id
      }
      serverApi('/card/cardall', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.recordsData = response.data.data.result
            this.recordsCount = response.data.data.counts
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        }
      )
    },
    recCchangePage (e) {
      this.recpage = e
      this.getRecData(this.recId)
    },
    onChangeStock (e, id) {
      let d = {
        id: id,
        stock: e
      }
      if (!this.bool) return false
      this.bool = false
      serverApi('/card/couponstockedit', d,
        response => {
          if (response.data.code === 0){
            this.$Message.success(response.data.msg)
            this.getTableData()
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.bool = true
        },
        error => {
          console.log(error)
          this.bool = true
          this.$Message.error('修改失败！')
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
</style>
