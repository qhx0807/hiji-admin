<template>
  <div class="box">
    <Card :bordered="false" class="mb10">

    </Card>
    <Card :bordered="false">
      <div class="table-box">
        <Table size="small" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
      </div>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer></Page>
      </div>
      <div style="clear:both"></div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'AfterScancodePay',
  data () {
    return {
      tableLoading: false,
      count: 0,
      page: 1,
      pagesize: 10,
      tableData: [],
      columns: [
        {
          title: '#',
          key: 'codepayid',
          width: 60
        },
        {
          title: '活动名称',
          key: 'codepayname',
        },
        {
          title: '城市',
          key: 'codepaycity',
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
          title: '奖励类型',
          key: 'codepaytype',
        },
        {
          title: '享受方式',
          key: 'isentry',
        },
        {
          title: '最高支付',
          key: 'maxfee',
        },
        {
          title: '最低支付',
          key: 'minfee',
        },
        {
          title: '操作',
          key: 'codepayid',
          fixed: 'right',
          width: 120,
          render: (h, params) => {
            let edit =  h('a', {
              on: {
                click: () => {
                  this.onClickEdit(params.row)
                }
              }
            }, '编辑')
            let del =  h('a', {
              style: {
                marginLeft: '12px',
                color: '#f90'
              },
              on: {
                click: () => {
                  this.onClickDel(params.row)
                }
              }
            }, '删除')
            return h('div', [edit, del])
          }
        },
      ]
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.tableLoading = true
      let d = {
        page: this.page,
        pagesize: this.pagesize,
      }
      serverApi('/paymentactive/activitylist', d,
        response => {
          if (response.data.code === 0) {
            this.count = response.data.data.counts
            this.tableData = response.data.data.result
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.tableLoading = false
        },
        error => {
          console.log(error)
          this.tableLoading = false
          this.$Message.error(error.toString())
        }
      )
    },
    onClickEdit (row) {
      this.$router.push({name: 'AfterScancodePayEdit', params: {id: row.codepayid}})
    },
    onClickDel (row) {
      this.$Modal.confirm({
        title: '提示',
        content: '<p>确认删除此条记录？</p>',
        onOk: () => {
          serverApi('/paymentactive/activitydel', {codepayid: row.codepayid},
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
  }
}
</script>
<style lang="less" scoped>

</style>
