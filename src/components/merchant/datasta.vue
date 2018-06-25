<template>
  <div class="box">
    <Row :gutter="10">
      <Col :lg="8" :md="12" :sm="24">
        <Card :bordered="false">
          <Row>
            <Col span="8">12</Col>
            <Col span="16">34</Col>
          </Row>
        </Card>
      </Col>
      <Col :lg="16" :md="12" :sm="24">
        <Card :bordered="false">
          <ICountUp
            :startVal="startVal"
            :endVal="endVal"
            :decimals="decimals"
            :duration="duration"
            :options="options"
            @ready="onReady"
          />
          <button @click="test">test</button>
        </Card>
      </Col>
    </Row>
  </div>
</template>
<script>
import ICountUp from 'vue-countup-v2'
export default {
  name: 'DataSta',
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
    }
  },
  components: {
    ICountUp
  },
  created () {},
  mounted () {},
  methods: {
    onReady (instance, CountUp) {
      this.numAnim = instance
    },
    test () {
      var someValue = 1337
      this.numAnim.update(someValue)
    }
  }
}
</script>
<style lang="less" scoped>

</style>
