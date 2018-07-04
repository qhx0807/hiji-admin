<template>
  <div class="box">
    <Row :gutter="10">
      <Col :lg="8" :md="24" :sm="24">
        <Card :bordered="false" style="margin-bottom:10px">
          <Row type="flex" align="middle">
            <Col span="8">
              <img class="shop-icon" src="../../../static/avatar.jpg" alt="">
            </Col>
            <Col span="16">
              <h4 style="color: #2d8cf0">{{userName}}</h4>
              <p>welcome</p>
            </Col>
          </Row>
        </Card>
        <Card :bordered="false">
          <div style="height: 269px;">
            <Form :label-width="100">
              <FormItem label="日期：" class="list-item">
                <DatePicker
                  :options="dateOptions"
                  type="daterange"
                  placeholder="日期范围"
                  @on-change="onSelectDate"
                  style="width: 220px"
                  :open="openDate"
                  confirm
                  @on-clear="handleClear"
                  @on-ok="handleOk"
                  >
                  <a @click="clickOpenDate">
                    <template v-if="selectDateRange === ''">选择日期范围</template>
                    <template v-else>{{ selectDateRange }}</template>
                  </a>
                </DatePicker>
              </FormItem>
              <FormItem label="交易笔数：" class="list-item">
                <p style="color:#888">{{statisticalData.tradecount}}</p>
              </FormItem>
              <FormItem label="总应收入金额：" class="list-item">
                <p style="color:#888">{{statisticalData.total_fee_sum}}</p>
              </FormItem>
              <FormItem label="实际收入金额：" class="list-item">
                <p style="color:#888">{{statisticalData.cash_fee_sum}}</p>
              </FormItem>
              <FormItem label="优惠金额：" class="list-item">
                <p style="color:#888">{{statisticalData.coupon_fee_sum}}</p>
              </FormItem>
              <FormItem label="补贴金额：" class="list-item">
                <p style="color:#888">{{statisticalData.subsidy_sum}}</p>
              </FormItem>
            </Form>
          </div>
        </Card>
      </Col>
      <Col :lg="16" :md="24" :sm="24">
        <Row :gutter="10">
          <Col :lg="6" :md="6" :sm="12" class="mb10">
            <Card :bordered="false" :padding="0">
              <div class="card-item">
                <div class="card-icon card1bg">
                  <Icon size="40" type="social-yen"></Icon>
                </div>
                <div class="card-content">
                  <h4 class="card1">{{statisticalData.total_fee_sum}}</h4>
                  <p>应收入金额</p>
                </div>
              </div>
            </Card>
          </Col>
          <Col :lg="6" :md="6" :sm="12" class="mb10">
            <Card :bordered="false" :padding="0">
              <div class="card-item">
                <div class="card-icon card2bg">
                  <Icon size="40" type="arrow-graph-up-right"></Icon>
                </div>
                <div class="card-content">
                  <h4 class="card2">
                    <ICountUp
                      :startVal="startVal"
                      :endVal="endVal"
                      :decimals="decimals"
                      :duration="duration"
                      :options="options"
                      @ready="onReady"
                    />
                  </h4>
                  <p>总交易笔数</p>
                </div>
              </div>
            </Card>
          </Col>
          <Col :lg="6" :md="6" :sm="12" class="mb10">
            <Card :bordered="false" :padding="0">
              <div class="card-item">
                <div class="card-icon card3bg">
                  <Icon size="40" type="social-buffer"></Icon>
                </div>
                <div class="card-content">
                  <h4 class="card3">{{statisticalData.coupon_fee_sum}}</h4>
                  <p>总优惠金额</p>
                </div>
              </div>
            </Card>
          </Col>
          <Col :lg="6" :md="6" :sm="12" class="mb10">
            <Card :bordered="false" :padding="0">
              <div class="card-item">
                <div class="card-icon card4bg">
                  <Icon size="40" type="map"></Icon>
                </div>
                <div class="card-content">
                  <h4 class="card4">{{statisticalData.subsidy_sum}}</h4>
                  <p>总补贴金额</p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <Card :bordered="false">
              <v-chart :forceFit="true" :height="300" :data="lineChartData" :scale="scale">
                <v-tooltip :show-title="true" :item-tpl="itemTpl"/>
                <v-axis/>
                <v-line position="days*count"/>
                <v-point position="days*count" shape="circle"/>
              </v-chart>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>
