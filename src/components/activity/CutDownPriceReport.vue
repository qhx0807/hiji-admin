<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Form :label-width="80">
        <Row>
          <!-- <Col span="5">
            <FormItem prop="typename" label="开始时间" style="margin-bottom:0">
              <DatePicker type="date" style="width: 100%" placeholder="选择日期" @on-change="e => searchObj.starttime = e"></DatePicker>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem prop="typename" label="结束时间" style="margin-bottom:0">
              <DatePicker type="date" style="width: 100%" placeholder="选择日期" @on-change="e => searchObj.endtime = e"></DatePicker>
            </FormItem>
          </Col> -->
          <Col span="24">
              <!-- <Button @click="getTableData" type="primary" :loading="isloading">查询</Button> -->
              <Button @click="onClickExport" :loading="isloading">导出</Button>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card :bordered="false">
      <div class="table-box">
        <Table border size="small" height="600" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
      </div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { downloadFile } from '../../utlis/tools.js'
export default {
  name: 'CutDownPriceReport',
  data () {
    return {
      tableLoading: false,
      page: 1,
      pagesize: 10,
      count: 0,
      tableData: [],
      columns: [
        {
          title: '商品',
          key: 'goodsname',
          minWidth: 300
        },
        {
          title: '属性ID',
          key: 'goodstypeid',
          minWidth: 80
        },
        {
          title: '市场价',
          key: 'goodsprice',
          minWidth: 100
        },
        {
          title: '实付金额',
          key: 'price',
          minWidth: 100
        },
        {
          title: '优惠',
          key: 'reduceamount',
          minWidth: 100
        },
        {
          title: '商品数量',
          key: 'goodsnum',
          minWidth: 100
        },
        {
          title: '砍价人数',
          key: 'bnumber',
          minWidth: 100
        },
        {
          title: '砍价次数',
          key: 'bfrequency',
          minWidth: 100
        },
        {
          title: '注册人数',
          key: 'bquantity',
          minWidth: 100
        },
        {
          title: '折扣率',
          key: 'discount',
          minWidth: 100
        },
      ],
      isloading: false
    }
  },
  created () {
    this.getTableData()
  },
  methods: {
    getTableData () {
      this.tableLoading = true
      this.isloading = true
      serverApi('/Activity/bargainreportform', {id: this.$route.params.id},
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
      this.searchObj.page = e
      this.getTableData()
    },
    onClickExport () {
      this.isloading = true
      this.$Message.loading({
        duration: 0,
        content: '加载中...'
      })
      serverApi('/Activity/bargainreportform', {id: this.$route.params.id, exports: 'out'},
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
