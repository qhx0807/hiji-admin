import DesignController from './DesignController.vue'

export default function combine (preview, editor, type, desc) {
  return {
    designType: type,
    designDescription: desc,
    props: {
      value: {
        type: Object,
        default: {}
      },
      isactive: {
        type: Boolean,
        default: false
      }
    },
    inheritAttrs: false,
    render (h) {
      const p = h(preview, {
        props: {
          isactive: this.isactive,
          value: this.value
        },
        inheritAttrs: false,
        on: this.$listeners,
        attrs: this.$attrs,
        scopedSlots: {
          default: props => h(DesignController, {
            props: {
              isactive: this.isactive
            },
            on: this.$listeners,
            attrs: this.$attrs
          })
        }
      })

      const e = h(editor, {
        props: {
          value: this.value
        }
      })

      return h('div', {
        style: {
          position: 'relative'
        }
        // on: this.$listeners,
        // attrs: this.$attrs
        // on: {
        //   click: () => {
        //     this.$emit('onSelectDesigner')
        //   }
        // }

      }, [p, this.isactive ? e : null])
    }
  }
}
