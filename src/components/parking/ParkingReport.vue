<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Form label-width="60">
        <Row :gutter="10">
          <Col span="4">
            <FormItem label="建筑名称">
              <Select v-model="searchObj.city">
                <Option v-for="(item, index) in buildingsList" :key="index" :value="item.value">{{item.label}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="车牌号">
              <Input v-model="searchObj.carnum" clearable placeholder="车牌号搜索..."></Input>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="付款状态">
              <Select v-model="searchObj.paymentstatus" clearable>
                <Option value="0">未支付</Option>
                <Option value="1">已支付</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="支付方式">
              <Cascader :data="payMethodsArr" @on-change="onSelectMethods" clearable></Cascader>
              <!-- <Select v-model="searchObj.paymentmethod">
                <Option v-for="(item, index) in payMethodsArr" :key="index" :value="item">{{item}}</Option>
              </Select> -->
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="支付类型">
              <Select v-model="searchObj.payment" clearable>
                <Option v-for="(item, index) in payTypeArr" :key="index" :value="item">{{item}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="10">
          <Col span="4">
            <FormItem label="用户类型" style="margin-bottom:0">
              <Select v-model="searchObj.usertype" clearable>
                <Option v-for="(item, index) in userTypeArr" :key="index" :value="index">{{item}}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="显示字段" style="margin-bottom:0">
              <Dropdown>
                <a href="javascript:void(0)">点击选择条目</a>
                <DropdownMenu slot="list" style="width:250px">
                  <div style="margin:10px">
                    <CheckboxGroup v-model="selectTitleArr">
                      <Row>
                        <Col span="12" v-for="(item, index) in titlesArr" :key="index">
                          <Checkbox  :key="index" :label="item.key">{{item.title}}</Checkbox>
                        </Col>
                      </Row>
                  </CheckboxGroup>
                  </div>
                </DropdownMenu>
              </Dropdown>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="支付开始时间" style="margin-bottom:0" >
              <DatePicker @on-change="selectStartDateTime" clearable type="datetime"></DatePicker>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="支付结束时间" style="margin-bottom:0">
              <DatePicker @on-change="selectEndDateTime" clearable type="datetime"></DatePicker>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem style="margin-bottom:0">
              <Button :loading="tableLoading" @click="onClickFetchData" type="primary">查询</Button>
              <Button style="margin-left:10px" :loading="expLoading" @click="onClickExport">导出</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card :bordered="false">
      <Table border :data="tableData" highlight-row :loading="tableLoading" size="small" height="550" :columns="columns">
        <div slot="footer" class="parking-table-footer">
          <span>合计：</span>
          <span class="item">网上支付：{{collectData.cash}}</span>
          <Divider type="vertical" />
          <span class="item">现金支付费用：{{collectData.cash_cost}}</span>
          <!-- <Divider type="vertical" />
          <span class="item">优惠券：{{collectData.coupon}}</span> -->
          <Divider type="vertical" />
          <!-- <span class="item">网上支付费用：{{collectData.online_cost}}</span>
          <Divider type="vertical" /> -->
          <span class="item">优惠金额总和：{{collectData.preferentialprice}} （核销优惠券：{{collectData.coupon}}）</span>
          <Divider type="vertical" />
          <!-- <span class="item">第三方应付：{{collectData.total}}</span>
          <Divider type="vertical" /> -->
          <span class="item">停车总费用：{{collectData.total_cost}}</span>
          <Divider type="vertical" />
        </div>
      </Table>
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
import { downloadFile } from '../../utlis/tools.js'
export default {
  name: 'ParkingReport',
  data () {
    return {
      tableLoading: false,
      expLoading: false,
      tableData: [],
      counts: 0,
      pageSizeOpts: [10, 15, 25, 50, 70, 100, 200, 300],
      searchObj: {
        city: '',
        startime: '',
        endtime: '',
        paymentstatus: '',
        paymentmethod: '',
        payment: '0',
        usertype: '',
        carnum: '',
        delfield: '',
        exports: '',
        page: 1,
        pagesize: 15,
      },
      columns: [],
      payMethodsArr: [],
      payTypeArr: [],
      titlesArr: [],
      userTypeArr: [],
      orginColunsArr: [],
      selectTitleArr: [],
      collectData: {},
      buildingsList: []
    }
  },
  created () {
    this.getBUildings()
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
          // console.log(response)
          if (response.data.code === 0){
            this.tableData = response.data.data.detail.result
            this.counts =  response.data.data.detail.counts
            this.collectData = response.data.data.collect
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
    getBUildings () {
      serverApi('/parking/buildinglist', null,
        response => {
          console.log(response)
          if (response.data.code === 0){
            this.buildingsList = response.data.data
            if (this.buildingsList.length > 0) {
              this.searchObj.city = this.buildingsList[0].value
              this.getTableData()
              this.getFiltersParams()
            } else {
              this.$Message.warning('无权限访问！')
            }
          }else{
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.tableLoading = false
          this.$Message.error(error.toString())
        }
      )
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
      serverApi('/parking/typelist', null,
        response => {
          if (response.data.code === 0) {
            this.payMethodsArr = response.data.data.paymentmethodinfo
            this.payTypeArr = response.data.data.paymenttype
            this.titlesArr = response.data.data.allfield
            this.columns = response.data.data.allfield.filter(item => item.key != 'parking_record_id')
            this.orginColunsArr = response.data.data.allfield
            this.userTypeArr = response.data.data.usertype
            this.titlesArr.forEach(item => {
              if (item.key != 'parking_record_id') {
                this.selectTitleArr.push(item.key)
              }
            })
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.$Message.error(error.toString())
        }
      )
    },
    onClickFetchData () {
      let tableColumns = this.orginColunsArr.filter(item => {
        return this.selectTitleArr.includes(item.key)
      })
      this.columns = tableColumns
      let arr = this.orginColunsArr.filter(item => {
        return !this.selectTitleArr.includes(item.key)
      })
      let str = []
      arr.forEach(item => {
        str.push(item.key)
      })
      this.searchObj.delfield = str.join(',')
      this.getTableData()
    },
    onSelectMethods (e) {
      if (e.length === 2) {
        this.searchObj.paymentmethod = e[0]
        this.searchObj.payment = e[1]
      } else {
        this.searchObj.paymentmethod = e[0]
        this.searchObj.payment = '0'
      }
    },
    onClickExport () {
      this.expLoading = true
      let d = Object.assign({}, this.searchObj)
      d.exports = 'out'
      serverApi('/parking/online', d,
        response => {
          if (response.data.code === 0){
            downloadFile(response.data.data)
          }else{
            this.$Message.warning(response.data.msg)
          }
          this.expLoading = false
        },
        error => {
          console.log(error)
          this.expLoading = false
          this.$Message.error(error.toString())
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
.parking-table-footer{
  padding: 0 8px;
  .item{
    margin-left: 12px;
  }
}
</style>
