<template>
  <Input :size="size" v-model="bgimgUrl">
    <span slot="append">
      <Upload
        :action="uploadApiUrl"
        :on-error="uploadImgErr"
        :on-success="uploadImgSucc"
        :before-upload="uploadImgProgress"
        :show-upload-list="false"
        accept="image/*"
      >
        <span class="unload-btn">上传图片</span>
      </Upload>
    </span>
  </Input>
</template>
<script>
import { uploadApiUrl } from '../../../config'
export default {
  name: 'InputWithUpload',
  props: {
    value: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'default'
    }
  },
  data () {
    return {
      uploadApiUrl: uploadApiUrl,
      bgimgUrl: ''
    }
  },
  created () {
    this.bgimgUrl = this.value
  },
  watch: {
    bgimgUrl (n, o) {
      this.$emit('input', n)
    }
  },
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
        this.bgimgUrl = response.data.url
      } else {
        this.$Message.error('上传失败')
      }
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
.unload-btn{
  cursor: pointer;
}
</style>
