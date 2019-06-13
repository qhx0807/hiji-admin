<template>
  <section class="design-img-editor-item">
    <div class="image-container">
      <img :src="imgsrc" alt="">
      <Upload
        :action="uploadApiUrl"
        :on-error="uploadImgErr"
        :on-success="uploadImgSucc"
        :before-upload="uploadImgProgress"
        :show-upload-list="false"
        accept="image/*"
      >
        <div class="image-upload">重新上传</div>
      </Upload>
    </div>
    <div class="controls-container">
      <slot></slot>
    </div>
    <div class="design-editor-item-controler-remove" @click="onClickDel">
      <Icon type="ios-close" />
    </div>
  </section>
</template>
<script>
import { uploadApiUrl } from '../../../config'
export default {
  name: 'ImageItemEditor',
  props: {
    imgsrc: String
  },
  data () {
    return {
      uploadApiUrl: uploadApiUrl,
      msg: null
    }
  },
  created () {},
  methods: {
    uploadImgErr (response, file, fileList) {
      this.$Message.destroy()
      this.$Message.warning('上传失败！')
    },
    uploadImgSucc (response, file) {
      this.$Message.destroy()
      if (response.code == 0) {
        this.$Notice.success({
          title: '上传成功',
          desc: '图片上传成功！',
          render: (h, params) => {
            return h('img', {
              attrs: {
                src: response.data.url
              },
              style: {
                width: 'auto',
                maxHeight: '60px'
              }
            })
          }
        })
        let url = response.data.url
        this.$emit("uploadSuccess", url)
      } else {
        this.$Message.error('上传失败')
      }
    },
    onClickDel () {
      this.$emit('onRemoveImgItem')
    },
    uploadImgProgress () {
      this.$Message.loading({
        content: '文件上传中...',
        onClose: true,
        duration: 0
      })
    }
  }
}
</script>
<style lang="less" scoped>
.design-img-editor-item{
  background-color: #fff;
  margin-bottom: 12px;
  border: 1px solid #e5e5e5;
  padding: 10px;
  cursor: grab;
  display: flex;
  position: relative;
  transition: all .3s ease;
  &:hover{
    .design-editor-item-controler-remove{
      display: flex;
    }
  }
  .image-container{
    width: 120px;
    height: 120px;
    flex: 0 0 120px;
    border: 1px solid #e5e5e5;
    margin-right: 10px;
    position: relative;
    img{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      max-width: 100%;
      max-height: 100%;
    }
    .image-upload{
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 30px;
      background: rgba(0, 0, 0, .6);
      color: #fff;
      text-align: center;
      line-height: 30px;
      z-index: 15;
      cursor: pointer;
    }
  }
  .controls-container{
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
  }
  .design-editor-item-controler-remove{
    display: none;
    position: absolute;
    height: 18px;
    width: 18px;
    top: -9px;
    right: -9px;
    z-index: 15;
    border-radius: 50%;
    background-color: #bbb;
    font-size: 13px;
    // display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    i{
      color: #fff;
    }
    &:hover{
      background-color: #999999;
    }
  }
}
</style>
