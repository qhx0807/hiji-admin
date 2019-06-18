<template>
  <div id="app">
    <router-view/>
    <div id="imgViewDom" @click="onClickImgBox" style="disply: none">
      <img @click="onClickImgBox" src="" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    onClickImgBox (e) {
      document.getElementById('imgViewDom').style.display = 'none'
    }
  }
}
</script>

<style lang="less">
html,
body {
  width: 100%;
  height: 100%;
  background: #f5f6f9;
  overflow: hidden;
}
.richtext-wrap{
  table{
    width: 100%;
    margin-bottom: 10px;
    border-collapse: collapse;
    display: table;
    width: auto!important;
    td,th{
      padding: 5px 10px;
      border: 1px solid #ddd;
    }
  }
}
.smooth-dnd-container.vertical > .smooth-dnd-draggable-wrapper{
  overflow: visible!important;
}
.smooth-dnd-container{
  min-height: 0!important;
}
#app {
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  width: 100%;
}
.clear-fix{
  clear: both;
}
.mb10{
  margin-bottom: 10px;
}
.mb12{
  margin-bottom: 12px;
}
.divider{
  border: none;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 25px;
  margin-top: 6px;
}
.preview-box{
  img{
    width: 100%;
    height: auto;
  }
}
#imgViewDom{
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 99999999;
  background: rgba(255, 255, 255,0.8);
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  display: none;
  transition: all ease-in-out .3s;
  img{
    cursor: zoom-out;
  }
}
.tips {
  h4{
    font-size: 14px;
  }
  p{
    font-size: 12px;
    margin-top: 10px;
  }
}
.mb10{
  margin-bottom: 10px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
table {
  background-color: transparent;
}
caption {
  padding-top: 8px;
  padding-bottom: 8px;
  color: #777777;
  text-align: left;
}
th {
  text-align: left;
}
.table {
  width: 100%;
  max-width: 100%;
  margin-bottom: 10px;
  border-collapse: collapse;
}
.table td, .table th{
  padding: 6px;
  border: 1px solid #ddd;
  line-height: 1;
}
.table td.center{
  text-align: center;
}
.table td.hidden{
  display: none;
}
.clearfix:before,
.clearfix:after {
  content: " ";
  display: table;
}
.clearfix:after {
  clear: both;
}
</style>
