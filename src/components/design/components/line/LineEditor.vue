<template>
  <DesignEditor>
    <Form :label-width="80">
      <FormItem label="颜色" style="margin-bottom:10px">
        <ColorPicker alpha v-model="designValue.color" @on-active-change="onSelectBgcolor" recommend />
      </FormItem>
      <FormItem label="边框" style="margin-bottom:10px">
        <RadioGroup v-model="designValue.padding">
          <Radio label="0">无边框</Radio>
          <Radio label="12px">左右留边</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="样式">
        <RadioGroup v-model="designValue.style">
          <Radio label="solid">实线</Radio>
          <Radio label="dashed">虚线</Radio>
          <Radio label="dotted">点线</Radio>
        </RadioGroup>
      </FormItem>
    </Form>
  </DesignEditor>
</template>
<script>
import editorMixins from '../../mixins/editorMixins'
export default {
  name: 'LineEditor',
  mixins: [editorMixins],
  data () {
    return {}
  },
  methods: {
    onSelectBgcolor (e) {
      this.designValue.color = e
    }
  }
}
</script>
<style lang="less" scoped>

</style>
