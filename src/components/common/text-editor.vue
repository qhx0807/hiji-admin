<template>
  <div class="ueditor">
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
      editor: null,
      bool: false
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
    this.bool = false
    this.editor.addListener("ready", () => {
      this.bool = true
      this.editor.setContent(this.defaultMsg)
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
      if (this.bool) {
        this.editor.setContent(content)
      } else {
        this.editor.addListener("ready", () => {
          this.editor.setContent(content)
        })
      }
    }
  },
  destroyed () {
    this.editor.destroy()
  }
}
</script>

<style lang="less">
</style>
