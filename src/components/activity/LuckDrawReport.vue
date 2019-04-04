<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Form :label-width="70">
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
              <Button style="margin-left:10px" @click="onClickExport" :loading="isloading">导出</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card :bordered="false">
      <div class="table-box">
        <Table height="600" border size="small" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
      </div>
      <!-- <div style="float: right; padding-top:12px">
        <Page :total="count" show-total :current="page" @on-change="changePage" show-sizer></Page>
      </div>
      <div style="clear:both"></div> -->
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { downloadFile } from '../../utlis/tools.js'
export default {
  name: 'LuckDrawReport',
  data () {
    return {
      tableLoading: false,
      page: 1,
      pagesize: 10,
      count: 0,
      tableData: [],
      columns: [
        // {
        //   title: '#',
        //   key: 'id',
        //   width: 60
        // },
        {
          title: '奖品名称',
          key: 'name',
        },
        {
          title: '抽中次数',
          key: 'num',
        },
        {
          title: '抽奖人数',
          key: 'pnum',
        },
        {
          title: '发放次数',
          key: 'cnum',
        },
        {
          title: '注册人数',
          key: 'zpnum',
        },
      ],
      isloading: false,
      searchObj: {
        starttime: '',
        endtime: '',
        exports: '',
        mainid: ''
      }
    }
  },
  created () {
    this.searchObj.mainid = this.$route.params.id
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.tableLoading = true
      this.isloading = true
      this.searchObj.exports = ''
      serverApi('/Activity/gamereportform', this.searchObj,
        response => {
          console.log(response)
          if (response.data.code === 0) {
            this.tableData = response.data.data
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
      this.page = e
      this.getTableData()
    },
    onClickExport () {
      this.isloading = true
      this.$Message.loading({
        duration: 0,
        content: '加载中...'
      })
      this.searchObj.exports = 'out'
      serverApi('/Activity/gamereportform', this.searchObj,
        response => {
          this.$Message.destroy()
          this.isloading = false
          if (response.data.code === 0) {
            downloadFile(response.data.data)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          this.isloading = false
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
