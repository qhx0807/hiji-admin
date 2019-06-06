<template>
  <div class="design-editor">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'DesignEditor',
  data () {
    return {}
  },
  created () {},
  methods: {}
}
</script>
<style lang="less" scoped>
  .design-editor{
    position: absolute;
    width: 420px;
    min-height: 28px;
    background-color: #F8F8F8;
    border: 1px solid #e5e5e5;
    left: 340px;
    padding: 15px 15px 0 15px;
    top: 0;
    border-radius: 5px;
    z-index: 5;
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
