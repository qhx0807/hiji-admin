import DesignEditor from '../base/DesignEditor.vue'
export default {
  components: {
    DesignEditor
  },
  props: {
    value: Object
  },
  data () {
    return {
      designValue: {}
    }
  },
  created () {
    this.designValue = this.value
  }
}
