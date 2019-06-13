<template>
  <DesignEditor :desc="desc">
    <Form :label-width="80">
      <FormItem label="空白高度">
        <Slider v-model="designValue.height" show-tip="always"></Slider>
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
  name: 'WhitespaceEditor',
  mixins: [editorMixins],
  data () {
    return {}
  },
  created () {},
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
