<template>
  <div class="design-preview-controller" @click="onSelectDesigner" :class="{'isactive':isactive}">
    <div class="btns">
      <div class="design-preview-controller-delete">
        <Poptip
          confirm
          title="确定删除？"
          @on-ok="onConfrimDel">
          <Icon type="ios-close" />
        </Poptip>
      </div>
      <div class="design-preview-controller-top">
        <a class="design-preview-controller-btn-add" @click="onClickInsertComponents('top')">
          <Icon type="ios-add" />
        </a>
        <div class="design-preview-controller-btn-marker">
          <i class="design-preview-marker-cricle-left"></i>
          <div class="design-preview-marker-line"></div>
          <i class="design-preview-marker-cricle-right"></i>
        </div>
      </div>
      <div class="design-preview-controller-bottom">
        <a class="design-preview-controller-btn-add" @click="onClickInsertComponents('bottom')">
          <Icon type="ios-add" />
        </a>
        <div class="design-preview-controller-btn-marker">
          <i class="design-preview-marker-cricle-left"></i>
          <div class="design-preview-marker-line"></div>
          <i class="design-preview-marker-cricle-right"></i>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DesignController',
  props: {
    isactive: {
      type: Boolean,
      default: false
    }
  },
  inheritAttrs: false,
  data () {
    return {}
  },
  created () {},
  methods: {
    onConfrimDel () {
      this.$emit('onRemoveDesigner')
    },
    onSelectDesigner () {
      this.$emit('onSelectDesigner')
    },
    onClickInsertComponents (position) {
      this.$emit('onClickInsertComponents', position)
    }
  }
}
</script>
<style lang="less" scoped>
  .design-preview-controller{
    position: absolute;
    right: 0;
    bottom: 0;
    top: 0;
    left: 0;
    box-sizing: border-box;
    z-index: 19;
    display: block;
    &.isactive{
      border: 1px dashed #38f;
    }
    &:hover{
      .btns{
        visibility: visible;
      }
    }
  }
  .btns{
    visibility: hidden;
  }
  .design-preview-controller-delete{
    position: absolute;
    top: -10px;
    right: -10px;
    z-index: 15;
    cursor: pointer;
    height: 20px;
    width: 20px;
    background-color: #bbb;
    border-radius: 50%;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    i{
      color: #fff;
    }
    &:hover{
      background-color: #999999;
    }
  }
  .design-control-add{
    position: absolute;
    left: 0;
    z-index: 10;
    width: 100%;
  }
  .design-preview-controller-top{
    .design-control-add;
    top: 1px;
  }
  .design-preview-controller-bottom{
    .design-control-add;
    bottom: 0px;
  }
  .design-preview-controller-btn-add{
    z-index: 9;
    position: absolute;
    right: 50%;
    margin-right: -8px;
    top: -9px;
    z-index: 5;
    font-size: 13px;
    width: 17px;
    height: 17px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #fff;
    background-color: #3498db;
    border-radius: 50%;
    text-decoration: none;
  }
  .design-preview-controller-btn-marker{
    position: absolute;
    left: 0;
    bottom: -2px;
    -webkit-box-pack: center;
    justify-content: center;
    align-items: center;
    width: 100%;
    z-index: 4;
    display: flex;
  }
  .design-preview-marker-cricle-left{
    box-sizing: content-box;
    border: 1px solid #59f;
    border-radius: 50%;
    width: 3px;
    height: 3px;
    display: inline-block;
    z-index: 1;
    flex: 0 0 3px;
    background: #fff;
  }
  .design-preview-marker-line{
    background: #59f;
    height: 1px;
    width: 100%;
  }
  .design-preview-marker-cricle-right{
    box-sizing: content-box;
    border: 1px solid #59f;
    border-radius: 50%;
    width: 3px;
    height: 3px;
    display: inline-block;
    z-index: 1;
    flex: 0 0 3px;
    background: #fff;
  }
</style>
