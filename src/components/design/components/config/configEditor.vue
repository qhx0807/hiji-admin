<template>
  <DesignEditor :desc="desc">
    <Form :label-width="80">
      <FormItem label="页面名称" style="margin-bottom: 12px">
        <Input placeholder="页面名称..." v-model="designValue.title"></Input>
      </FormItem>
      <FormItem label="背景颜色" style="margin-bottom: 12px">
        <ColorPicker alpha v-model="designValue.bgcolor" @on-active-change="onSelectBgcolor" recommend />
        <Button style="margin-left:10px" @click="onClickResetBgcolor">重置</Button>
      </FormItem>
      <FormItem label="背景图片">
        <InputWithUpload v-model="designValue.bgimg" />
      </FormItem>
    </Form>
  </DesignEditor>
</template>
<script>
import editorMixins from '../../mixins/editorMixins'
import InputWithUpload from '../../common/InputWithUpload.vue'
export default {
  name: 'config',
  mixins: [editorMixins],
  components: {
    InputWithUpload
  },
  watch: {
  },
  methods: {
    onClickResetBgcolor () {
      this.designValue.bgcolor = '#ffffff'
    },
    onSelectBgcolor (e) {
      this.designValue.bgcolor = e
    }
  }
}
</script>
<style lang="less" scoped>

</style>
