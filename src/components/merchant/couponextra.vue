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

  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'CouponExtra',
  data () {
    return {
      searchKey: '',
      tableData: [],
      addModal: false,
      editModal: false,
      modal_loading: false,
      count: 0,
      page: 1,
      pageSize: 10,
      columns: [
        {
          title: 'ID',
          key: 'id',
          minWidth: 130
        },
        {
          title: '所属卡券',
          key: 'cardmainid',
          minWidth: 130
        },
        {
          title: '扩展信息编码',
          key: 'extrainfocode',
          minWidth: 130
        },
        {
          title: '扩展信息值',
          key: 'extrainfovalue',
          minWidth: 150
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
      ]
    }
  },
  created () {
    this.getTableData()
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
      serverApi('/card/cardexpansion', d,
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
      this.$router.push({name: 'CouponExtraAdd'})
    },
    remove (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除此条信息？</p>',
        onOk: () => {
          serverApi('/card/cardexpansiondel', {id: row.id},
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
    onClickEdit (row) {
      this.$router.push({name: 'CouponExtraEdit', params: {id: row.id}})
    }
  }
}
</script>
<style lang="less" scoped>
.head{
  padding-bottom: 12px;
}
</style>
