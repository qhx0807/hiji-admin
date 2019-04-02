<template>
  <div class="box">
    <Card :bordered="false">
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Select v-model="merchantcode" filterable clearable @on-clear="onCLickClear" style="width:220px" placeholder="选择商户">
          <Option value="">全部商户</Option>
          <Option v-for="(item, index) in merchantData" :key="index" :value="item.merchantcode">{{item.name}}</Option>
        </Select>
        <Select v-model="isonsale" clearable style="width:220px" placeholder="选择状态">
          <Option value="0">下架</Option>
          <Option value="1">上架</Option>
          <Option value="2">仓库</Option>
        </Select>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <router-link :to="{name: 'ShopGoodsAdd'}">
          <Button type="primary" style="margin-left:8px" icon="md-add">新增</Button>
        </router-link>
        <Button type="default" :loading="recLoading" style="margin-left:8px" icon="md-arrow-down" @click="onClickExport">导出商品列表</Button>
    </Card>
    <Card :bordered="false" style="margin-top:12px;">
      <div class="body">
        <Table size="small" @on-sort-change="onSortChange" :columns="columns" :data="tableData"></Table>
      </div>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>

  </div>
</template>
<script>
import serverApi from '../../axios'
import { downloadFile } from '../../utlis/tools.js'
export default {
  name: 'ShopGoods',
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
      isonsale: '',
      columns: [
        {
          title: '#',
          key: 'id',
          width: 100
        },
        // {
        //   title: '商品编码',
        //   key: 'goodssn',
        //   width: 90
        // },
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
                maxHeight: '55px'
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
          sortable: 'custom',
          minWidth: 120
        },
        {
          title: '所属商户',
          key: 'merchantname',
          sortable: 'custom',
          width: 120
        },
        {
          title: '分类',
          key: 'categoryname',
          sortable: 'custom',
          width: 120
        },
        {
          title: '库存',
          key: 'goodsstock',
          sortable: 'custom',
          width: 120
        },
        {
          title: '商品价格',
          key: 'goodsprice',
          sortable: 'custom',
          width: 120
        },
        // {
        //   title: '促销',
        //   key: 'ispromote',
        //   sortable: 'custom',
        //   width: 120,
        //   render: (h, params) => {
        //     let text = params.row.ispromote == 1 ? '正在促销' : ''
        //     let c = h('Tag', {
        //       props: {
        //         color: 'primary'
        //       },
        //       style: {
        //         fontSize: '10px'
        //       }
        //     }, '正在促销')
        //     return params.row.ispromote == 1 ? c : ''
        //   }
        // },
        // {
        //   title: '状态',
        //   key: 'isonsale',
        //   sortable: 'custom',
        //   width: 120,
        //   render: (h, params) => {
        //     let text = params.row.isonsale == 1 ? '上架' : '下架'
        //     let color = params.row.isonsale == 1 ? 'success' : 'warning'
        //     return h('Tag', {
        //       props: {
        //         type: 'dot',
        //         color: color
        //       }
        //     }, text)
        //   }
        // },
        {
          title: '商品状态',
          key: 'isrecommend',
          width: 110,
          sortable: 'custom',
          render: (h, params) => {
            let text = params.row.isonsale == 1 ? '上架' : '下架'
            let open = h('span', {slot: 'open'}, '上架')
            let close = h('span', {slot: 'close'}, '下架')
            return h('i-switch', {
              props: {
                // trueValue: 1,
                // falseValue: 0,
                size: 'large',
                loading: params.row.loading,
                value: params.row.isonsale > 0
              },
              on: {
                'on-change': (e) => {
                  this.OnChangeIsonsale(e, params.row)
                }
              }
            }, [open, close])
          }
        },
        {
          title: '首页推荐',
          key: 'isrecommend',
          width: 110,
          sortable: 'custom',
          render: (h, params) => {
            let text = params.row.isrecommend == 1 ? '推荐商品' : '否'
            let open = h('span', {slot: 'open'}, '是')
            let close = h('span', {slot: 'close'}, '否')
            return h('i-switch', {
              props: {
                // trueValue: 1,
                // falseValue: 0,
                size: 'default',
                loading: params.row.loading,
                value: params.row.isrecommend > 0
              },
              on: {
                'on-change': (e) => {
                  this.OnChangeRecommend(e, params.row)
                }
              }
            }, [open, close])
          }
        },
        {
          title: '操作',
          key: 'id',
          align: 'center',
          width: 120,
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
      order: 'id desc',
      merchantData: [],
      merchantcode: ''
    }
  },
  created () {
    this.getTableData()
    this.getMerchant()
  },
  methods: {
    onClickSearch () {
      this.page = 1
      this.getTableData()
    },
    getTableData (order) {
      let d = {
        isonsale: this.isonsale,
        pagesize: this.pageSize,
        page: this.page,
        like: this.searchKey,
        order: this.order,
        merchantcode: this.merchantcode
      }
      this.$store.commit('pageLoading', true)
      serverApi('/goods/index', d,
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
    getMerchant () {
      let d = {
        pagesize: 999999,
        page: 1
      }
      this.$store.commit('pageLoading', true)
      serverApi('/Merchant/index', d,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            this.merchantData = response.data.data.result
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
    onCLickClear () {
      this.merchantcode = ''
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
      this.$router.push({name: 'ShopGoodsAdd'})
    },
    onClickEdit (row) {
      this.$router.push({name: 'ShopGoodsEdit', params: {id: row.id}})
    },
    remove (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除此条信息？</p>',
        onOk: () => {
          serverApi('/goods/goodsdel', {id: row.id},
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
    onSortChange (column) {
      console.log(column)
      if (column.order != 'normal') {
        let order = column.key + ' ' + column.order
        this.order = order
      } else {
        this.order = 'id desc'
      }
      this.getTableData()

    },
    OnChangeRecommend (e, row) {
      this.$Message.loading({
        content: '加载中...',
        duration: 0
      })
      let d = {
        goodsids: row.id,
        type: '1',
        isrecommend: row.isrecommend > 0 ? 0 : '255'
      }
      serverApi('/goods/recommendedit', d,
        response => {
          // console.log(response)
          this.$Message.destroy()
          if (response.data.code === 0){
            this.$Message.success(response.data.msg)
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.destroy()
          console.log(error)
          this.$Message.error(error.toString())
        }
      )
    },
    OnChangeIsonsale (e, row) {
      console.log(e)
      this.$Message.loading({
        content: '加载中...',
        duration: 0
      })
      let d = {
        id: row.id,
        isonsale: e ? 1 : 0
      }
      serverApi('/goods/goodsonsalechange', d,
        response => {
          // console.log(response)
          this.$Message.destroy()
          if (response.data.code === 0){
            this.$Message.success(response.data.msg)
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.$Message.destroy()
          console.log(error)
          this.$Message.error(error.toString())
        }
      )
    },
    onClickExport () {
      this.recLoading = true
      this.$Message.loading({
        duration: 0,
        content: '正在生成Excel...'
      })
      let d = {
        like: this.searchKey,
        isonsale: this.isonsale,
        merchantcode: this.merchantcode
      }
      console.log(d)
      serverApi('/goods/goodsout', d,
        response => {
          console.log(response)
          this.$Message.destroy()
          if (response.data.code === 0) {
            if (typeof(response.data.data) === 'string') {
              downloadFile(response.data.data)
            } else {
              this.$Message.warning('返回数据格式不正确！')
            }
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.recLoading = false
        },
        error => {
          this.$Message.destroy()
          console.log(error)
          this.recLoading = false
          this.$Message.warning('连接失败！')
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
</style>
