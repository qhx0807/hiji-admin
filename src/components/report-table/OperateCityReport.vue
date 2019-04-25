<template>
  <div class="box">
    <Card :bordered="false" class="mb10">
      <Form :label-width="60">
        <Row>
          <Col span="5">
            <FormItem prop="typename" label="本期" style="margin-bottom:0">
              <DatePicker type="daterange" style="width: 100%" placeholder="选择日期范围" @on-change="e => {searchObj.starttime = e[0];searchObj.endtime=e[1]}"></DatePicker>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem prop="typename" label="对比期" style="margin-bottom:0">
              <DatePicker type="daterange" style="width: 100%" placeholder="选择日期范围" @on-change="e => {searchObj.upstarttime = e[0];searchObj.upendtime=e[1]}"></DatePicker>
            </FormItem>
          </Col>
          <Col span="14">
            <FormItem prop="typename" style="margin-bottom:0">
              <Button @click="getTableData" type="primary" :loading="isloading">查询</Button>
              <Button style="margin-left:10px" @click="onClickExport" :loading="isloading">导出</Button>
              <!-- <Dropdown style="margin-left: 10px">
                <Button :loading="isloading">导出 <Icon type="ios-arrow-down"></Icon>
                </Button>
                <DropdownMenu slot="list">
                  <DropdownItem>驴打滚</DropdownItem>
                  <DropdownItem>炸酱面</DropdownItem>
                  <DropdownItem disabled>豆汁儿</DropdownItem>
                </DropdownMenu>
              </Dropdown> -->
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Card>
    <Card :bordered="false">
      <div class="table-box">
        <Table height="500" border size="small" :loading="tableLoading" :columns="columns" :data="tableData"></Table>
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
  name: 'OperateCityReport',
  data () {
    return {
      tableLoading: false,
      page: 1,
      pagesize: 10,
      count: 0,
      tableData: [],
      columns: [
        {
          title: '城市',
          key: 'areaidb',
          align: 'center',
          width: 100,
          fixed: 'left',
        },
        {
          title: '团购',
          align: 'center',
          children: [
            {
              title: '订单数量',
              align: 'center',
              children: [
                {
                  title: '本期',
                  align: 'right',
                  key: 'tgordernumb',
                  width: 100
                },
                {
                  title: '对比期',
                  align: 'right',
                  key: 'tgordernumd',
                  width: 100
                }
              ]
            },
            {
              title: '定价金额',
              align: 'center',
              children: [
                {
                  title: '本期',
                  align: 'right',
                  key: 'tgamountb',
                  width: 100
                },
                {
                  title: '对比期',
                  align: 'right',
                  key: 'tgamountd',
                  width: 100
                }
              ]
            },
            {
              title: '付款金额',
              align: 'center',
              children: [
                {
                  title: '本期',
                  align: 'right',
                  key: 'tgcashb',
                  width: 100
                },
                {
                  title: '对比期',
                  align: 'right',
                  key: 'tgcashd',
                  width: 100
                }
              ]
            },
            {
              title: '平台优惠',
              align: 'center',
              children: [
                {
                  title: '本期',
                  align: 'right',
                  key: 'tgcouponb',
                  width: 100
                },
                {
                  title: '对比期',
                  align: 'right',
                  key: 'tgcoupond',
                  width: 100
                }
              ]
            },
            {
              title: '商家优惠',
              align: 'center',
              children: [
                {
                  title: '本期',
                  align: 'right',
                  key: 'tgmerchantcouponb',
                  width: 100
                },
                {
                  title: '对比期',
                  align: 'right',
                  key: 'tgmerchantcoupond',
                  width: 100
                }
              ]
            },
            {
              title: '扣点金额',
              align: 'center',
              children: [
                {
                  title: '本期',
                  align: 'right',
                  key: 'tgpointspriceb',
                  width: 100
                },
                {
                  title: '对比期',
                  align: 'right',
                  key: 'tgpointspriced',
                  width: 100
                }
              ]
            },
            {
              title: '附加金额',
              align: 'center',
              children: [
                {
                  title: '本期',
                  align: 'right',
                  key: 'tgfeeb',
                  width: 100
                },
                {
                  title: '对比期',
                  align: 'right',
                  key: 'tgfeed',
                  width: 100
                }
              ]
            },
          ]
        },
        {
          title: '扫码买单',
          align: 'center',
          children: [
            {
              title: '交易数量',
              align: 'center',
              children: [
                {
                  title: '本期',
                  align: 'right',
                  key: 'smordernumb',
                  width: 100
                },
                {
                  title: '对比期',
                  align: 'right',
                  key: 'smordernumd',
                  width: 100
                }
              ]
            },
            {
              title: '交易金额',
              align: 'center',
              children: [
                {
                  title: '本期',
                  align: 'right',
                  key: 'smamountb',
                  width: 100
                },
                {
                  title: '对比期',
                  align: 'right',
                  key: 'smamountd',
                  width: 100
                }
              ]
            },
            {
              title: '付款金额',
              align: 'center',
              children: [
                {
                  title: '本期',
                  align: 'right',
                  key: 'smcashb',
                  width: 100
                },
                {
                  title: '对比期',
                  align: 'right',
                  key: 'smcashd',
                  width: 100
                }
              ]
            },
            {
              title: '平台优惠',
              align: 'center',
              children: [
                {
                  title: '本期',
                  align: 'right',
                  key: 'smcouponb',
                  width: 100
                },
                {
                  title: '对比期',
                  align: 'right',
                  key: 'smcoupond',
                  width: 100
                }
              ]
            },
            {
              title: '商家优惠',
              align: 'center',
              children: [
                {
                  title: '本期',
                  align: 'right',
                  key: 'smmerchantcouponb',
                  width: 100
                },
                {
                  title: '对比期',
                  align: 'right',
                  key: 'smmerchantcoupond',
                  width: 100
                }
              ]
            },
          ]
        },
        {
          title: '停车缴费',
          align: 'center',
          children: [
            {
              title: '交易数量',
              align: 'center',
              children: [
                {
                  title: '本期',
                  align: 'right',
                  key: 'carordernumb',
                  width: 100
                },
                {
                  title: '对比期',
                  align: 'right',
                  key: 'carordernumd',
                  width: 100
                }
              ]
            },
            {
              title: '交易金额',
              align: 'center',
              children: [
                {
                  title: '本期',
                  align: 'right',
                  key: 'caramountb',
                  width: 100
                },
                {
                  title: '对比期',
                  align: 'right',
                  key: 'caramountd',
                  width: 100
                }
              ]
            },
            {
              title: '付款金额',
              align: 'center',
              children: [
                {
                  title: '本期',
                  align: 'right',
                  key: 'carcashb',
                  width: 100
                },
                {
                  title: '对比期',
                  align: 'right',
                  key: 'carcashb',
                  width: 100
                }
              ]
            },
            {
              title: '商户优惠',
              align: 'center',
              children: [
                {
                  title: '本期',
                  align: 'right',
                  key: 'carmerchantcouponb',
                  width: 100
                },
                {
                  title: '对比期',
                  align: 'right',
                  key: 'carmerchantcoupond',
                  width: 100
                }
              ]
            },
            {
              title: '平台优惠',
              align: 'center',
              children: [
                {
                  title: '本期',
                  align: 'right',
                  key: 'carcouponb',
                  width: 100
                },
                {
                  title: '对比期',
                  align: 'right',
                  key: 'carcoupond',
                  width: 100
                }
              ]
            },
          ]
        },
        // {
        //   title: '物业缴费',
        //   align: 'center',
        //   children: []
        // },
      ],
      isloading: false,
      searchObj: {
        starttime: '',
        endtime: '',
        upstarttime: '',
        upendtime: '',
        exports: '',
      }
    }
  },
  created () {
    // this.getTableData()
  },
  methods: {
    getTableData () {
      this.tableLoading = true
      this.isloading = true
      this.searchObj.exports = ''
      serverApi('/Reportform/cityorderreportform', this.searchObj,
        response => {
          console.log(response)
          if (response.data.code === 0) {
            // let parkingdata = response.data.data.citycarontent
            // let scandata = response.data.data.cityordercontent
            // let groupbuydata = response.data.data.citysaomacontent
            // let tabledata = []
            // let count = 0
            // let cityarr = []
            // parkingdata.forEach(e => cityarr.push(e.areaidb))
            // scandata.forEach(e => cityarr.push(e.areaidb))
            // groupbuydata.forEach(e => cityarr.push(e.areaidb))
            // cityarr = [ ...new Set(cityarr) ]
            // cityarr.forEach(item => {
            //   let pd = parkingdata.find(e => e.areaidb === item)
            //   let sd = scandata.find(e => e.areaidb === item)
            //   let gd = groupbuydata.find(e => e.areaidb === item)
            //   let obj = Object.assign({}, pd, sd, gd)
            //   tabledata.push(obj)
            // })
            // console.log(tabledata)
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
      serverApi('/Reportform/orderreportform', this.searchObj,
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
