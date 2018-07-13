<template>
  <div class="box">
    <Card :bordered="false">
      <div class="tips">
        <h4>提现申请记录</h4>
        <p>此商户的申请提现记录，详情请咨询【<a>宏帆Hi集</a>】  <a @click="goApplyCash" href="javascript: void(0)">去申请提现</a></p>
      </div>
    </Card>
    <Card :bordered="false" style="margin-top: 10px">
      <Row>
        <Col span="24">
          <Table :columns="columns" :loading="tableLoading" :border="false" :data="tableData"></Table>
        </Col>
        <Col span="24">
          <div style="padding-top:12px;text-align:right">
            <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer @on-page-size-change="onChangeSize"></Page>
          </div>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'ApplyRecords',
  data () {
    return {
      count: 0,
      page: 1,
      pageSize: 10,
      tableData: [],
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 80
        },
        {
          title: '商户',
          key: 'merchantcode'
        },
        {
          title: '交易时间',
          key: 'billdate'
        },
        // {
        //   title: '支付宝账户',
        //   key: 'aliphone'
        // },
        // {
        //   title: '账户姓名',
        //   key: 'realname'
        // },
        {
          title: '提现金额',
          key: 'billmoney'
        },
        {
          title: '申请时间',
          key: 'withdrawtime'
        },
        {
          title: '状态',
          key: 'isto',
          render: (h, params) => {
            const waitState = `等待审核`
            const succState = `审核通过`
            const errState = `审核拒绝`
            h('a', {}, '')
            if (params.row.isto == 0) {
              return h('a', {
                style: {
                  color: '#f90'
                }
              }, waitState)
            } else if (params.row.isto == 1) {
              return h('a', {}, succState)
            }else if (params.row.isto == 2) {
              return h('a', {
                style: {
                  color: '#ed3f14'
                }
              }, errState)
            } else {
              return  h('a', {}, waitState)
            }
          }
        }
      ]
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    goApplyCash () {
      this.$router.push({name: 'ApplyCash'})
    },
    getTableData () {
      let d = {
        pagesize: this.pageSize,
        page: this.page
      }
      serverApi('/bill/showapply', d,
        response => {
          // console.log(response)
          if (response.data.code == 0) {
            this.count = response.data.data.count
            this.tableData = response.data.data.result
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
        }
      )
    },
  }
}
</script>
<style lang="less" scoped>

</style>
