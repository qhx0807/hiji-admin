<template>
  <div class="box">
    <Row :gutter="10">
      <Col :lg="8" :md="12" :sm="24">
        <Card :bordered="false">
          <Row>
            <Col span="8"><button @click="test">test</button></Col>
            <Col span="16">34</Col>
          </Row>
        </Card>
      </Col>
      <Col :lg="16" :md="12" :sm="24">
        <!-- <Card :bordered="false">
          <ICountUp
            :startVal="startVal"
            :endVal="endVal"
            :decimals="decimals"
            :duration="duration"
            :options="options"
            @ready="onReady"
          />
          <button @click="test">test</button>
        </Card> -->
        <Row>
          <Col span="24">
            <Card :bordered="false">
              <v-chart :forceFit="true" :height="300" :data="lineChartData" :scale="scale">
                <v-tooltip :show-title="true" :item-tpl="itemTpl"/>
                <v-axis/>
                <v-line position="year*value"/>
                <v-point position="year*value" shape="circle"/>
              </v-chart>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>
<script>

import ICountUp from 'vue-countup-v2'
export default {
  name: 'DataSta',
  components: {
    // vChart
  },
  data () {
    return {
      startVal: 0,
      endVal: 100,
      decimals: 0,
      duration: 2.5,
      options: {
        useEasing: true,
        useGrouping: true,
        separator: ',',
        decimal: '.',
        prefix: '',
        suffix: ''
      },
      numAnim: null,
      lineChartData: [
        { year: '1991', value: 3 },
        { year: '1992', value: 4 },
        { year: '1993', value: 3.5 },
        { year: '1994', value: 5 },
        { year: '1995', value: 4.9 },
        { year: '1996', value: 6 },
        { year: '1997', value: 7 },
        { year: '1998', value: 9 },
        { year: '1999', value: 13 },
      ],
      itemTpl: `<li>数量：{value}</li>`,
      scale: [
        {
          dataKey: 'value',
          min: 0,
        },{
          dataKey: 'year',
          min: 0,
          max: 1,
        }
      ]
    }
  },
  components: {
    ICountUp
  },
  created () {
    console.log(1)
  },
  mounted () {},
  methods: {
    onReady (instance, CountUp) {
      this.numAnim = instance
    },
    test () {
      var someValue = 1337
      // this.numAnim.update(someValue)
      this.lineChartData.push({year: '2000', value: 14})
    }
  }
}
</script>
<style lang="less" scoped>

</style>
