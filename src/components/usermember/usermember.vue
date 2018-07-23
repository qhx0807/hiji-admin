<template>
  <div class="box">
    <Card :bordered="false">
      <div class="head">
        <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
        <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
        <router-link :to="{name: 'UserMemberAdd'}">
          <Button type="primary" style="margin-left:8px" icon="plus">新增</Button>
        </router-link>
      </div>
    </Card>
    <Card :bordered="false" style="margin-top:10px">
      <Table size="default" :columns="columns" :data="tableData"></Table>
      <div style="float: right; padding-top:12px">
        <Page :page-size-opts="pageSizeOpts" :page-size="pageSize" :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
      </div>
      <div style="clear:both"></div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'UserMember',
  data () {
    return {
      searchKey: '',
      pageSize: 10,
      page: 1,
      count: 0,
      pageSizeOpts: [10, 20, 30],
      tableData: [],
      columns: [
        {
          title: '用户id',
          key: 'user_id',
          width: 90
        },
        {
          title: '所属城市',
          key: 'city',
          width: 90
        },
        {
          title: '头像',
          key: 'avatar',
          width: 90,
          render: (h, params) => {
            let path = params.row.avatar
            if (!path) {
              return h('div')
            }
            return h('img', {
              attrs: {
                src: path
              },
              directives: [
                {
                  name: 'imgview'
                }
              ],
              style: {
                height: '40px',
                width: '40px',
                borderRadius: '50%',
                margin: '5px 0'
              }
            })
          }
        },
        // {
        //   title: '用户名',
        //   key: 'username',
        //   width: 120
        // },
        {
          title: '昵称',
          key: 'nickname',
          minWidth: 120
        },
        {
          title: '电话',
          key: 'phone',
          width: 120
        },
        {
          title: '注册时间',
          key: 'create_time',
          width: 160
        },
        {
          title: '状态',
          key: 'state',
          width: 80
        },
        {
          title: '操作',
          key: 'user_id',
          width: 220,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            let edit = h('Button', {
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
                    this.onClickEdit(params.row.user_id)
                  }
                }
            }, '编辑')
            let del = h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                  icon: 'trash-a'
                },
                style: {
                  color: '#f60'
                },
                on: {
                  click: () => {
                    this.onClickDel(params.row.user_id)
                  }
                }
            }, '删除')
            let more = h('Button', {
              props: {
                type: 'text',
                size: 'small',
                icon: 'person'
              },
              style: {
                color: '#2d8cf0'
              },
              on: {
                click: () => {
                  this.onClickMore(params.row.user_id)
                }
              }
            }, '详情')
            return h('div', [edit, more, del])
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
        userid: sessionStorage.userid
      }
      this.$store.commit('pageLoading', true)
      serverApi('/member/showmember', d,
        response => {
          // console.log(response)
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
    onClickEdit (id) {
      this.$router.push({name: 'UserMemberEdit', params: {id: id}})
    },
    onClickDel (id) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除此条信息？</p>',
        onOk: () => {
          serverApi('/member/delmember', {user_id: id},
            response => {
              this.$Message.info(response.data.msg)
              this.getTableData()
            },
            error => {
              console.log(error)
              this.$Message.error('链接失败！')
            }
          )
        }
      })
    },
    onClickMore (id) {
      this.$router.push({name: 'UserMemberCenter', params: {id: id}})
    }
  }
}
</script>
<style lang="less" scoped>

</style>
