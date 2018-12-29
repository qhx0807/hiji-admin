<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Form label-width="60">
        <Row :gutter="10">
          <Col span="4">
            <FormItem label="建筑名称">
              <Select v-model="searchObj.city">
                <Option value="3">宣汉停车场</Option>
                <Option value="4">邻水停车场</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="车牌号">
              <Input v-model="searchObj.carnum" placeholder="车牌号搜索..."></Input>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="付款状态">
              <Select v-model="searchObj.paymentstatus">
                <Option value="0">未支付</Option>
                <Option value="1">已支付</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="收费方式">
              <Select v-model="searchObj.paymentmethod">
                <Option value="0">未支付</Option>
                <Option value="1">已支付</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="支付方式">
              <Select v-model="searchObj.payment">
                <Option value="0">全部</Option>
                <Option value="1">微信</Option>
                <Option value="2">支付宝</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col span="4">
            <FormItem label="用户类型" style="margin-bottom:0">
              <Select v-model="searchObj.usertype">
                <Option value="0">全部</Option>
                <Option value="1">微信</Option>
                <Option value="2">支付宝</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="显示字段" style="margin-bottom:0">
              <Dropdown>
                <a href="javascript:void(0)">点击选择条目</a>
                <DropdownMenu slot="list">
                  <div style="margin:10px">
                    <CheckboxGroup v-model="disabledGroup">
                      <Checkbox label="香蕉"></Checkbox>
                      <Checkbox label="苹果"></Checkbox>
                      <Checkbox label="西瓜"></Checkbox>
                      <Checkbox label="西瓜"></Checkbox>
                      <Checkbox label="西瓜"></Checkbox>
                      <Checkbox label="西瓜"></Checkbox>
                      <Checkbox label="西瓜"></Checkbox>
                  </CheckboxGroup>
                  </div>
                </DropdownMenu>
              </Dropdown>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="开始时间" style="margin-bottom:0">
              <DatePicker @on-change="selectStartDateTime" type="datetime"></DatePicker>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="结束时间" style="margin-bottom:0">
              <DatePicker @on-change="selectEndDateTime" type="datetime"></DatePicker>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem style="margin-bottom:0">
              <Button :loading="tableLoading" @click="onClickFetchData" type="primary">查询</Button>
              <Button style="margin-left:10px">导出</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card :bordered="false">
      <Table border :data="tableData" highlight-row :loading="tableLoading" size="small" height="550" :columns="columns"></Table>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: right;">
          <Page :total="counts" show-sizer show-total :page-size-opts="pageSizeOpts" :page-size="15" :current.sync="searchObj.page" @on-page-size-change="onChangeSize" @on-change="changePage"></Page>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'ParkingReport',
  data () {
    return {
      tableLoading: false,
      tableData: [],
      counts: 0,
      pageSizeOpts: [10, 15, 25, 50, 70, 100, 200, 300],
      searchObj: {
        city: '3',
        startime: '',
        endtime: '',
        paymentstatus: '',
        paymentmethod: '',
        payment: '',
        usertype: '',
        carnum: '',
        delfield: '',
        exports: '',
        page: 1,
        pagesize: 15,
      },
      columns: [
        {
          key: 'car_num',
          title: '车牌号'
        },
        {
          key: 'user_type',
          title: '用户类型'
        },
        {
          key: 'building_name',
          title: '建筑'
        },
        {
          key: 'park_name',
          title: '停车场'
        },
        {
          key: 'total_cost',
          title: '停车总费用'
        },
        {
          key: 'cash_cost',
          title: '现金支付费用'
        },
        {
          key: 'online_cost',
          title: '网上支付费用'
        },
        {
          key: 'coupon',
          title: '优惠券'
        },
        {
          key: 'payment_type',
          title: '支付类型'
        },
        {
          key: 'payment_method',
          title: '支付方式'
        },
        {
          key: 'total',
          title: '第三方应付'
        },
        {
          key: 'total_cost',
          title: '第三方实付'
        },
        {
          key: 'paytype',
          title: '第三方支付方式'
        },
        {
          key: 'payment_status',
          title: '支付状态'
        },
        {
          key: 'in_time',
          title: '进场时间'
        },
        {
          key: 'out_time',
          title: '出场时间'
        },
        // {
        //   key: 'parking_record_id',
        //   title: '支付id'
        // },
        {
          key: 'pay_finish_time',
          title: '支付完成时间'
        },
      ]
    }
  },
  created () {
    this.getTableData()
    // this.getFiltersParams()
    this.getMenusList()
  },
  computed: {
    dateOptions () {
      return this.$store.state.dateOptions
    },
  },
  methods: {
    getTableData () {
      let d = this.searchObj
      this.tableLoading = true
      serverApi('/parking/online', d,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.tableData = response.data.data.result
            this.counts =  response.data.data.counts
          }else{
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
    onClickFetchData () {
      this.getTableData()
    },
    changePage (e) {
      this.searchObj.page = e
      this.getTableData()
    },
    onChangeSize (e) {
      this.searchObj.pageSize = e
      this.getTableData()
    },
    selectStartDateTime (e) {
      this.searchObj.startime = e
    },
    selectEndDateTime (e) {
      this.searchObj.endtime = e
    },
    getFiltersParams () {
      let d = {
        city: '',
        type: 'usertype'
      }
      serverApi('/parking/typelist', d,
        response => {
          console.log(response)
        },
        error => {
          console.log(error)
          this.$Message.error(error.toString())
        }
      )
    },
    getMenusList () {
      let d = {}
      serverApi('/parking/seemenu', d,
        response => {
          console.log(response)
        },
        error => {
          console.log(error)
          this.$Message.error(error.toString())
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>

</style>
