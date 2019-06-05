export default {
  name: 'renderPreview',
  props: {
    value: Object,
    designComponents: Array,
    isactive: {
      type: Boolean,
      default: false
    }
  },
  inheritAttrs: false,
  data () {
    return {}
  },
  created () {
  },
  methods: {
  },
  render (h) {
    let tag = this.designComponents.find(item => {
      return item.designType === this.value.type
    })
    return h(tag, {
      props: {
        value: this.value,
        isactive: this.isactive
      },
      inheritAttrs: false,
      on: this.$listeners,
      attrs: this.$attrs
    })
  }
}
