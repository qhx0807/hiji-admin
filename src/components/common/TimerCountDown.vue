<template>
  <div class="box">
    <slot></slot>
    <span>
      <span class="tcd-num" v-text="renderObj.day"></span>
      <span class="tcd-text" v-text="d"></span>

      <span class="tcd-num" v-text="renderObj.hour"></span>
      <span class="tcd-text" v-text="h"></span>

      <span class="tcd-num" v-text="renderObj.min"></span>
      <span class="tcd-text" v-text="m"></span>

      <span class="tcd-num" v-text="renderObj.s"></span>
      <span class="tcd-text" v-text="s"></span>
    </span>
  </div>
</template>
<script>
export default {
  name: 'TimerCountDown',
  props: {
    d: {
      type: String,
      default: ':'
    },
    h: {
      type: String,
      default: ':'
    },
    m: {
      type: String,
      default: ':'
    },
    s: {
      type: String,
      default: ''
    },
    startTime: {
      type: Number,
      default: new Date().valueOf()
    },
    endTime: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      timer: null
    }
  },
  computed: {
    renderObj () {
      return {
        day: 2,
        hour: 12,
        min: 23,
        s: 11,
      }
    }
  },
  created () {
    // const xhr = new XMLHttpRequest()
    // xhr.open('get', '/', true)
    // xhr.onreadystatechange = function () {
    //   if (xhr.readyState == 3) {
    //     let date = xhr.getResponseHeader('Date')
    //     console.log(date)
    //   }
    // }
    // xhr.send(null)
  },
  methods: {
    checkTime (i) {
      let num = parseInt(i, 10)
      return num < 10 ? '0' + num : num
    },
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>
<style lang="less">

</style>
