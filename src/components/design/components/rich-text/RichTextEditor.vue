<template>
  <DesignEditor>
    <Form :label-width="80" inline>
      <FormItem label="页面边距" style="margin-bottom:10px">
        <InputNumber :max="100" :min="0" v-model="designValue.padding"></InputNumber>
      </FormItem>
      <FormItem label="背景颜色" style="margin-bottom:10px">
        <ColorPicker alpha v-model="designValue.bgcolor" @on-active-change="e => designValue.bgcolor = e" recommend />
      </FormItem>
    </Form>
    <TextEdit @ueContentChange="conentChange" ref="ue" :id="id" :config="ueConfig" :defaultMsg="defaultMsg"></TextEdit>
  </DesignEditor>
</template>
<script>
import editorMixins from '../../mixins/editorMixins'
import TextEdit from '../../../common/text-editor'
export default {
  name: 'RichTextEditor',
  mixins: [editorMixins],
  components: {
    TextEdit
  },
  data () {
    return {
      ueConfig: {
        initialFrameWidth: '100%',
        initialFrameHeight: 500,
        zIndex: 99,
        toolbars: [['bold', 'italic',
          'underline','forecolor','fontborder', 'backcolor', 'fontsize', 'fontfamily',
          'justifyleft', 'justifyright','justifycenter', 'justifyjustify',
          'strikethrough','superscript', 'subscript','map', 'inserttable',
           'pasteplain', 'insertimage', 'lineheight', 'edittable', 'edittd', '|',
           'backcolor','insertorderedlist', 'insertunorderedlist',
          'selectall', 'cleardoc', 'link','emotion']
        ]
      },
      defaultMsg: '',
      id: new Date().valueOf() + 'ue'
    }
  },
  created () {
    this.defaultMsg = this.designValue.htmlstr
  },
  mounted () {
    // this.$nextTick(() => {
    //   // this.$refs.ue.
    // })
  },
  methods: {
    conentChange () {
      let str = this.$refs.ue.getUEContent()
      this.designValue.htmlstr = str
    }
  }
}
</script>
<style lang="less" scoped>

</style>
