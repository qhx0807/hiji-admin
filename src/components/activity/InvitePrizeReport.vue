<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Form :label-width="80">
        <Row>
          <Col span="5">
            <FormItem prop="typename" label="开始时间" style="margin-bottom:0">
              <DatePicker type="date" style="width: 100%" placeholder="选择日期" @on-change="e => searchObj.starttime = e"></DatePicker>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem prop="typename" label="结束时间" style="margin-bottom:0">
              <DatePicker type="date" style="width: 100%" placeholder="选择日期" @on-change="e => searchObj.endtime = e"></DatePicker>
            </FormItem>
          </Col>
          <Col span="14">
            <FormItem prop="typename" style="margin-bottom:0">
              <Button @click="getTableData" type="primary" :loading="isloading">查询</Button>
              <Button style="margin-left:10px" @click="onClickExport" :loading="sisloading">导出</Button>
              <Button style="margin-left:10px" @click="onClickUserExport" :loading="userloading">导出邀请人详情</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card :bordered="false">
      <div class="table-box">
        <Table height="500" border size="small" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
      </div>
      <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-page-size-change="onChangeSize" @on-change="changePage" show-sizer></Page>
      </div>
      <div style="clear:both"></div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { downloadFile } from '../../utlis/tools.js'
export default {
  name: 'InvitePrizeReport',
  data () {
    return {
      tableLoading: false,
      userloading: false,
      page: 1,
      pagesize: 10,
      count: 0,
      tableData: [],
      columns: [
        {
          title: '邀请人账户',
          key: 'phone',
          minWidth: 120
        },
        {
          title: '邀请注册人数',
          key: 'invitenum',
          minWidth: 120
        },
        {
          title: '邀请人获得奖励数量',
          key: 'invitegetnum',
          minWidth: 120
        },
        {
          title: '邀请人获得奖励名称',
          key: 'invitegetgoodsname',
          minWidth: 120
        },
        {
          title: '邀请人获得奖励ID',
          key: 'invitegetprizeid',
          minWidth: 120
        },
        {
          title: '注册用户获得奖励数量',
          key: 'invitedgetnum',
          minWidth: 120,
        },
        {
          title: '注册用户获得奖励名称',
          key: 'invitedgetgoodsname',
          minWidth: 120
        },
        {
          title: '注册用户获得奖励ID',
          key: 'invitedgetprizeid',
          minWidth: 120
        }
      ],
      isloading: false,
      sisloading: false,
      searchObj: {
        starttime: '',
        endtime: '',
        exports: '',
        page: 1,
        pagesize: 10
      }
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.tableLoading = true
      this.isloading = true
      this.searchObj.exports = ''
      serverApi('/activity/invitereportform', this.searchObj,
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.count = response.data.data.counts
            this.tableData = response.data.data.result
          } else {
            this.$Message.warning(response.data.msg)
          }
          this.tableLoading = false
          this.isloading = false
        },
        error => {
          console.log(error)
          this.tableLoading = false
          this.isloading = false
          this.$Message.error(error.toString())
        }
      )
    },
    changePage (e) {
      this.searchObj.page = e
      this.getTableData()
    },
    onChangeSize (e) {
      this.searchObj.pagesize = e
      this.getTableData()
    },
    onClickExport () {
      this.sisloading = true
      this.$Message.loading({
        duration: 0,
        content: '加载中...'
      })
      this.searchObj.exports = 'out'
      console.log(this.searchObj)
      serverApi('/activity/invitereportform', this.searchObj,
        response => {
          this.$Message.destroy()
          this.sisloading = false
          if (response.data.code === 0) {
            downloadFile(response.data.data)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.sisloading = false
          this.$Message.destroy()
          console.log(error)
          this.$Message.warning('连接失败！')
        }
      )
    },
    onClickUserExport () {
      this.userloading = true
      this.$Message.loading({
        duration: 0,
        content: '加载中...'
      })
      this.searchObj.exports = 'out'
      console.log(this.searchObj)
      serverApi('/activity/invitereport2', this.searchObj,
        response => {
          this.$Message.destroy()
          this.userloading = false
          if (response.data.code === 0) {
            downloadFile(response.data.data)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.userloading = false
          this.$Message.destroy()
          console.log(error)
          this.$Message.warning('连接失败！')
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>

</style>