<script>
import serverApi from '../../axios'
import ICountUp from 'vue-countup-v2'
export default {
  name: 'DataSta',
  components: {
    // vChart
  },
  data () {
    return {
      startVal: 0,
      endVal: 0,
      decimals: 0,
      duration: 2.5,
      openDate: false,
      options: {
        useEasing: true,
        useGrouping: true,
        separator: ',',
        decimal: '.',
        prefix: '',
        suffix: ''
      },
      dateOptions: {
        shortcuts: [
          {
            text: '最近一周',
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              return [start, end]
            }
          },
          {
            text: '最近一月',
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              return [start, end]
            }
          },
          {
            text: '最近三月',
            value () {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              return [start, end]
            }
          }
        ]
      },
      numAnim: null,
      lineChartData: [
      ],
      itemTpl: `<li>流水量：{value}</li>`,
      scale: [
        {
          dataKey: 'count',
          min: 0,
        },{
          dataKey: 'days'
        }
      ],
      statisticalData: {},
      selectDateRange: ''
    }
  },
  components: {
    ICountUp
  },
  created () {
    this.getStaData()
    this.getDailyCount()
  },
  computed: {
    userName () {
      return sessionStorage.username || ''
    }
  },
  mounted () {
  },
  methods: {
    onReady (instance, CountUp) {
      this.numAnim = instance
    },
    test () {
      var someValue = 1337.2
      this.numAnim.update(someValue)
      // this.lineChartData.push({year: '2000', value: 14})
    },
    getStaData (datefrom, dateto) {
      let d = {
        datefrom: datefrom || '',
        datato: dateto || ''
      }
      serverApi('/depar/statistical', d,
        response => {
          // console.log(response)
          if (response.data.code == 0) {
            this.statisticalData = response.data.data[0]
            this.endVal = response.data.data[0].tradecount
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.$Message.error('连接失败！')
        }
      )
    },
    onSelectDate (e) {
      this.openDate = false
      if (e.length > 0 && e[0]) {
        this.selectDateRange = e.join('至')
        console.log(e)
        this.getStaData(e[0], e[1])
        this.getDailyCount(e[0], e[1])
      }
    },
    clickOpenDate () {
      this.openDate = !this.openDate
    },
    handleClear () {
      if (this.selectDateRange) {
        this.getStaData()
        this.getDailyCount()
      }
      this.selectDateRange = ''
      this.openDate = false
    },
    handleOk () {
      this.openDate = false
    },
    getDailyCount (datefrom, dateto) {
      let d = {
        starttime: datefrom || '',
        endtime: dateto || ''
      }
      serverApi('/depar/monthcount', d,
        response => {
          // console.log(response)
          if (response.data.code == 0) {
            this.lineChartData = response.data.data
            console.log(this.lineChartData)
          } else {
            this.$Message.warning(response.data.msg)
          }
        },
        error => {
          console.log(error)
          this.$Message.error('连接失败！')
        }
      )
    }
  }
}
</script>
<style lang="less" scoped>
.shop-icon{
  height: 100px;
  width: 100px;
}
.mb10{
  margin-bottom: 10px;
}
.card-item{
  height: 100px;
}
.card-icon{
  float: left;
  width: 60px;
  background-color: rgb(45, 140, 240);
  color: white;
  padding-left: 12px;
  padding-right: 12px;
  height: 100%;
  border-radius: 3px 0 0 3px;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
}
.card1bg{
  background-color: rgb(45, 140, 240);
}
.card2bg{
  background-color: rgb(100, 213, 114);
}
.card3bg{
  background-color: rgb(255, 213, 114);
}
.card4bg{
  background-color: rgb(242, 94, 67);
}
.card1{
  color: rgb(45, 140, 240);
}
.card2{
  color: rgb(100, 213, 114);
}
.card3{
  color: rgb(255, 213, 114);
}
.card4{
  color: rgb(242, 94, 67);
}
.card-content{
  text-align: center;
  h4{
    padding-top: 20px;
    font-size: 30px;
    font-weight: 700;
  }
  p{
    font-size: 12px;
    font-weight: 500;
    color: #C8C8C8;
  }
}
.list-item{
  margin-bottom: 10px;
}
</style>
