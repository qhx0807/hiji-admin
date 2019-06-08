<template>
  <DesignEditor>
    <Form :label-width="80">
      <FormItem label="公告" required style="margin-bottom:10px">
        <Input placeholder="请输入" v-model="designValue.content"></Input>
      </FormItem>
      <FormItem label="文字颜色" style="margin-bottom:10px">
        <ColorPicker alpha v-model="designValue.color" @on-active-change="e => designValue.color = e" recommend />
        <Button @click="designValue.color = '#ed6a0c'" style="margin-left:10px">重置</Button>
      </FormItem>
      <FormItem label="背景颜色" style="margin-bottom:10px">
        <ColorPicker alpha v-model="designValue.bgcolor" @on-active-change="e => designValue.bgcolor = e" recommend />
        <Button @click="designValue.bgcolor = '#fffbe8'" style="margin-left:10px">重置</Button>
      </FormItem>
    </Form>
  </DesignEditor>
</template>
<script>
import editorMixins from '../../mixins/editorMixins'
export default {
  name: 'NoticeEditor',
  mixins: [editorMixins],
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
