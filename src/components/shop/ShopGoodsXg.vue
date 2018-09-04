<template>
  <div class="box">
    <Card :bordered="false">
      <div>
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <router-link :to="{name: 'ShopGoodsXgAdd'}">
          <Button type="primary" style="margin-left:8px" icon="md-add">新增</Button>
        </router-link>
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

  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'ShopGoodsXg',
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
          title: '#',
          key: 'id',
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
                maxWidth: '60px',
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
          title: '商品名称',
          key: 'goodsname',
          minWidth: 160
        },
        {
          title: '所属商户',
          key: 'merchantname',
          width: 120
        },
        {
          title: '类型',
          key: 'categoryname',
          width: 120
        },
        {
          title: '库存',
          key: 'goodsstock',
          width: 120
        },
        {
          title: '商品价格',
          key: 'goodsprice',
          width: 120
        },
        {
          title: '促销',
          key: 'ispromote',
          width: 120
        },
        {
          title: '状态',
          key: 'isonsale',
          width: 80
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
    getTableData () {
      let d = {
        pagesize: this.pageSize,
        page: this.page,
        like: this.searchKey
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
    changePage (e) {
      this.page = e
      this.getTableData()
    },
    onChangeSize (e) {
      this.pageSize = e
      this.getTableData()
    },
    onClickAdd () {
      this.$router.push({name: 'ShopGoodsXgAdd'})
    },
    onClickEdit (row) {
      // this.$router.push({name: 'ShopGoodsXgEdit', params: {id: row.id}})
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
    }
  }
}
</script>
<style lang="less" scoped>
</style>
