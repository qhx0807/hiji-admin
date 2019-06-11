<template>
  <div class="design-editer-add-btn">
    <Upload
      :action="uploadApiUrl"
      :on-error="uploadImgErr"
      :on-success="uploadImgSucc"
      :show-upload-list="false"
      accept="image/*"
    >
      <div class="design-editer-add-btn-text">
        <Icon type="md-add"/>
        <span>{{text}}</span>
      </div>
    </Upload>
  </div>
</template>
<script>
import { uploadApiUrl } from '../../../config'
export default {
  name: 'DesignEditorImageUpload',
  props: {
    text: {
      type: String,
      default: '添加一张图片'
    }
  },
  data () {
    return {
      uploadApiUrl: uploadApiUrl
    }
  },
  created () {},
  methods: {
    uploadImgErr (response, file, fileList) {
      this.$Message.warning('上传失败！')
    },
    uploadImgSucc (response, file) {
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
  }
}
</script>
<style lang="less" scoped>
.design-editer-add-btn{
  background-color: #fff;
  cursor: pointer;
  height: 45px;
  margin-top: 10px;
  border: 1px solid #e5e5e5;
  position: relative;
  &-text{
    padding-left: 12px;
    height: 45px;
    width: 386px;
    display: flex;
    align-items: center;
    color: #38f;
    i{
      font-weight: bold;
      font-size: 16px;
    }
  }
}
</style>
