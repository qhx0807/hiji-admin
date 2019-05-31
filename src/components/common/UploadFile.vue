<template>
  <div class="upload--box">
    <Upload
      :action="uploadApiUrl"
      :on-error="uploadImgErr"
      :on-success="uploadImgSucc"
      :show-upload-list="false"
      accept="image/*">
      <Button icon="ios-cloud-upload-outline">上传图片</Button>
    </Upload>
  </div>
</template>
<script>
import serverApi from '../../axios'
import { uploadApiUrl } from '../../config/'
export default {
  name: 'UploadFile',
  props: {
    type: {
      type: String,
      default: 'select'
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
      console.log('err'+response,file,fileList)
    },
    uploadImgSucc (response, file) {
      console.log(response)
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
                maxHeight: '80px'
              }
            })
          }
        })
        let url = response.data.url
        this.$emit("uploadSucc", url)
      } else {
        this.$Message.error('上传失败')
      }
    },
  }
}
</script>
<style lang="less" scoped>
.upload--box{
  display: inline-block;
}
</style>
