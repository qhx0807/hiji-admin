import IconPreview from './IconPreview.vue'
import IconEditor from './IconEditor.vue'
import combine from '../../base/combineComponents'
const designType = 'icon'
const designDescription = 'Icon图标'

const Icon = combine(IconPreview, IconEditor, designType, designDescription)

Icon.defaultValue = {
  rownum: 5,
  bgimg: '',
  items: []
}

export default Icon
