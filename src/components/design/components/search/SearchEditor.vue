<template>
  <DesignEditor :desc="desc">
    <Form :label-width="80">
      <Row>
        <Col span="12">
          <FormItem label="背景颜色" style="margin-bottom:10px">
            <ColorPicker alpha v-model="designValue.bgcolor" @on-active-change="e => designValue.bgcolor = e" recommend />
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="顶部固定" style="margin-bottom:10px">
            <i-switch v-model="designValue.fixed">
              <span slot="open">开</span>
              <span slot="close">关</span>
            </i-switch>
          </FormItem>
        </Col>
      </Row>
      <FormItem label="占位文字" required style="margin-bottom:10px">
        <Input placeholder="请输入" v-model="designValue.placeholder"></Input>
      </FormItem>
      <FormItem label="显示扫码" required style="margin-bottom:10px">
        <i-switch v-model="designValue.scan">
          <span slot="open">开</span>
          <span slot="close">关</span>
        </i-switch>
      </FormItem>
      <FormItem label="前置文字" required style="margin-bottom:10px">
        <Input placeholder="请输入" v-model="designValue.prefix"></Input>
      </FormItem>
      <FormItem label="文字颜色" style="margin-bottom:10px">
        <ColorPicker alpha v-model="designValue.color" @on-active-change="e => designValue.color = e" recommend />
      </FormItem>
      <FormItem label="背景图" style="margin-bottom:10px">
        <InputWithUpload v-model="designValue.bgimg"></InputWithUpload>
      </FormItem>
    </Form>
  </DesignEditor>
</template>
<script>
import editorMixins from '../../mixins/editorMixins'
import InputWithUpload from '../../common/InputWithUpload.vue'
export default {
  name: 'SearchEditor',
  mixins: [editorMixins],
  components: {
    InputWithUpload
  },
  data () {
    return {}
  },
  created () {},
  methods: {
  }
}
</script>
<style lang="less" scoped>

</style>
