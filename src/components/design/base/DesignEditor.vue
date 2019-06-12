<template>
  <div class="design-editor">
    <p class="design-editor-title">{{desc}}</p>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'DesignEditor',
  props: {
    desc: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  },
  created () {},
  methods: {}
}
</script>
<style lang="less">
  .design-editor{
    position: absolute;
    width: 420px;
    min-height: 28px;
    background-color: #fff;
    border: 1px solid #e5e5e5;
    left: 340px;
    padding: 15px;
    top: 0;
    border-radius: 5px;
    z-index: 5;
    &-title{
      margin: 5px 10px 10px 10px;
      color: #999;
    }
    .ivu-form-item{
      margin-bottom: 4px;
    }
    &::before{
      border: solid transparent;
      border-color: transparent #e5e5e5 transparent transparent;
      border-width: 7px;
      margin-top: -7px;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
      right: 100%;
      top: 20px;
    }
    &::after{
      border: solid transparent;
      border-color: transparent #F8F8F8 transparent transparent;
      border-width: 6px;
      margin-top: -6px;
      content: " ";
      height: 0;
      width: 0;
      position: absolute;
      pointer-events: none;
      right: 100%;
      top: 20px;
    }
  }
</style>
