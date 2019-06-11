<template>
  <DesignEditor>
    <Form :label-width="80">
      <FormItem label="页面名称" style="margin-bottom: 12px">
        <Input placeholder="页面名称..." v-model="designValue.title"></Input>
      </FormItem>
      <FormItem label="背景颜色">
        <ColorPicker alpha v-model="designValue.bgcolor" @on-active-change="onSelectBgcolor" recommend />
        <Button style="margin-left:10px" @click="onClickResetBgcolor">重置</Button>
      </FormItem>
    </Form>
  </DesignEditor>
</template>
<script>
import editorMixins from '../../mixins/editorMixins'
export default {
  name: 'config',
  mixins: [editorMixins],
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
