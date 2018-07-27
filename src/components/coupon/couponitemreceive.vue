<template>
  <div class="box">
    <Card :bordered="false">
      <Input v-model="searchKey" placeholder="搜索关键字..." style="width: 200px"></Input>
      <DatePicker :options="dateOptions" type="daterange" placeholder="日期范围" @on-change="onSelectDate" style="width: 220px"></DatePicker>
      <Button type="primary" style="margin-left:8px" icon="ios-search" @click="onClickSearch">搜索</Button>
      <Button type="primary" style="margin-left:8px" v-if="isAdmin" icon="checkmark" @click="onClickCheckBill">对账</Button>
    </Card>
  </div>
</template>
<script>
import serverApi from '../../axios'
export default {
  name: 'CouponItemReceive',
  data () {
    return {}
  },
  created () {
    let couponid = this.$route.params.id
  },
  methods: {}
}
</script>
<style lang="less" scoped>

</style>
