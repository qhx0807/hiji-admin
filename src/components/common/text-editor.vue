<template>
  <div class="ueditor">
    <script id="editor" type="text/plain"></script>
  </div>
</template>

<script>
import '../../../static/UE/ueditor.config'
import '../../../static/UE/ueditor.all.min.js'
import '../../../static/UE/lang/zh-cn/zh-cn.js'
import '../../../static/UE/ueditor.parse.min.js'
export default {
  name: 'TextEditor',
  data () {
    return {
      editor: null
    }
  },
  props: {
    defaultMsg: {
      type: String
    },
    config:{
      type: Object
    }
  },
  created () {},
  mounted () {
    this.editor = UE.getEditor('editor', this.config)
    this.editor.addListener("ready", () => {
      this.editor.setContent(this.defaultMsg)
    })
  },
  methods: {
    getUEContent () {
      return this.editor.getContent()
    },
    getUEContentTxt () {
      return this.editor.getContentTxt()
    }
  },
  destroyed () {
    this.editor.destroy()
  }
}
</script>

<style lang="less">
</style>
