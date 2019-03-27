<template>
  <div class="box">
    <Card :bordered="false">
      <Form :label-width="60">
        <Row :gutter="12">
          <Col span="5">
            <FormItem label="关键字" style="margin-bottom: 0">
              <Input v-model="searchKey" placeholder="搜索关键字..." ></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="开始时间" style="margin-bottom: 0">
              <DatePicker type="datetime" style="width:100%" @on-change="onSelectTime1" placeholder="选择时间"></DatePicker>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="结束时间" style="margin-bottom: 0">
              <DatePicker type="datetime" style="width:100%" @on-change="onSelectTime2" placeholder="选择时间"></DatePicker>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem  style="margin-bottom: 0">
              <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
              <router-link :to="{name: 'UserMemberAdd'}">
                <Button type="primary" style="margin-left:8px" icon="md-add">新增</Button>
              </router-link>
              <Button style="margin-left:8px" icon="ios-cloud-download-outline" :loading="downloading" @click="onClickDownLoad">下载数据</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
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
import { downloadFile } from '../../utlis/tools.js'
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
          title: '积分',
          key: 'intergral',
          width: 80
        },
        {
          title: '下单次数',
          key: 'ordernum',
          width: 80
        },
        {
          title: '合计实付',
          key: 'cash',
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
      ],
      starttime: '',
      endtime: '',
      downloading: false
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
    onSelectTime1 (e) {
      this.starttime = e
    },
    onSelectTime2 (e) {
      this.endtime = e
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
        starttime: this.starttime,
        endtime: this.endtime
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
    },
    onClickDownLoad () {
      let d = {
        like: this.searchKey,
        starttime: this.starttime,
        endtime: this.endtime,
        exports: 'out'
      }
      this.downloading = true
      serverApi('/member/showmember', d,
        response => {
          // console.log(response)
          if (response.data.code === 0){
            downloadFile(response.data.data)
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.downloading = false
        },
        error => {
          console.log(error)
          this.downloading = false
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>

</style>
