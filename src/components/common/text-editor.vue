<template>
  <div class="ueditor">
    <script :id="id" type="text/plain"></script>
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
      type: String,
      default: 'editor'
    }
  },
  created () {},
  mounted () {
    this.editor = UE.getEditor(this.id, this.config)
    this.bool = false
    this.editor.addListener("ready", () => {
      this.bool = true
      this.editor.setContent(this.defaultMsg)
    })
    this.editor.addListener('contentChange', () => {
      this.$emit('ueContentChange')
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
