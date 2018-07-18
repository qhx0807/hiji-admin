<template>
  <div class="ueditor" id="editorWrap">
    <script id="editor" type="text/plain"></script>
  </div>
</template>

<script>
import '../../../static/UE/ueditor.config'
import '../../../static/UE/ueditor.all.min.js'
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
    config: {
      type: Object
    },
    id: {
      type: String
    }
  },
  created () {},
  mounted () {
    this.editor = UE.getEditor('editor', this.config)
    this.editor.addListener("ready", () => {
      this.editor.setContent(this.defaultMsg)
      this.editor.container.addEventListener('click', function(e) {
        e.stopPropagation()
      })
    })
    document.getElementById("editorWrap").addEventListener('click', function(e) {
      e.stopPropagation()
    })
  },
  methods: {
    getUEContent () {
      return this.editor.getContent()
    },
    getUEContentTxt () {
      return this.editor.getContentTxt()
    },
    setContent (content) {
      this.editor.setContent(content)
    }
  },
  destroyed () {
    this.editor.destroy()
  }
}
</script>

<style lang="less">
</style>
