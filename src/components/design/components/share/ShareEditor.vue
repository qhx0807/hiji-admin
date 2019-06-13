<template>
  <DesignEditor :desc="desc">
    <Form :label-width="80">
      <FormItem label="分享标题" required style="margin-bottom:10px">
        <Input v-model="designValue.title"></Input>
      </FormItem>
      <FormItem label="分享描述" required style="margin-bottom:10px">
        <Input v-model="designValue.desc"></Input>
      </FormItem>
      <FormItem label="分享链接" required style="margin-bottom:10px">
        <Input v-model="designValue.link"></Input>
      </FormItem>
      <FormItem label="分享图标">
        <InputWithUpload v-model="designValue.imgUrl" @uploadSuccess="uploadSuccess" />
      </FormItem>
      <FormItem >
        <img height="100px" width="100px" :src="designValue.imgUrl" alt="">
      </FormItem>
    </Form>
  </DesignEditor>
</template>
<script>
import editorMixins from '../../mixins/editorMixins'
import InputWithUpload from '../../common/InputWithUpload.vue'
export default {
  name: 'ShareEditor',
  mixins: [editorMixins],
  components: {
    InputWithUpload
  },
  data () {
    return {}
  },
  created () {
    this.designValue.imgUrl = 'http://cdn.cqyyy.cn/hiji_201906121013233856.jpg'
  },
  methods: {
    uploadSuccess (path) {
      this.designValue.imgUrl = path
    }
  }
}
</script>
<style lang="less" scoped>

</style>
