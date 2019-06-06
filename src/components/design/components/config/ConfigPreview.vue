<template>
  <div class="design-config-box" @click="onSelectDesigner">
    <div class='design-config-title'>{{value.title}}</div>
  </div>
</template>
<script>
export default {
  name: 'ConfigPreview',
  props: {
    value: {
      type: Object,
      default: {}
    }
  },
  data () {
    return {}
  },
  created () {},
  methods: {
    onSelectDesigner () {
      this.$emit('onSelectDesigner')
    },
  }
}
</script>
<style lang="less" scoped>
  .design-config-box{
    color: #fff;
    background-image: url('http://cdn.cqyyy.cn/pic/20190529203116.png');
    height: 64px;
    width: 320px;
    background-repeat: no-repeat;
    background-size: contain;
    cursor: grab;
  }
  .design-config-title{
    display: inline-block;
    padding: 23px 40px 0 60px;
    height: 64px;
    line-height: 40px;
    width: 100%;
    box-sizing: border-box;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    vertical-align: middle;
    color: #fff;
  }
</style>
